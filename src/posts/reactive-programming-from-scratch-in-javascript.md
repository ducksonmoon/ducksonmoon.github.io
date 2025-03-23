---
title: "Reactive Programming from Scratch in JavaScript"
date: "2025-03-20"
description: "Learn how to handle async data in JavaScript using streams and observables."
tags: ["JavaScript", "Reactive Programming", "Programming"]
---

Reactive Programming helps you handle user clicks, network calls, and real-time updates in JavaScript. It uses streams and observables to manage all these moving parts without creating a mess of code.

> When I first tried reactive programming, I was totally lost. The whole way of thinking felt alien. After banging my head against the wall (and console.logging EVERYTHING), something finally clicked – and now I can't imagine coding without it. This post is what I wish someone had told me when I started.

---

{toc}

## Why Should You Care About Reactive Programming?

Modern JavaScript apps deal with many things happening at random times:

- User clicks and typing
- Data from API calls
- Timers firing
- Real-time updates

The old way of handling this was with callbacks, promises, or event listeners. But as your app grows, that creates messy code that's hard to follow.

**Reactive programming** gives you a cleaner way to deal with it all. Instead of saying "do this, then do that," you describe how data should flow through your app.

Think of it like plumbing – you connect pipes, add filters, and turn on the water. Your data flows through the system and gets changed along the way.

### Why It's Worth Learning

1. **One way to handle everything**: Button clicks, WebSocket messages - it's all just data flowing through pipes.
2. **Chain things simply**: Change data step by step without nesting callbacks.
3. **Built-in error handling**: Errors flow through the same pipes as your data.
4. **Handle fast data**: Tools to manage too-fast data or multiple sources.

### Real-Life Example

I worked on a stock trading dashboard where the old version was a mess – event listeners everywhere, global variables, and random bugs that broke the UI.

When we rewrote it using reactive programming, the code shrank from 3,000 lines to about 800, bugs disappeared, and we could actually understand what was happening.

> **Takeaway**: Reactive programming isn't just a trend – it's a different way to handle async code that makes complex tasks simpler.

---

## Reactive Basics: The Core Concepts

### **Streams**

A **stream** is just data that arrives over time. It can send three kinds of signals:

1. **Next**: "Here's a new value"
2. **Error**: "Something broke"
3. **Complete**: "No more data coming"

Think of a stream like a conveyor belt at a factory. Items come down the belt, and sometimes the belt stops because of a problem or when all items are processed.

### **Observables and Observers**

An **Observable** is the code version of a stream. When you "subscribe" to it, values start flowing.

It's like a YouTube channel – the content exists, but you only see new videos when you subscribe.

An **Observer** receives data from an observable. It has three main callbacks:

- `next(value)` – "Here's a new value"
- `error(err)` – "Something broke"
- `complete()` – "Done sending data"

### **Subscriptions**

When an observer subscribes to an observable, you get a **subscription**. You can unsubscribe to stop getting updates.

> **Talk**: I once built a page with mouse-move tracking but forgot to unsubscribe when users navigated away. After clicking around a few times, everything got super sluggish – dozens of abandoned observables were still tracking every mouse pixel!

---

## How Observables Work

When you create an observable:

```js
import { Observable } from "rxjs";

const myObservable = new Observable((subscriber) => {
  subscriber.next("Hello");
  subscriber.complete();
});
```

Here's what happens:

1. **`new Observable`**: Saves your function for later.
2. **`subscribe`**: Runs your function and sets up cleanup.
3. **Cleanup**: When the stream ends or someone unsubscribes, cleanup logic runs.

RxJS also has advanced features like:

- **Schedulers**: Control when and where your code runs (animation frames, async tasks)
- **Subjects**: Special observables that can both receive values and send them to multiple subscribers

> **Tip**: Think of observables as "things that send values over time" and you'll be fine for most use cases.

---

## Subscribe and Lifecycle

Here's a typical subscription:

```js
const subscription = myObservable.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
  complete: () => console.log("Done!"),
});
```

The lifecycle is:

1. **Start**: Your observable function runs.
2. **Get data**: `next()` fires when new data arrives.
3. **End**: An `error` or `complete` stops the subscription.
4. **Cancel early**: Call `subscription.unsubscribe()` to stop it yourself.

It's like a meal delivery service: you sign up, get food regularly, and either cancel your plan, the restaurant goes out of business (error), or the meal plan ends (complete).

👉 **Try It Yourself**: Create a simple interval observable that emits a value every second, then unsubscribe after 5 seconds. Notice how the values stop coming even though the interval would continue forever!

---

## Cleanup & Unsubscribing

**Cleanup** runs when a stream finishes or gets unsubscribed:

```js
function fromEvent(element, eventName) {
  return new Observable((observer) => {
    const handler = (event) => observer.next(event);
    element.addEventListener(eventName, handler);

    // Cleanup function
    return () => {
      element.removeEventListener(eventName, handler);
    };
  });
}
```

When someone unsubscribes, that cleanup function runs and removes the event listener, preventing memory leaks.

> **Tip**: Always test your unsubscribe logic! I once crashed an app by forgetting to remove event listeners. After about 2 minutes, the browser froze solid.

⚠️ **Common Pitfall**: Forgetting to unsubscribe is the #1 source of memory leaks in reactive code. Make it a habit to think about the entire lifecycle of your subscriptions!

---

## A Simple Counter Example

Here's a basic example - click a button, count goes up:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Reactive Counter</title>
  </head>
  <body>
    <button id="incBtn">Increment</button>
    <div>Count: <span id="countValue">0</span></div>

    <script>
      // Basic Observable implementation
      function Observable(subscribeFunction) {
        this._subscribeFunction = subscribeFunction;
      }

      Observable.prototype.subscribe = function (observer) {
        const teardown = this._subscribeFunction(observer);
        return {
          unsubscribe: () => {
            if (teardown) teardown();
          },
        };
      };

      function fromEvent(element, eventName) {
        return new Observable((observer) => {
          const handler = (event) => observer.next(event);
          element.addEventListener(eventName, handler);

          return () => element.removeEventListener(eventName, handler);
        });
      }

      // The actual counter logic
      const incBtn = document.getElementById("incBtn");
      const countValue = document.getElementById("countValue");
      let count = 0;

      const clickObservable = fromEvent(incBtn, "click");
      const subscription = clickObservable.subscribe({
        next: () => {
          count++;
          countValue.textContent = count;
        },
      });
    </script>
  </body>
</html>
```

Each button click sends an event, the count increases, and the UI updates. Simple but powerful.

---

## Building Observables From Scratch

Let's create a basic reactive system:

### **Step 1: The Observable Constructor**

```js
function Observable(subscribeFunction) {
  this._subscribeFunction = subscribeFunction;
}

Observable.prototype.subscribe = function (observer) {
  // Make sure observer has all methods
  const safeObserver = {
    next: observer.next || function () {},
    error: observer.error || function () {},
    complete: observer.complete || function () {},
  };

  // Call the function that produces values
  const teardown = this._subscribeFunction(safeObserver);

  // Return a subscription object
  return {
    unsubscribe: () => {
      if (typeof teardown === "function") {
        teardown();
      }
    },
  };
};
```

### **Step 2: A Simple Data Emitter**

```js
const greetingObservable = new Observable((observer) => {
  observer.next("Hello");
  observer.next("Reactive World");
  observer.complete();

  return () => {
    console.log("Cleanup happened");
  };
});

const subscription = greetingObservable.subscribe({
  next: (val) => console.log("Got:", val),
  complete: () => console.log("Stream finished."),
});
```

### **Step 3: Creating Event Streams**

```js
function fromEvent(element, eventName) {
  return new Observable((observer) => {
    const handler = (event) => observer.next(event);
    element.addEventListener(eventName, handler);

    return () => element.removeEventListener(eventName, handler);
  });
}
```

I was blown away by how little code this took! All that event handling power in just a few lines. And it gets even better when we add operators...

---

## Advanced Concepts

### **Hot vs. Cold Observables**

This confused me for weeks until I found this explanation:

- **Cold Observables** are like Netflix – each viewer starts the movie from the beginning.

  - Makes fresh data for each subscriber
  - Everyone gets the full sequence
  - Examples: AJAX calls, timers

- **Hot Observables** are like live TV – you tune in and see what's broadcasting now.
  - Data flows whether you're listening or not
  - Late subscribers might miss earlier values
  - Examples: DOM events, WebSockets

### **Memory Management**

- Always unsubscribe or let streams complete properly. Otherwise, you'll leak memory or waste CPU cycles.
- Consider using operators like `takeUntil(destroySignal$)` in frameworks like Angular.

### **Higher-Order Observables**

An observable can emit other observables. This is like nesting dolls – observables inside observables.

**Visualization**:

```
Observable<Observable<data>> → Observable<data>
```

⚡ **Tip**: Most confusing reactive bugs come from misunderstanding hot vs. cold observables or choosing the wrong flattening operator. Master these concepts and you'll avoid hours of debugging!

---

## Building Operators

Operators transform data in your streams. Here are simple versions:

### **Map Operator**

```js
Observable.prototype.map = function (transformFn) {
  const source = this;
  return new Observable((observer) => {
    const subscription = source.subscribe({
      next: (val) => {
        try {
          // Transform the value and pass it along
          observer.next(transformFn(val));
        } catch (err) {
          observer.error(err);
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });

    return () => subscription.unsubscribe();
  });
};
```

### **Filter Operator**

```js
Observable.prototype.filter = function (predicateFn) {
  const source = this;
  return new Observable((observer) => {
    const subscription = source.subscribe({
      next: (val) => {
        try {
          // Only pass values that match the predicate
          if (predicateFn(val)) observer.next(val);
        } catch (err) {
          observer.error(err);
        }
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });

    return () => subscription.unsubscribe();
  });
};
```

### **Combining Streams (Merging)**

```js
function merge(...observables) {
  return new Observable((observer) => {
    let completedCount = 0;
    const subscriptions = observables.map((obs) =>
      obs.subscribe({
        next: (value) => observer.next(value),
        error: (err) => observer.error(err),
        complete: () => {
          completedCount++;
          // Only complete when ALL streams are done
          if (completedCount === observables.length) {
            observer.complete();
          }
        },
      })
    );

    return () => subscriptions.forEach((sub) => sub.unsubscribe());
  });
}
```

Once these building blocks clicked, everything else started making sense. It's like learning LEGO – once you understand the basic pieces, you can build anything.

🔨 **Build It Yourself**: Try implementing your own `delay(ms)` operator that passes values through after a specified delay. This exercise will cement your understanding of how operators work!

---

## Handling Complex Scenarios

### **Error Handling**

- If an error happens, the stream stops.
- You can add `catchError` or `retry` to recover gracefully.

On one project, our WebSocket kept dropping connection to a price feed. Before adding proper error handling, users saw the app freeze when the connection died. After adding `retry` with increasing delays between attempts, most users never even noticed the brief hiccups.

### **Multiple Streams**

When one observable emits other observables:

| Operator      | What It Does                       | Example                    |
| ------------- | ---------------------------------- | -------------------------- |
| **mergeMap**  | Process all streams at once        | Downloading multiple files |
| **concatMap** | Process one at a time, in order    | Bank customers in line     |
| **switchMap** | Drop previous when new one arrives | Changing TV channels       |

Memory trick:

- **mergeMap**: "More at once"
- **switchMap**: "Stop previous"
- **concatMap**: "Complete one then next"

### **Fast Data**

If data comes too quickly:

- **throttleTime**: Take one value, ignore others for a while
- **debounceTime**: Wait for a pause, then take last value

I learned this when building a search box. Without debouncing, each keystroke fired an API call. With `debounceTime(300)`, it only searched after you stopped typing.

![Throttle vs Debounce visualization](https://via.placeholder.com/600x200?text=Throttle+vs+Debounce+Visualization)
_Illustration: Throttle takes the first value in a time window, while debounce takes the last value after a pause_

---

## Subjects and Multicasting

A **Subject** works as both an observable and an observer:

- You can subscribe to it
- You can send values to it with `.next()`

This lets multiple parts of your code get the same data without re-running expensive operations for each subscriber.

Think of a Subject like a YouTuber who's live-streaming – they create content and broadcast it to many viewers at the same time.

### **Types of Subjects**

1. **Subject**: Basic version - new subscribers only see new values
2. **BehaviorSubject**: New subscribers get the latest value immediately
3. **ReplaySubject**: New subscribers get previous values
4. **AsyncSubject**: Only gives the last value when complete

### **Sharing Implementation**

- Functions like `share()`, `publish()`, and `refCount()` in RxJS wrap your observable in a subject behind the scenes, making sure the observable only runs once even with multiple subscribers.

📊 **Comparison**: Using subjects vs multiple observables can reduce network requests by 80% or more in a complex app with many components needing the same data!

---

## Advanced Operators & Patterns

RxJS has tons of operators. You don't need to memorize them all, but understanding the main ones helps a lot.

### **Managing Nested Observables**

If an observable emits other observables, you need flattening operators:

- **mergeMap**: Runs all inner observables at once; combines results into one stream.
- **switchMap**: Cancels the previous inner observable when a new one comes (perfect for search as-you-type).
- **concatMap**: Processes inner observables one at a time, in order.

### **Combining Streams**

1. **combineLatest(obsA, obsB)**: Emits whenever any source emits, giving the latest values from each.
2. **forkJoin(obsA, obsB)**: Waits for all observables to finish, then gives their final values. Great for running multiple API calls and getting all results at once.
3. **withLatestFrom**: Like combineLatest, but only emits when the main observable emits.

### **Error Handling**

- **catchError**: Catch errors and return a fallback (like `of('default value')`).
- **retry(n)**: Try subscribing again up to n times if the observable fails.

### **Controlling Fast Data**

- **throttleTime(ms)**: Emit a value, then ignore others for a period.
- **debounceTime(ms)**: Wait for a quiet period before emitting the latest value.
- **bufferTime(ms)**: Collect values for a period, then emit them as an array.

I use these operators daily to tame wild streams of events. For mouse moves or scroll events, they're essential to keep your app running smoothly without wasting processing power.

### **Performance Tuning**

RxJS has schedulers to control when code runs:

- **queueScheduler**: Runs tasks right away, one after another.
- **asyncScheduler**: Runs tasks later (like setTimeout).
- **animationFrameScheduler**: Runs tasks with requestAnimationFrame for smooth visuals.

Being honest, I don't use schedulers much, but when I do, it's usually the `animationFrameScheduler` to make UI updates buttery smooth.

🏎️ **Performance Tip**: For smooth 60fps animations, pipe your UI-updating observables through `observeOn(animationFrameScheduler)` to sync with the browser's render cycle.

---

## Real-World Examples

Let's see two examples that show advanced reactive patterns in action.

### Multiple API Calls with Retry

**Scenario**: You need three API calls (user info, posts, comments). You want them all in parallel, but if any fail, you'll retry a few times before giving up.

```js
import { ajax } from "rxjs/ajax";
import { forkJoin, of } from "rxjs";
import { catchError, retry, map } from "rxjs/operators";

function getUser() {
  return ajax.getJSON("https://api.example.com/user").pipe(
    retry(2), // Try up to 3 times total
    catchError((err) => of({ error: true, details: err })) // Return fallback on failure
  );
}

function getPosts() {
  return ajax.getJSON("https://api.example.com/posts").pipe(
    retry(2),
    catchError((err) => of({ error: true, details: err }))
  );
}

function getComments() {
  return ajax.getJSON("https://api.example.com/comments").pipe(
    retry(2),
    catchError((err) => of({ error: true, details: err }))
  );
}

// Get all data at once
forkJoin([getUser(), getPosts(), getComments()])
  .pipe(
    map(([user, posts, comments]) => {
      return { user, posts, comments };
    })
  )
  .subscribe({
    next: (allData) => console.log("All results:", allData),
    error: (err) => console.error("Total error:", err),
    complete: () => console.log("All done!"),
  });
```

- **forkJoin**: Waits for each call to finish, then gives all results at once.
- **retry(2)**: Each request tries up to three times total if it fails.
- **catchError**: Returns a fallback object instead of crashing the whole stream.

Before finding `forkJoin`, I built a dashboard using nested promises and manual error tracking. The reactive approach cut the code size in half and handled edge cases I hadn't even thought of.

### WebSocket with Polling Fallback

**Scenario**: You want real-time data via WebSocket. If that connection fails or is slow, fall back to regular polling.

```js
import { interval, race, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { switchMap, catchError } from "rxjs/operators";

function createWebSocketObservable(url) {
  return new Observable((observer) => {
    const socket = new WebSocket(url);

    socket.onopen = () => console.log("Connected");
    socket.onmessage = (msg) => observer.next(JSON.parse(msg.data));
    socket.onerror = (err) => observer.error(err);
    socket.onclose = () => observer.complete();

    return () => socket.close();
  });
}

function pollingObservable(intervalMs, url) {
  return interval(intervalMs).pipe(
    switchMap(() => ajax.getJSON(url)),
    catchError((err) => of({ error: true, details: err }))
  );
}

const ws$ = createWebSocketObservable("wss://example.com/live");
const poll$ = pollingObservable(5000, "https://api.example.com/data");

// Race: whichever emits first "wins"
const dataFeed$ = race(ws$, poll$);

dataFeed$.subscribe({
  next: (data) => console.log("New data:", data),
  error: (err) => console.error("Feed error:", err),
  complete: () => console.log("Feed closed"),
});
```

- **WebSocket** is hot: it sends values as they arrive from the server.
- **poll$** is cold: it only starts polling when subscribed.
- **race(ws$, poll$)** means if WebSocket works, we use that; if not, polling kicks in.

This pattern saved a project when some corporate firewalls blocked WebSockets. Instead of losing those users, the app smoothly switched to polling without them noticing any difference.

![WebSocket vs Polling Fallback diagram](https://via.placeholder.com/600x300?text=WebSocket+with+Polling+Fallback+Flow)
_Diagram: Flow showing how the system automatically switches between WebSocket and polling_

---

## Testing Reactive Code

Testing async reactive code can be tricky, but there are good patterns:

### Marble Testing

RxJS has a way to visually test streams:

```js
import { TestScheduler } from "rxjs/testing";

const testScheduler = new TestScheduler((actual, expected) => {
  // Compare arrays for equality
  expect(actual).toEqual(expected);
});

testScheduler.run(({ cold, expectObservable }) => {
  const source$ = cold("--a--b--c|", { a: 1, b: 2, c: 3 });
  const result$ = source$.pipe(map((x) => x * 10));

  expectObservable(result$).toBe("--a--b--c|", { a: 10, b: 20, c: 30 });
});
```

Where:

- `-` means nothing happens
- Letters are values
- `|` means completed
- `#` means error

I thought marble testing looked like hieroglyphics at first! But once I got used to it, it became super useful for testing time-based operations. It's like reading sheet music for your data streams.

### Testing Tips

1. **Mock your data sources** (API calls, WebSockets) to return predictable values
2. **Control timing** with TestScheduler (no real setTimeout/setInterval)
3. **Avoid real async** by using test helpers like `fakeAsync`
4. **Check cleanup** by verifying resources get released properly

### Example: Testing HTTP Calls

```js
import { of } from "rxjs";
import { ajax } from "rxjs/ajax";

// In your test file
jest.mock("rxjs/ajax", () => ({
  ajax: {
    getJSON: jest.fn(),
  },
}));

test("getUser() transforms data correctly", () => {
  // Mock the ajax call to return test data
  ajax.getJSON.mockReturnValue(of({ id: 1, name: "John" }));

  // Test your function that uses ajax
  getUser().subscribe((user) => {
    expect(user.id).toBe(1);
    expect(user.name).toBe("John");
    done();
  });
});
```

The first tests I wrote for reactive code were a nightmare – they'd pass on my machine but fail in CI. Learning to properly mock time-dependent observables was a game-changer for reliable tests.

🧪 **Testing Tip**: Don't test the RxJS operators themselves (they're already well-tested) – focus on testing how you use them and the transformations you apply to your data.

---

## Comparing Approaches

### Reactive vs. Callbacks

```js
// Callback approach - messy nesting
getUser(userId, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      // Deeply nested
    });
  });
});

// Reactive approach - flat and clean
getUser(userId)
  .pipe(
    switchMap((user) => getPosts(user.id)),
    switchMap((posts) => getComments(posts[0].id))
  )
  .subscribe(
    (comments) => handleComments(comments),
    (error) => handleError(error)
  );
```

I've inherited enough callback nightmares to know when reactive programming makes sense. If you're more than two callbacks deep, it's usually time to switch approaches.

### Reactive vs. Promises

| Promises          | Observables               |
| ----------------- | ------------------------- |
| One-time value    | Multiple values over time |
| Can't cancel      | Can unsubscribe           |
| Always async      | Can be sync or async      |
| Limited combining | Many combining operators  |

```js
// Promise approach
async function getData() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id); // Sequential
    return posts;
  } catch (error) {
    handleError(error);
  }
}

// Reactive approach
function getData() {
  return fetchUser().pipe(
    switchMap((user) => fetchPosts(user.id)),
    retry(3),
    catchError((error) => of(fallbackData))
  );
}
```

Promises are great – I use them every day! But for complex workflows or streams of values, observables work better. It's like choosing between a hammer and a drill – both are useful, just for different jobs.

### When to Use Each

Use Reactive Programming for:

- Ongoing streams (events, WebSockets)
- Complex async coordination
- Operations that need cleanup
- Real-time UI that needs throttling

Use Promises/async-await for:

- One-off API calls
- Simple sequential operations
- When simplicity matters more

My rule: If it happens once, use a Promise. If it happens multiple times, use an Observable.

---

## References & Further Reading

### Official Documentation

- [RxJS Documentation](https://rxjs.dev/guide/overview) - The official documentation for RxJS with guides and API reference
- [ReactiveX](http://reactivex.io/) - Documentation for the ReactiveX project, covering reactive programming concepts across multiple languages

### Books

- [Reactive Programming with RxJS](https://pragprog.com/titles/smreactjs/reactive-programming-with-rxjs/) by Sergi Mansilla
- [RxJS in Action](https://www.manning.com/books/rxjs-in-action) by Paul P. Daniels and Luis Atencio

### Tutorials & Guides

- [Learn RxJS](https://www.learnrxjs.io/) - Community-driven guide with examples and recipes
- [RxJS Marbles](https://rxmarbles.com/) - Interactive diagrams to understand how RxJS operators work
- [Egghead.io RxJS Courses](https://egghead.io/q/rxjs) - Video tutorials on RxJS

---

## Key Takeaways

1. **Streams**: All async events are just streams of data
2. **Observables & Observers**: One sends values, the other receives them
3. **Operators**: Chain them to transform data
4. **Always Unsubscribe**: To avoid memory leaks
5. **Choosing Operators**: Pick the right tool for each job

By learning these concepts, you can handle complex async challenges that would be a nightmare with callbacks or promises alone.

> When I started with reactive programming, I felt like I was learning to code all over again. It was frustrating! But once it clicked, I couldn't believe I'd ever coded without it. If you're feeling lost, hang in there – that "aha" moment is coming, and it's worth the struggle.

---

_Shout out to ChatGPT that helped polish this article! It saved me hours of grammar checking and suggested some of the visualizations that made this post way easier to understand. Writing about code is almost as hard as writing code itself!_
