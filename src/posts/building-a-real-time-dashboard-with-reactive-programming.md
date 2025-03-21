---
title: "Building a Real-Time Dashboard with Reactive Programming"
date: "2025-03-25"
description: "Learn how to build a practical real-time dashboard using RxJS, WebSockets, and reactive programming principles."
tags: ["JavaScript", "Reactive Programming", "WebSockets", "RxJS", "Tutorial"]
---

Hey there! Today we're going to build a real-time crypto dashboard that updates live as prices change. I'll show you how to handle WebSockets the right way using reactive programming.

The complete source code for this tutorial is available in [my GitHub repository](https://github.com/ducksonmoon/rx-dashboard).

---

{toc}

## What We're Building

We'll create a dashboard that shows:

- Live cryptocurrency prices from Binance WebSockets
- Price change indicators (green for rising, red for falling)
- Volume indicators using simple visualizations
- Connection status monitor with auto-reconnect
- Price alerts when crypto prices jump or drop suddenly

This project brings together several reactive programming concepts in a real-world application:

1. Handling WebSocket connections with automatic reconnection
2. Transforming data streams with operators
3. Creating derived streams for alerts and UI updates
4. Sharing a single data source among multiple components

Don't worry if some of this sounds complex - I'll break it down into bite-sized pieces!

## Prerequisites

To follow along, you should:

- Know JavaScript basics and ES6 features
- Understand the basic concepts of reactive programming (observables, subscribers)
- Have Node.js and npm installed

If you're new to reactive programming, check out my [introduction to reactive programming](./reactive-programming-from-scratch-in-javascript) post first.

## Setting Up the Project

Let's start by setting up our project structure:

```
dashboard/
  ├── package.json
  ├── webpack.config.js
  ├── index.html
  ├── src/
  │   ├── index.js
  │   ├── websocket-service.js
  │   └── dashboard.js
  └── .gitignore
```

First, create a new folder and set up our project:

```bash
mkdir crypto-dashboard
cd crypto-dashboard
npm init -y
```

Now let's install the stuff we need:

```bash
npm install rxjs webpack webpack-cli webpack-dev-server html-webpack-plugin
npm install --save-dev @babel/core @babel/preset-env babel-loader
```

Don't worry too much about all these packages - they're just the basic toolkit we need to get our app running.

### webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: "./dist",
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};
```

Nothing fancy in our webpack config - just the basics to get our app bundled and served with hot reloading.

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Crypto Dashboard</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background: #f5f5f5;
        color: #333;
      }

      h1 {
        text-align: center;
        margin-bottom: 30px;
      }

      .dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
      }

      .crypto-card {
        background: white;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }

      .crypto-card:hover {
        transform: translateY(-5px);
      }

      .price {
        font-size: 24px;
        font-weight: bold;
      }

      .price-change {
        font-weight: bold;
      }

      .rising {
        color: #4caf50;
      }

      .falling {
        color: #f44336;
      }

      .volume-bar {
        height: 10px;
        margin-top: 10px;
        background: #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
      }

      .volume-indicator {
        height: 100%;
        background: #2196f3;
        width: 0;
        transition: width 0.5s ease-out;
      }

      .status-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        background: white;
        padding: 10px 20px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }

      #connection-status {
        display: inline-block;
        padding: 8px 16px;
        border-radius: 20px;
        background: #ccc;
        cursor: pointer;
      }

      #connection-status.connected {
        background: #4caf50;
        color: white;
      }

      #connection-status.disconnected {
        background: #f44336;
        color: white;
      }

      #connection-status.reconnecting {
        background: #ff9800;
        color: white;
      }

      #alerts {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
      }

      .alert {
        background: white;
        border-left: 5px solid #ff9800;
        padding: 15px;
        margin-top: 10px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    </style>
  </head>
  <body>
    <h1>Crypto Dashboard</h1>

    <div class="status-bar">
      <div>Last updated: <span id="last-updated">--</span></div>
      <div id="connection-status">Connecting...</div>
    </div>

    <div class="dashboard" id="dashboard"></div>

    <div id="alerts"></div>
  </body>
</html>
```

This gives us a nice, clean look for our dashboard with styles for price cards, status indicators, and alerts. I've tried to keep the CSS simple but still make it look good.

## Building the WebSocket Service

Now comes the fun part! Let's create our WebSocket service. This is where reactive programming really shines:

### src/websocket-service.js

```js
import { Observable, Subject, interval, of, throwError } from "rxjs";
import { webSocket } from "rxjs/webSocket";
import {
  catchError,
  map,
  switchMap,
  filter,
  retryWhen,
  delay,
  share,
  takeUntil,
} from "rxjs/operators";

// In a real app, this would point to your actual WebSocket server
const WS_ENDPOINT = "wss://stream.binance.com:9443/ws/!ticker@arr";

export class WebSocketService {
  constructor() {
    // Subject for manually closing the connection
    this.closeSubject = new Subject();

    // Create connection status observable
    this.connectionStatus$ = new Subject();

    // Create a WebSocket subject that can multicast to multiple subscribers
    this.socket$ = webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log("WebSocket connected!");
          this.connectionStatus$.next("connected");
        },
      },
      closeObserver: {
        next: () => {
          console.log("WebSocket closed");
          this.connectionStatus$.next("disconnected");
        },
      },
    });

    // Create shared, auto-reconnecting data stream
    this.data$ = this.socket$.pipe(
      // Retry with exponential backoff - this is crucial for production
      // After hours of debugging flaky connections, I found this pattern works best
      retryWhen((errors) =>
        errors.pipe(
          delay(1000), // Wait 1 second before trying again
          map((error, i) => {
            if (i >= 5) {
              // If we've retried 5 times and still failing, give up
              throw error; // This will be caught by the catchError below
            }
            console.log(`Retrying connection (${i + 1})...`);
            this.connectionStatus$.next("reconnecting");
            return i;
          })
        )
      ),
      // Filter out non-array responses - Binance sometimes sends heartbeats/other data
      filter((data) => Array.isArray(data)),
      // Only take data until someone explicitly calls close()
      takeUntil(this.closeSubject),
      // Process the incoming data
      map((data) => this.processBinanceData(data)),
      // Always add error handling - don't let errors bubble up and break your UI!
      catchError((error) => {
        console.error("WebSocket error:", error);
        this.connectionStatus$.next("error");
        // Return empty result instead of error to keep the stream alive
        return of({ cryptos: [], timestamp: Date.now() });
      }),
      // This is KEY: share() turns a cold observable hot and multicasts to all subscribers
      // Without this, each component subscribing would create its own WebSocket!
      share()
    );

    // Set up heartbeat to detect disconnects that the browser missed
    // This was a hard-won lesson from production - browsers don't always fire onclose!
    this.heartbeat$ = interval(30000).pipe(
      takeUntil(this.closeSubject),
      switchMap(() => {
        if (this.socket$.closed) {
          console.log("Socket closed, attempting to reconnect");
          return throwError(() => new Error("Disconnected"));
        }
        return of(null);
      }),
      catchError(() => {
        this.reconnect();
        return of(null);
      })
    );

    // Start the heartbeat
    this.heartbeat$.subscribe();
  }

  // Process Binance data format into our app format
  processBinanceData(data) {
    // We're only interested in a few major cryptocurrencies
    const tickers = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "ADAUSDT"];
    const filtered = data.filter((item) => tickers.includes(item.s));

    return {
      cryptos: filtered.map((item) => ({
        symbol: item.s.replace("USDT", ""),
        price: parseFloat(item.c),
        priceChange: parseFloat(item.P),
        volume: parseFloat(item.v),
        // Calculate a volume score from 1-10 for visualization
        volumeScore: Math.min(10, Math.ceil(Math.log(parseFloat(item.v)) / 10)),
      })),
      timestamp: Date.now(),
    };
  }

  // Method to get data as an observable
  getData() {
    return this.data$;
  }

  // Get connection status as observable
  getConnectionStatus() {
    return this.connectionStatus$.asObservable();
  }

  // Manual reconnect method
  reconnect() {
    this.socket$.complete();
    this.socket$.connect();
    this.connectionStatus$.next("connecting");
  }

  // Clean close of the WebSocket
  close() {
    this.closeSubject.next();
    this.closeSubject.complete();
    this.socket$.complete();
  }
}
```

Okay, I know that looks like a lot of code! But let me break it down for you:

1. We're setting up a WebSocket connection to get real-time crypto prices
2. We add some smart retry logic - if the connection drops, we try again (but not forever)
3. We share one connection between all parts of our app (super important!)
4. We filter and transform the data to make it easier to use

Think of this service like a radio station. It broadcasts data, and different parts of our app can tune in without interfering with each other.

The coolest part? The `share()` operator. Without it, each part of our app would open its own connection - like everyone bringing their own radio to the same concert!

I learned the hard way that browsers sometimes don't tell you when a connection drops - like when your phone switches from WiFi to cellular. That's why we added the heartbeat - it's like regularly asking "Hey, you still there?" so we know when we need to reconnect.

## Building the Dashboard Logic

Now let's create the dashboard that shows our crypto prices. This file's a bit long, but I've added lots of comments:

### src/dashboard.js

```js
import { fromEvent, Subject, merge } from "rxjs";
import {
  map,
  debounceTime,
  distinctUntilChanged,
  throttleTime,
  takeUntil,
  scan,
  buffer,
  switchMap,
  tap,
} from "rxjs/operators";

export class Dashboard {
  constructor(websocketService) {
    this.websocketService = websocketService;
    this.destroy$ = new Subject();
    this.lastPrices = new Map();

    // DOM references
    this.dashboardEl = document.getElementById("dashboard");
    this.lastUpdatedEl = document.getElementById("last-updated");
    this.connectionStatusEl = document.getElementById("connection-status");
    this.alertsEl = document.getElementById("alerts");

    this.initialize();
  }

  initialize() {
    // Observe connection status changes
    this.websocketService
      .getConnectionStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((status) => {
        this.updateConnectionStatus(status);
      });

    // Main data stream
    const data$ = this.websocketService.getData();

    // Update dashboard with latest prices
    data$
      .pipe(
        takeUntil(this.destroy$)
        // This is where reactive programming really helps - we can derive multiple streams
        // from a single data source for different purposes
      )
      .subscribe((data) => {
        this.updateDashboard(data);
      });

    // Create a separate stream just for price alerts
    // This shows the power of creating derived streams with different operators
    data$
      .pipe(
        takeUntil(this.destroy$),
        // Use scan to keep track of previous values and detect big changes
        // Think of scan like a snowball rolling downhill, gathering data as it goes
        scan(
          (acc, data) => {
            const alerts = [];

            data.cryptos.forEach((crypto) => {
              const prev = acc.prices.get(crypto.symbol);
              if (prev) {
                // Calculate percent change since last update
                const pctChange = ((crypto.price - prev) / prev) * 100;

                // Alert on significant changes (more than 0.5% in a single update)
                if (Math.abs(pctChange) > 0.5) {
                  alerts.push({
                    symbol: crypto.symbol,
                    price: crypto.price,
                    change: pctChange,
                    isPositive: pctChange > 0,
                  });
                }
              }

              // Update our tracking map with latest price
              acc.prices.set(crypto.symbol, crypto.price);
            });

            return {
              prices: acc.prices,
              alerts,
            };
          },
          { prices: new Map(), alerts: [] }
        ),
        // Only proceed when there are alerts
        map((result) => result.alerts),
        filter((alerts) => alerts.length > 0)
      )
      .subscribe((alerts) => {
        this.showAlerts(alerts);
      });

    // Create a separate stream for volume analysis
    data$
      .pipe(
        takeUntil(this.destroy$),
        map((data) => {
          // Calculate total volume across all cryptos
          const totalVolume = data.cryptos.reduce(
            (sum, crypto) => sum + crypto.volume,
            0
          );
          return {
            totalVolume,
            cryptos: data.cryptos,
          };
        })
        // We could do sophisticated volume analysis here
      )
      .subscribe((volumeData) => {
        // For now, we're just using this for our UI volume bars
        // but in a real app, you might generate volume-based trading signals
      });
  }

  updateDashboard(data) {
    // Update "last updated" timestamp
    const date = new Date(data.timestamp);
    this.lastUpdatedEl.textContent = date.toLocaleTimeString();

    // Update or create cards for each cryptocurrency
    data.cryptos.forEach((crypto) => {
      let cardEl = document.getElementById(`crypto-${crypto.symbol}`);

      // If this crypto doesn't have a card yet, create one
      if (!cardEl) {
        cardEl = document.createElement("div");
        cardEl.id = `crypto-${crypto.symbol}`;
        cardEl.className = "crypto-card";
        cardEl.innerHTML = `
          <h2>${crypto.symbol}</h2>
          <div class="price">$${crypto.price.toFixed(2)}</div>
          <div class="price-change ${
            crypto.priceChange >= 0 ? "rising" : "falling"
          }">
            ${crypto.priceChange >= 0 ? "▲" : "▼"} ${Math.abs(
          crypto.priceChange
        ).toFixed(2)}%
          </div>
          <div class="volume">
            Volume: ${this.formatVolume(crypto.volume)}
            <div class="volume-bar">
              <div class="volume-indicator" style="width: ${
                crypto.volumeScore * 10
              }%"></div>
            </div>
          </div>
        `;
        this.dashboardEl.appendChild(cardEl);
      } else {
        // Update existing card
        const priceEl = cardEl.querySelector(".price");
        const priceChangeEl = cardEl.querySelector(".price-change");
        const volumeBarEl = cardEl.querySelector(".volume-indicator");

        // Check if price changed to add flash effect
        const prevPrice = this.lastPrices.get(crypto.symbol) || crypto.price;
        const priceChanged = prevPrice !== crypto.price;

        if (priceChanged) {
          // Add flash effect class based on price direction
          const flashClass = crypto.price > prevPrice ? "rising" : "falling";
          priceEl.classList.add(flashClass);

          // Remove flash effect after animation completes
          setTimeout(() => priceEl.classList.remove(flashClass), 1000);
        }

        // Update values
        priceEl.textContent = `$${crypto.price.toFixed(2)}`;
        priceChangeEl.textContent = `${
          crypto.priceChange >= 0 ? "▲" : "▼"
        } ${Math.abs(crypto.priceChange).toFixed(2)}%`;
        priceChangeEl.className = `price-change ${
          crypto.priceChange >= 0 ? "rising" : "falling"
        }`;
        volumeBarEl.style.width = `${crypto.volumeScore * 10}%`;
      }

      // Store current price for next comparison
      this.lastPrices.set(crypto.symbol, crypto.price);
    });
  }

  updateConnectionStatus(status) {
    this.connectionStatusEl.className = status;

    switch (status) {
      case "connected":
        this.connectionStatusEl.textContent = "Connected";
        break;
      case "disconnected":
        this.connectionStatusEl.textContent =
          "Disconnected - Click to reconnect";
        break;
      case "reconnecting":
        this.connectionStatusEl.textContent = "Reconnecting...";
        break;
      case "connecting":
        this.connectionStatusEl.textContent = "Connecting...";
        break;
      default:
        this.connectionStatusEl.textContent =
          "Connection Error - Click to retry";
        break;
    }
  }

  showAlerts(alerts) {
    alerts.forEach((alert) => {
      const alertEl = document.createElement("div");
      alertEl.className = "alert";
      alertEl.innerHTML = `
        <strong>${alert.symbol}</strong> ${alert.isPositive ? "up" : "down"} 
        ${Math.abs(alert.change).toFixed(2)}% to $${alert.price.toFixed(2)}
      `;

      this.alertsEl.appendChild(alertEl);

      // Remove alert after 5 seconds
      setTimeout(() => {
        if (alertEl.parentNode === this.alertsEl) {
          alertEl.style.opacity = "0";
          setTimeout(() => this.alertsEl.removeChild(alertEl), 300);
        }
      }, 5000);
    });
  }

  formatVolume(volume) {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(2)}K`;
    }
    return volume.toFixed(2);
  }

  destroy() {
    // Clean up all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

The dashboard might seem complex, but it's actually doing something really cool: creating three separate views from the same data stream!

1. The main UI update stream shows the current prices
2. The alert stream watches for sudden price jumps
3. The volume stream tracks trading volume (which we could use for more analysis)

This is like having three different TV shows using footage from the same camera. Each show presents the same raw material in a different way.

My favorite trick here is using `scan()` to compare current prices with previous ones. Think of it like a person with a good memory - they can tell you not just the current price but how much it changed from before.

## Tying It All Together

Finally, let's connect everything in our `index.js`:

### src/index.js

```js
import { WebSocketService } from "./websocket-service.js";
import { Dashboard } from "./dashboard.js";

// Initialize the services when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing dashboard...");

  // Create the websocket service
  const websocketService = new WebSocketService();

  // Create the dashboard
  const dashboard = new Dashboard(websocketService);

  // Handle manual reconnect clicks
  document.getElementById("connection-status").addEventListener("click", () => {
    console.log("Manual reconnect requested");
    websocketService.reconnect();
  });

  // Clean up on page unload
  window.addEventListener("beforeunload", () => {
    dashboard.destroy();
  });
});
```

This file is super simple. It just:

1. Sets up our WebSocket service
2. Creates our dashboard
3. Adds a click handler to manually reconnect
4. Makes sure we clean up when the page unloads

It's like the director of a play - making sure all the actors (our components) are in the right place and know their lines.

## Running the Dashboard

Add these scripts to your `package.json`:

```json
"scripts": {
  "start": "webpack serve --mode development",
  "build": "webpack --mode production"
}
```

Then run:

```bash
npm start
```

Visit `http://localhost:8080` and you'll see your reactive dashboard in action!

## Troubleshooting Common Issues

Every developer I know has hit these reactive programming gotchas at some point:

### 1. "My observable isn't doing anything!"

This is almost always because you created the observable but didn't subscribe to it. Remember: **observables are lazy** - they don't do anything until you subscribe.

```js
// This won't work - nothing happens!
webSocket("wss://example.com").pipe(map((data) => processData(data)));

// This works - subscription triggers execution
webSocket("wss://example.com")
  .pipe(map((data) => processData(data)))
  .subscribe((result) => console.log(result));
```

It's like setting up a camera but forgetting to press record!

### 2. "I'm getting multiple WebSocket connections!"

If you see duplicate data or multiple connection messages, you probably forgot to use `share()`. Without it, each subscriber creates its own execution context.

This is like everyone in your family streaming the same Netflix show on different devices instead of watching it together on the TV.

### 3. "My WebSocket keeps disconnecting!"

Network connections are flaky. Always implement:

- Reconnection logic with `retryWhen`
- Heartbeat detection for "zombie" connections
- Status indicators in the UI so users know what's happening

Think of this like a long-distance relationship - you need regular check-ins and a backup plan for when calls drop!

### 4. "My UI is lagging with high-frequency data!"

Too many updates can kill performance. Use throttling operators:

- `debounceTime` - Wait for a pause in events
- `sample` - Take latest value at regular intervals
- `throttleTime` - Limit to one event per time window

This is like checking your email once an hour instead of every time a new message arrives.

### 5. "Memory usage keeps growing!"

The classic memory leak. Usually caused by:

- Not unsubscribing from observables when components are destroyed
- Creating new subscriptions on every render/update
- Keeping references to large datasets

It's like leaving the water running when you leave the house!

## Real-World Lessons

After building several reactive dashboards in production, here's what I've learned:

1. **Start simple, add complexity gradually** - Begin with a basic stream and add operators one at a time, testing as you go.

2. **Centralize your socket handling** - Create one service that manages connections and shares the data stream.

3. **Draw your streams before coding** - I often sketch out my observable pipelines on paper first.

4. **Make error handling a priority** - In a streaming app, errors are part of normal operation, not exceptional cases.

5. **Use the Chrome DevTools Memory panel** - It's invaluable for tracking down RxJS-related memory leaks.

6. **Consider device capabilities** - What works smoothly on your development machine might struggle on low-end devices.

7. **Add visibility into your streams** - For debugging, I temporarily add `.pipe(tap(x => console.log('Stream value:', x)))` to see what's flowing through.

## How It Works Under the Hood

So what's going on behind the scenes that makes this approach so powerful?

### Hot vs Cold Observables

The WebSocket observable created by `webSocket()` is a **hot** observable - it emits values whether something is subscribed or not. This is perfect for real-time data feeds where we don't want to miss events.

Think of hot observables like a live concert - the band plays whether you're in the audience or not. Cold observables are more like a Netflix show - it starts playing when you press play.

When we apply `share()`, we're ensuring that we have exactly one WebSocket connection that multicasts its data to all subscribers. Without `share()`, each subscriber would create its own connection!

### Derived Streams with Pure Functions

We're creating several derived streams from our base data stream:

- Main UI update stream
- Price alert stream
- Volume analysis stream

Each stream applies its own operators to the same base data. This is way cleaner than having multiple event handlers modifying shared state.

It's like cooking - you start with the same ingredients (raw data), but make different dishes (UI updates, alerts) without contaminating the original ingredients.

### Declarative Error Handling

Instead of try/catch blocks scattered throughout our code, we handle errors once at the observable level with `catchError`. This ensures our app stays responsive even when things go wrong.

It's like having one person assigned to handle emergencies instead of everyone panicking when something breaks.

### Memory Management

We're using the `takeUntil(this.destroy$)` pattern to ensure all our subscriptions get cleaned up when the dashboard is destroyed. This prevents memory leaks - a common problem with event-based systems.

Think of it like having one master switch that turns off all the lights when you leave the house.

## Extending the Dashboard

Here are some cool ways you could take this project further:

1. **Add user-defined price alerts** - Let users set price thresholds that trigger notifications
2. **Implement trading signals** - Use technical indicators to suggest buy/sell opportunities
3. **Add candlestick charts** - Use a library like Highcharts to visualize price movements
4. **Create multiple timeframes** - Add options to view different time intervals
5. **Add a news feed** - Integrate cryptocurrency news using another API

## Key Takeaways

As you work with reactive programming for UI apps like this dashboard, remember:

1. **Think in streams** - Data flows from sources through transformations to UI updates
2. **Share connections** - Use `share()` to prevent duplicate WebSockets
3. **Clean up resources** - Always unsubscribe or use `takeUntil`
4. **Handle errors gracefully** - Network issues are normal, not exceptional
5. **Derive don't mutate** - Create new streams instead of modifying shared state

## References & Resources

### Official Documentation

- [RxJS WebSocket API](https://rxjs.dev/api/webSocket/webSocket) - Official documentation for the RxJS WebSocket functionality
- [MDN WebSocket documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - Comprehensive guide to browser WebSockets
- [Binance WebSocket API](https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams) - Documentation for the WebSocket API we're using

### Tutorials & Articles

- [RxJS and WebSockets: A Perfect Match](https://medium.com/@luukgruijs/understanding-rxjs-subjects-339428a1815b) - Deeper dive into using RxJS with WebSockets
- [Building Reactive UIs](https://www.learnrxjs.io/learn-rxjs/recipes/reactive-uis) - Patterns for building reactive user interfaces

### Libraries & Tools

- [RxJS](https://rxjs.dev/) - The reactive extensions library for JavaScript
- [D3.js](https://d3js.org/) - For more advanced visualizations
- [HighCharts](https://www.highcharts.com/) - For financial charting

### Example Projects

- [RxJS Stock Ticker](https://github.com/NicoJuicy/angular-realtime-chart) - Similar project built with Angular
- [Reactive Trader Cloud](https://github.com/AdaptiveConsulting/ReactiveTraderCloud) - Advanced trading platform using reactive principles

### Videos

- [Building Reactive Applications](https://www.youtube.com/watch?v=q--T1LqFJZo) - Conference talk on reactive architecture
- [WebSockets with RxJS](https://www.youtube.com/watch?v=WFas9JqBo8I) - Tutorial on WebSocket handling with RxJS

### Source Code

- [Complete Dashboard Project](https://github.com/ducksonmoon/rx-dashboard) - The full source code for this tutorial on GitHub

## Final Thoughts

Building reactive apps takes a different mindset, but once you get the hang of it, you'll find it's a much cleaner way to handle complex, real-time UIs. The dashboard we've built is just scratching the surface of what's possible.

The real power of reactive programming shines in applications like this one, where:

1. Data arrives continuously and unpredictably
2. Multiple parts of the UI need to respond to the same events
3. Error handling and reconnection logic are crucial
4. You need to make multiple views from the same base data

I hope this tutorial has given you a practical example of how reactive programming can solve real-world problems. Happy coding!
