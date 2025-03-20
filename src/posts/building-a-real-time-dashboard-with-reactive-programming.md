---
title: "Building a Real-Time Dashboard with Reactive Programming"
date: "2025-03-25"
description: "Learn how to build a practical real-time dashboard using RxJS, WebSockets, and reactive programming principles."
tags: ["JavaScript", "Reactive Programming", "WebSockets", "RxJS", "Tutorial"]
---

In our [previous post](/posts/reactive-programming-from-scratch-in-javascript), we explored the theory behind reactive programming. Now, let's get our hands dirty and build something genuinely useful: a real-time dashboard that connects to a WebSocket server and displays live updating data.

This tutorial will be practical but challenging. Don't worry - I'll explain everything in simple terms, even when we're tackling advanced concepts.

The complete source code for this tutorial is available in [my GitHub repository](https://github.com/ducksonmoon/rx-dashboard).

---

{toc}

## What We're Building

Today we're creating a dashboard that displays:

- Live cryptocurrency price updates
- Trading volume indicators
- Price change alerts
- Connection status monitoring

The finished product will look something like this:

```
┌─────────────────────── Crypto Dashboard ───────────────────────┐
│                                                                │
│  BTC: $43,215.67  (+2.4%)    Volume: IIIIIIIII                │
│  ETH: $3,105.82   (-0.9%)    Volume: IIIII                    │
│  SOL: $103.45     (+5.7%)    Volume: IIIIIIII                 │
│  ADA: $1.23       (+0.3%)    Volume: III                      │
│                                                                │
│  [Connected ✓]                    Last update: 2 seconds ago   │
│                                                                │
│  Recent Alerts:                                                │
│  • BTC price jumped 1% in last 5 minutes                       │
│  • ETH volume spike detected                                   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

The cool part? It's all powered by reactive programming!

## Prerequisites

You'll need:

- Basic understanding of JavaScript/HTML
- Node.js installed
- npm or yarn
- Understanding of basic RxJS concepts (observables, operators)

## Project Setup

Let's start with a fresh project:

```bash
mkdir rx-dashboard
cd rx-dashboard
npm init -y
npm install rxjs webpack webpack-cli webpack-dev-server html-webpack-plugin
npm install --save-dev @babel/core @babel/preset-env babel-loader
```

Next, create these files:

1. `index.html` - Our simple dashboard layout
2. `src/index.js` - Main entry point
3. `src/websocket-service.js` - Our WebSocket wrapper
4. `src/dashboard.js` - Dashboard UI logic
5. `webpack.config.js` - Bundler configuration

Let's fill them in one by one:

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

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rx Dashboard</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Oxygen, Ubuntu, Cantarell, sans-serif;
        background: #f5f5f5;
        padding: 20px;
      }
      .dashboard {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      .crypto-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
      }
      .crypto-item {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 4px;
        display: flex;
        justify-content: space-between;
      }
      .price-up {
        color: #4caf50;
      }
      .price-down {
        color: #f44336;
      }
      .status {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        font-size: 14px;
      }
      .connected {
        color: #4caf50;
      }
      .disconnected {
        color: #f44336;
      }
      .alerts {
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #eee;
      }
      .alert-item {
        padding: 8px 12px;
        background: #fff9c4;
        border-left: 4px solid #ffc107;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .volume-bar {
        height: 8px;
        background: #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        margin-top: 5px;
      }
      .volume-fill {
        height: 100%;
        background: #2196f3;
        width: 0%; /* Will be set dynamically */
      }
    </style>
  </head>
  <body>
    <div class="dashboard">
      <div class="header">
        <h2>Crypto Dashboard</h2>
        <div id="connection-status">Connecting...</div>
      </div>

      <div class="crypto-list" id="crypto-list">
        <!-- Crypto items will be inserted here -->
      </div>

      <div class="status">
        <div id="connection-info">Connecting to server...</div>
        <div id="last-update">Waiting for data...</div>
      </div>

      <div class="alerts">
        <h3>Recent Alerts</h3>
        <div id="alerts-container">
          <!-- Alerts will be inserted here -->
        </div>
      </div>
    </div>
  </body>
</html>
```

## Building the WebSocket Service

Now let's create our WebSocket service. This is where reactive programming really shines:

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
      // Retry with exponential backoff
      retryWhen((errors) =>
        errors.pipe(
          delay(1000),
          map((error, i) => {
            if (i >= 5) {
              throw error; // Give up after 5 retries
            }
            console.log(`Retrying connection (${i + 1})...`);
            this.connectionStatus$.next("reconnecting");
            return i;
          })
        )
      ),
      // Filter out non-array responses
      filter((data) => Array.isArray(data)),
      // Only take data until a close is signaled
      takeUntil(this.closeSubject),
      // Process the incoming data
      map((data) => this.processBinanceData(data)),
      // Add error handling
      catchError((error) => {
        console.error("WebSocket error:", error);
        this.connectionStatus$.next("error");
        // Return an empty result instead of error
        return of({ cryptos: [], timestamp: Date.now() });
      }),
      // Use share() to multicast the data to multiple subscribers
      share()
    );

    // Set up heartbeat to detect disconnects
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

There's a lot going on here, so let's break it down:

1. We create a WebSocket connection using RxJS's `webSocket` operator.
2. We use `retryWhen` to implement reconnection logic with backoff.
3. The `share()` operator ensures that multiple components subscribing to our data don't each create their own WebSocket connection.
4. We use various reactive operators to filter, map, and handle errors.
5. We've even added a heartbeat to detect disconnections the browser didn't catch.

## Building the Dashboard Logic

Now let's create the reactive logic for our dashboard:

### src/dashboard.js

```js
import { Subject, merge, interval } from "rxjs";
import {
  map,
  buffer,
  scan,
  filter,
  debounceTime,
  sample,
  distinctUntilChanged,
} from "rxjs/operators";

export class Dashboard {
  constructor(websocketService) {
    this.websocketService = websocketService;

    // Track manual refresh requests
    this.refreshSubject = new Subject();

    // Set up all the observables
    this.setupObservables();

    // Set up DOM elements
    this.cryptoListElem = document.getElementById("crypto-list");
    this.connectionStatusElem = document.getElementById("connection-status");
    this.connectionInfoElem = document.getElementById("connection-info");
    this.lastUpdateElem = document.getElementById("last-update");
    this.alertsContainerElem = document.getElementById("alerts-container");

    // Initialize the dashboard
    this.initialize();
  }

  setupObservables() {
    // Get the base data stream
    this.data$ = this.websocketService.getData();

    // Transform data for UI updates (with throttling)
    this.uiData$ = this.data$.pipe(
      sample(interval(1000)) // Only update UI max once per second to prevent flicker
    );

    // Create price alert observable using a buffer strategy
    this.priceAlerts$ = this.data$.pipe(
      // First, create a stream of all crypto updates
      map((data) => data.cryptos),
      // Explode the array (turn one array into multiple emissions, one for each crypto)
      map((cryptos) => cryptos.flatMap((crypto) => ({ ...crypto }))),
      // Buffer for 5 minutes for each symbol separately
      buffer(interval(5 * 60 * 1000)), // 5 minutes buffer
      // Only continue if buffer has items
      filter((buffer) => buffer.length > 0),
      // Group buffered items by symbol
      map((buffer) => {
        // Group by symbol
        const bySymbol = buffer.reduce((acc, item) => {
          if (!acc[item.symbol]) acc[item.symbol] = [];
          acc[item.symbol].push(item);
          return acc;
        }, {});

        // For each symbol, check if there's a significant price change
        return Object.entries(bySymbol)
          .map(([symbol, items]) => {
            if (items.length < 2) return null;

            const first = items[0].price;
            const last = items[items.length - 1].price;
            const pctChange = ((last - first) / first) * 100;

            // Only alert if change is significant (more than 1% in 5 min)
            if (Math.abs(pctChange) >= 1) {
              return {
                symbol,
                pctChange: pctChange.toFixed(2),
                isUp: pctChange > 0,
                timestamp: Date.now(),
              };
            }
            return null;
          })
          .filter((item) => item !== null);
      }),
      // Flatten the results
      map((alerts) => alerts.flat())
    );

    // Create volume alert observable
    this.volumeAlerts$ = this.data$.pipe(
      // Debounce so we don't process every single update
      debounceTime(10000), // Check every 10 seconds
      // Track volume state over time using scan
      scan(
        (acc, data) => {
          // Initialize or update with the latest data
          if (!acc.prev) {
            return {
              prev: data.cryptos,
              alerts: [],
            };
          }

          // Compare current volumes with previous
          const alerts = data.cryptos
            .map((current) => {
              const prev = acc.prev.find((p) => p.symbol === current.symbol);
              if (!prev) return null;

              // Check for significant volume increase (20%+)
              const volumeIncrease =
                (current.volume - prev.volume) / prev.volume;
              if (volumeIncrease > 0.2) {
                // 20% threshold
                return {
                  symbol: current.symbol,
                  volumeIncrease: (volumeIncrease * 100).toFixed(0),
                  timestamp: Date.now(),
                };
              }
              return null;
            })
            .filter((alert) => alert !== null);

          return {
            prev: data.cryptos,
            alerts,
          };
        },
        { prev: null, alerts: [] }
      ),
      // Only emit when there are new alerts
      filter((result) => result.alerts.length > 0),
      map((result) => result.alerts)
    );

    // Connection status with simpler display text
    this.connectionStatus$ = this.websocketService.getConnectionStatus().pipe(
      map((status) => {
        switch (status) {
          case "connected":
            return { text: "Connected", class: "connected" };
          case "disconnected":
            return { text: "Disconnected", class: "disconnected" };
          case "connecting":
            return { text: "Connecting...", class: "disconnected" };
          case "reconnecting":
            return { text: "Reconnecting...", class: "disconnected" };
          case "error":
            return { text: "Connection Error", class: "disconnected" };
          default:
            return { text: "Unknown", class: "" };
        }
      })
    );

    // Last update time
    this.lastUpdate$ = this.data$.pipe(
      map((data) => {
        const time = new Date(data.timestamp);
        return time.toLocaleTimeString();
      })
    );

    // Combine all alerts into a single stream for the UI
    this.allAlerts$ = merge(
      this.priceAlerts$.pipe(
        map((alerts) =>
          alerts.map((a) => ({
            text: `${a.symbol} price ${
              a.isUp ? "jumped" : "dropped"
            } ${Math.abs(a.pctChange)}% in last 5 minutes`,
            timestamp: a.timestamp,
            type: "price",
          }))
        )
      ),
      this.volumeAlerts$.pipe(
        map((alerts) =>
          alerts.map((a) => ({
            text: `${a.symbol} volume spike detected: +${a.volumeIncrease}%`,
            timestamp: a.timestamp,
            type: "volume",
          }))
        )
      )
    ).pipe(
      scan((allAlerts, newAlerts) => {
        // Add new alerts and keep the list at max 5 items
        return [...newAlerts, ...allAlerts].slice(0, 5);
      }, [])
    );
  }

  initialize() {
    // Subscribe to UI updates
    this.uiData$.subscribe((data) => this.updateCryptoList(data));

    // Subscribe to connection status
    this.connectionStatus$.subscribe((status) => {
      this.connectionStatusElem.textContent = status.text;
      this.connectionStatusElem.className = status.class;
      this.connectionInfoElem.textContent =
        status.class === "connected"
          ? "Live data streaming"
          : "Waiting for connection...";
    });

    // Subscribe to last update time
    this.lastUpdate$.subscribe((time) => {
      this.lastUpdateElem.textContent = `Last update: ${time}`;
    });

    // Subscribe to alerts
    this.allAlerts$.subscribe((alerts) => {
      this.alertsContainerElem.innerHTML = "";

      if (alerts.length === 0) {
        this.alertsContainerElem.innerHTML = "<p>No alerts yet</p>";
        return;
      }

      alerts.forEach((alert) => {
        const alertElem = document.createElement("div");
        alertElem.className = `alert-item alert-${alert.type}`;
        alertElem.textContent = alert.text;
        this.alertsContainerElem.appendChild(alertElem);
      });
    });
  }

  updateCryptoList(data) {
    this.cryptoListElem.innerHTML = "";

    data.cryptos.forEach((crypto) => {
      const isUp = crypto.priceChange >= 0;
      const priceChangeClass = isUp ? "price-up" : "price-down";

      const cryptoItemElem = document.createElement("div");
      cryptoItemElem.className = "crypto-item";

      cryptoItemElem.innerHTML = `
        <div class="crypto-price">
          <strong>${crypto.symbol}:</strong> 
          $${crypto.price.toFixed(2)}
          <span class="${priceChangeClass}">
            (${isUp ? "+" : ""}${crypto.priceChange.toFixed(2)}%)
          </span>
        </div>
        <div class="crypto-volume">
          Volume: 
          <div class="volume-bar">
            <div class="volume-fill" style="width: ${
              crypto.volumeScore * 10
            }%"></div>
          </div>
        </div>
      `;

      this.cryptoListElem.appendChild(cryptoItemElem);
    });
  }

  // Method to manually trigger a refresh
  refresh() {
    this.refreshSubject.next();
  }

  // Clean up
  destroy() {
    this.websocketService.close();
  }
}
```

There's a lot of reactive goodness here:

1. We create multiple observables from our base data stream, each extracting specific information.
2. We use `buffer` to collect 5 minutes of price data for detecting price changes.
3. `scan` helps us maintain state between emissions for volume comparisons.
4. `merge` combines alerts from different sources.
5. We've implemented throttling with `sample` and `debounceTime` to ensure a smooth UI.

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

## How It Works Under the Hood

Let's review what's happening behind the scenes:

1. **WebSocket Connection** - We create a single WebSocket connection using RxJS's `webSocket` that multicasts data to all subscribers
2. **Data Transformation** - Multiple observables transform the data in different ways:
   - Price comparisons over time
   - Volume spike detection
   - Connection status monitoring
3. **UI Synchronization** - Observables update the UI elements when data changes
4. **Error Handling** - Built-in reconnection and error handling keeps the dashboard working
5. **Resource Management** - Proper subscription cleanup prevents memory leaks

The beauty of this approach is how it handles complexity. Consider the price alerts: we're simultaneously:

- Collecting 5 minutes of data
- Grouping by symbol
- Calculating percentage changes
- Filtering for significant changes
- All while handling errors and connection issues

Doing this with traditional callbacks or promises would be much more complicated.

## Reactive Programming Patterns Demonstrated

This project demonstrates several reactive programming patterns:

1. **Hot Observables** - Our WebSocket connection is a hot observable (emits values regardless of subscribers)
2. **Shared Subscription** - Using `share()` to avoid duplicate WebSocket connections
3. **Declarative Data Flow** - We describe the data flow rather than imperatively handling each event
4. **Operator Composition** - Chaining operators to create complex behaviors from simple building blocks
5. **Backpressure Handling** - Using `debounceTime` and `sample` to prevent UI flicker with high-frequency updates
6. **Error Recovery** - Using `retryWhen` and `catchError` for resilient connections

## Extending the Dashboard

Want to take this further? Here are some ideas:

1. Add price alerts for user-defined thresholds
2. Implement candlestick charts with D3.js
3. Save alerts to localStorage
4. Add more crypto pairs
5. Create a watchlist feature

## References & Resources

### Source Code

- [Complete Dashboard Project](https://github.com/ducksonmoon/rx-dashboard) - The full source code for this tutorial on GitHub

### Official Documentation

- [RxJS WebSocket Documentation](https://rxjs.dev/api/webSocket/webSocket) - Official documentation for the RxJS WebSocket API
- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) - Mozilla's reference for the native WebSocket API
- [Binance WebSocket API](https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md) - Reference for the Binance WebSocket API used in this example

### Tutorials & Articles

- [RxJS + WebSockets: A Perfect Match](https://medium.com/@luukgruijs/understanding-rxjs-subjects-339428a1815b) - Article explaining why RxJS and WebSockets work so well together
- [Building Reactive UIs](https://www.learnrxjs.io/learn-rxjs/recipes/http-polling) - Strategies for building responsive, reactive user interfaces
- [WebSockets vs. HTTP](https://blog.pusher.com/websockets-http2/) - Comparison of WebSockets and HTTP for real-time applications

### Libraries & Tools

- [D3.js](https://d3js.org/) - Data visualization library mentioned in the extension ideas
- [TradingView Charts](https://www.tradingview.com/widget/) - Alternative for adding financial charts
- [reconnecting-websocket](https://github.com/joewalnes/reconnecting-websocket) - A simpler alternative if you don't need RxJS's power

### Example Projects

- [RxJS WebSocket Dashboard Example](https://github.com/btroncone/learn-rxjs/tree/master/recipes-web/websocket-game) - Another example of RxJS with WebSockets
- [Reactive Trader Cloud](https://github.com/AdaptiveConsulting/ReactiveTraderCloud) - Open-source real-time trading platform using reactive principles
- [RxJS WebSocket Chat](https://github.com/mrpatiwi/routed-react) - Simple chat application using RxJS and WebSockets

### Videos

- [Managing WebSockets with RxJS](https://www.youtube.com/watch?v=3LKMwkuK0ZE) - Conference talk on reactive WebSocket management
- [Reactive Programming in Practice](https://www.youtube.com/watch?v=uODxUJ5Jwis) - Talk by Ben Lesh (RxJS lead) about real-world reactive applications
- [Creating Dashboards with RxJS](https://www.youtube.com/watch?v=6KtDcpamT8M) - Tutorial on building interactive dashboards

## Final Thoughts

This project shows how reactive programming can handle complex, real-time UI updates with elegance. The code stays organized and maintainable even as features grow.

Most importantly, WebSockets and reactive programming are a natural fit. The continuous stream of data from a WebSocket maps perfectly to observables, and RxJS operators give us powerful tools to transform, filter, and combine that data.

Remember these key takeaways:

1. Use `share()` when multiple components need the same data source
2. Implement reconnection logic with `retryWhen`
3. Control update frequency with `debounceTime` and `sample`
4. Maintain state between emissions with `scan`
5. Handle errors gracefully with `catchError`

Happy coding with reactive streams!
