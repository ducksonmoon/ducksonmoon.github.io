---
title: "Reactive Programming from Scratch in JavaScript"
date: "2025-03-20"
description: "Reactive Programming in JavaScript leverages streams and observables to manage asynchronous data efficiently."
tags: ["JavaScript", "Reactive Programming", "Programming"]
---

# **Reactive Programming from Scratch in JavaScript**

Reactive Programming in JavaScript leverages streams and observables to manage asynchronous data efficiently. Built on RxJS, it offers a robust framework for handling events, network requests, and real-time updates with composable operators and effective resource management, making it ideal for scalable, event-driven applications.

---

## **Table of Contents**

1. [Introduction: The "Why" of Reactive Programming](#introduction)
2. [Reactive Fundamentals: Streams, Observables, Observers, and Subscriptions](#fundamentals)
3. [Under the Hood: How RxJS Implements Observables](#under-the-hood-rxjs)
4. [Subscribe Method & Subscription Lifecycle](#subscription-lifecycle)
5. [Teardown Logic & Unsubscribing](#teardown-logic)
6. [Hands-On: A Simple Reactive Example](#simple-example)
7. [Implementing a Core Reactive System From Scratch](#implementing-core)
8. [Advanced Reactive Concepts and Patterns](#advanced-concepts)
9. [Building Operators: Transforming, Filtering, and Combining Streams](#building-operators)
10. [Error Handling, Concurrency, and Backpressure](#error-handling)
11. [Multicasting: Subjects, Replay Subjects, and Sharing Streams](#multicasting)
12. [Deeper Dive: Advanced Operators & Patterns](#deeper-dive-operators)
    - [Flattening Operators (mergeMap, switchMap, etc.)](#flattening-operators)
    - [Combining Streams (combineLatest, forkJoin, etc.)](#combining-streams)
    - [Error Handling (catchError, retry)](#error-handling-operators)
    - [Backpressure & Throttling](#backpressure)
    - [Scheduling & Performance](#scheduling-performance)
13. [Putting It All Together: Two Advanced Examples](#two-advanced-examples)
    - [Example 1: ForkJoin with Custom Retry Strategy](#forkjoin-retry)
    - [Example 2: Live Data Feed (WebSocket) + Polling](#live-data-feed)
14. [Conclusion and Next Steps](#conclusion)

---

<a name="introduction"></a>

## 1. Introduction: The "Why" of Reactive Programming

Modern JavaScript applications deal with a variety of asynchronous data:

- User interactions (clicks, keyboard events, etc.).
- Network requests (HTTP, WebSockets).
- Timers and intervals.
- Real-time or streaming data sources.

Traditionally, you might handle these scenarios using callbacks, `async/await`, or event emitters. However, as an application grows, code can become scattered, logic can get duplicated, and errors become harder to trace.

**Reactive programming** offers a cleaner, unified approach. Instead of orchestrating each step manually, you **describe** how data (in the form of “streams”) should flow through your system. Reactive libraries like **RxJS** leverage **observables**, **operators**, and **schedulers** to make asynchronous operations composable, more declarative, and easier to debug.

### Key Benefits

1. **A Single Abstraction for Async Data**: Streams represent everything—user events, data updates, intervals, etc.
2. **Declarative Transformations**: Chain operators like `map`, `filter`, `merge` to transform or combine data without deeply nested callbacks.
3. **Built-In Error & Completion Handling**: Errors and completions flow naturally with the data.
4. **Easier Concurrency & Backpressure Control**: Flattening operators (`mergeMap`, `switchMap`, etc.) and throttling/debouncing strategies help you manage multiple or fast data streams gracefully.

---

<a name="fundamentals"></a>

## 2. Reactive Fundamentals: Streams, Observables, Observers, and Subscriptions

### **Streams**

A **stream** is a sequence of data over time. It can emit three kinds of signals:

1. **Next**: A new value has arrived.
2. **Error**: The stream has encountered an error and is ending.
3. **Complete**: The stream has finished emitting values.

### **Observables**

An **Observable** is the representation of a stream in code. It’s like a recipe for producing values. When you “subscribe” to an observable, it starts emitting values to the subscriber.

### **Observers**

An **Observer** is the entity that receives the data from an observable. It typically has up to three callbacks:

- `next(value)` – handle new data.
- `error(err)` – handle an error and terminate.
- `complete()` – handle the end of the stream.

### **Subscriptions**

When an **observer** subscribes to an **observable**, you get a **subscription**. This subscription can be **unsubscribed** to stop the data flow and to release resources (like event listeners or network connections).

---

<a name="under-the-hood-rxjs"></a>

## 3. Under the Hood: How RxJS Implements Observables

Although we can build a minimal implementation of observables ourselves, RxJS has refined this concept. When you do something like:


```js
import { Observable } from 'rxjs';

const myObservable = new Observable(subscriber => {
  subscriber.next('Hello');
  subscriber.complete();
});

```

1. **`new Observable`**: RxJS captures the **subscribe function** you provide.
2. **`myObservable.subscribe(...)`**: RxJS creates an internal `Subscriber`, calls your subscribe function, and hooks up teardown logic.
3. **Resource Management**: When your stream completes or you unsubscribe, RxJS calls the teardown function you defined.

RxJS also supports advanced features like:

- **Schedulers**: Control when and where tasks are executed (e.g., `queueScheduler`, `asyncScheduler`, `animationFrameScheduler`).
- **Subjects**: Special observables that can multicasts values and also manually receive `.next(...)` calls.

---

<a name="subscription-lifecycle"></a>

## 4. Subscribe Method & Subscription Lifecycle

A typical subscription in RxJS looks like this:

```js
const subscription = myObservable.subscribe({
  next: value => console.log(value),
  error: err => console.error(err),
  complete: () => console.log('Done!')
});

```

**Lifecycle**:

1. **Subscription Start**: The `subscriber` function in your observable is invoked.
2. **Data Emission**: `next()` is called whenever a new value is produced.
3. **Error or Completion**: If `error(...)` or `complete()` is called, the subscription ends.
4. **Unsubscribe**: You can manually call `subscription.unsubscribe()` to end things early.

---

<a name="teardown-logic"></a>

## 5. Teardown Logic & Unsubscribing

**Teardown** is code that cleans up resources once the stream is finished or unsubscribed. For example, if you attach a DOM event listener:

```js
function fromEvent(element, eventName) {
  return new Observable(observer => {
    const handler = event => observer.next(event);
    element.addEventListener(eventName, handler);

    // Teardown logic
    return () => {
      element.removeEventListener(eventName, handler);
    };
  });
}
```

When the subscriber unsubscribes or the observable completes, that returned function is called to remove the event listener, preventing memory leaks.

---

<a name="simple-example"></a>

## 6. Hands-On: A Simple Reactive Example

Here’s a quick example that turns button clicks into a **counter** stream:


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
    // Example minimal fromEvent implementation
    function Observable(subscribeFunction) {
      this._subscribeFunction = subscribeFunction;
    }

    Observable.prototype.subscribe = function(observer) {
      const teardown = this._subscribeFunction(observer);
      return {
        unsubscribe: () => {
          if (teardown) teardown();
        }
      };
    };

    function fromEvent(element, eventName) {
      return new Observable(observer => {
        const handler = event => observer.next(event);
        element.addEventListener(eventName, handler);

        return () => element.removeEventListener(eventName, handler);
      });
    }

    const incBtn = document.getElementById('incBtn');
    const countValue = document.getElementById('countValue');
    let count = 0;

    const clickObservable = fromEvent(incBtn, 'click');
    const subscription = clickObservable.subscribe({
      next: () => {
        count++;
        countValue.textContent = count;
      }
    });
  </script>
</body>
</html>
```

- Each button click emits a new event into the `clickObservable`.
- The subscription’s `next()` callback increments `count` and updates the UI.
- You could call `subscription.unsubscribe()` at any time to stop listening.

---

<a name="implementing-core"></a>

## 7. Implementing a Core Reactive System From Scratch

Let’s build a minimal reactive system that covers **observables, subscriptions,** and **teardown**.

### **Step 1: The Observable Constructor**


```js
function Observable(subscribeFunction) {
  this._subscribeFunction = subscribeFunction;
}

Observable.prototype.subscribe = function(observer) {
  // Normalize observer
  const safeObserver = {
    next: observer.next || function() {},
    error: observer.error || function() {},
    complete: observer.complete || function() {}
  };

  // Call the function that produces values
  const teardown = this._subscribeFunction(safeObserver);

  // Return a subscription object
  return {
    unsubscribe: () => {
      if (typeof teardown === 'function') {
        teardown();
      }
    }
  };
};

```

### **Step 2: A Basic Emitter**

```js
const greetingObservable = new Observable(observer => {
  observer.next('Hello');
  observer.next('Reactive World');
  observer.complete();

  return () => {
    console.log('Teardown: cleaning up...');
  };
});

const subscription = greetingObservable.subscribe({
  next: val => console.log('Received:', val),
  complete: () => console.log('Stream completed.')
});

```

- Upon subscribing, it immediately emits two values, then completes.
- The teardown logs a message. If you call `subscription.unsubscribe()`, you’d see the teardown message immediately.

### **Step 3: From Events**

```js
function fromEvent(element, eventName) {
  return new Observable(observer => {
    const handler = (event) => observer.next(event);
    element.addEventListener(eventName, handler);

    // Teardown logic
    return () => element.removeEventListener(eventName, handler);
  });
}
```

---

<a name="advanced-concepts"></a>

## 8. Advanced Reactive Concepts and Patterns

### **Hot vs. Cold Observables**

- **Cold**: The observable’s values are “created” on subscription (e.g., `fromEvent` on a specific DOM element, or an `interval()`). Each new subscriber may experience the stream from the start.
- **Hot**: The data source emits values whether or not you subscribe (like a live radio broadcast). Subscribing “midstream” may mean missing earlier values. A shared WebSocket or a live sensor feed can be hot.

### **Teardown & Memory Management**

- Always unsubscribe or ensure the stream completes. If you fail to unsubscribe, you might keep event listeners or intervals running, causing memory leaks.

### **Higher-Order Observables**

- An observable can **emit other observables**. “Flattening operators” (like `switchMap`, `mergeMap`, etc.) handle these nested streams in advanced use cases (e.g., a search box that fires a new HTTP request on each keystroke).

---

<a name="building-operators"></a>

## 9. Building Operators: Transforming, Filtering, and Combining Streams

Operators are the **key** to reactive programming’s expressiveness. They are functions (or methods) that take an observable, transform or combine its values, and return a **new** observable.

### **Map Operator**


```js
Observable.prototype.map = function(transformFn) {
  const source = this;
  return new Observable(observer => {
    const subscription = source.subscribe({
      next: val => {
        try {
          observer.next(transformFn(val));
        } catch (err) {
          observer.error(err);
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });

    // Teardown
    return () => subscription.unsubscribe();
  });
};

```

### **Filter Operator**

```js
Observable.prototype.filter = function(predicateFn) {
  const source = this;
  return new Observable(observer => {
    const subscription = source.subscribe({
      next: val => {
        try {
          if (predicateFn(val)) observer.next(val);
        } catch (err) {
          observer.error(err);
        }
      },
      error: err => observer.error(err),
      complete: () => observer.complete()
    });

    return () => subscription.unsubscribe();
  });
};
```

### **Combining Streams (Merging)**

```js
function merge(...observables) {
  return new Observable(observer => {
    let completedCount = 0;
    const subscriptions = observables.map(obs =>
      obs.subscribe({
        next: value => observer.next(value),
        error: err => observer.error(err),
        complete: () => {
          completedCount++;
          if (completedCount === observables.length) {
            observer.complete();
          }
        }
      })
    );

    return () => subscriptions.forEach(sub => sub.unsubscribe());
  });
}
```

---

<a name="error-handling"></a>

## 10. Error Handling, Concurrency, and Backpressure

### **Error Handling**

- If an error occurs, the observable calls `observer.error(err)`, which stops further emissions.
- In libraries like RxJS, operators such as `catchError` or `retry` let you gracefully recover or retry.

### **Concurrency**

- **Flattening operators**: If an observable emits other observables, operators like `mergeMap`, `concatMap`, or `switchMap` decide how to subscribe and handle concurrency.
    - **mergeMap**: Subscribes to all inner observables concurrently.
    - **concatMap**: Subscribes to one at a time, in order.
    - **switchMap**: Cancels the previous inner observable if a new one arrives.

### **Backpressure**

- If data arrives too quickly, you might want to:
    - **throttleTime(ms)**: Emit a value, then ignore subsequent values for a defined time.
    - **debounceTime(ms)**: Wait until a quiet period before emitting the latest value.
- These patterns prevent overload when streams emit too frequently (like mousemoves or high-velocity data feeds).

---

<a name="multicasting"></a>

## 11. Multicasting: Subjects, Replay Subjects, and Sharing Streams

### **Subjects**

A **Subject** is both an **observable** and an **observer**:

- You can subscribe to it (like an observable).
- You can push new values with `.next()` (like an observer).

This allows multiple subscribers to share the same data source without re-running the producer logic each time.

### **Different Types** (in RxJS)

1. **Subject**: No initial value. Subscribers see only subsequent emissions.
2. **BehaviorSubject**: Holds one “current value,” so new subscribers get the most recent emission immediately.
3. **ReplaySubject**: Buffers a set number of past emissions (or time window) and replays them to new subscribers.
4. **AsyncSubject**: Only emits the _final_ value (the value upon completion).

### **Multicasting Implementation**

- Operators like `share()`, `publish()`, and `refCount()` in RxJS wrap your original observable in a subject behind the scenes, ensuring that the observable is only subscribed to once, but can fan out its emissions to many subscribers.

---

<a name="deeper-dive-operators"></a>

## 12. Deeper Dive: Advanced Operators & Patterns

Operators in libraries like RxJS can get very sophisticated. Understanding these at a conceptual level helps a lot, even if you don’t memorize every operator.

<a name="flattening-operators"></a>

### 12.1 Flattening Operators (mergeMap, switchMap, etc.)

If an observable (call it _outer_) emits other observables (_inner_), you need a way to manage how those inner streams flow into the outer pipeline.

- **mergeMap**: Runs inner observables concurrently; merges results into a single stream.
- **switchMap**: Cancels the previous inner observable if a new one appears (great for real-time search).
- **concatMap**: Processes each inner observable in sequence, queuing them.

<a name="combining-streams"></a>

### 12.2 Combining Streams (combineLatest, forkJoin, etc.)

1. **combineLatest(obsA, obsB)**: Emits whenever **any** source observable emits, providing the **latest** values from each.
2. **forkJoin(obsA, obsB)**: Waits for all observables to complete, then emits an array of their last values. Perfect for parallel requests you want to gather at once.
3. **withLatestFrom**: Used inside an operator chain to combine the latest values of multiple streams, but triggered only by one “primary” observable.

<a name="error-handling-operators"></a>

### 12.3 Error Handling (catchError, retry)

- **catchError**: Intercept an error and recover by returning a fallback observable (e.g., `of('default value')`).
- **retry(n)**: Automatically re-subscribe to the source up to **n** times if it errors.

<a name="backpressure"></a>

### 12.4 Backpressure & Throttling

- **throttleTime(ms)**: Emit a value, then ignore subsequent emissions for `ms` milliseconds.
- **debounceTime(ms)**: Wait `ms` milliseconds of silence before emitting the most recent value.
- **bufferTime(ms)**: Collect values for `ms` milliseconds, then emit them as an array at once.

<a name="scheduling-performance"></a>

### 12.5 Scheduling & Performance

RxJS includes schedulers to control how tasks are queued and executed. For instance:

- **queueScheduler**: Executes tasks synchronously in a FIFO queue.
- **asyncScheduler**: Schedules tasks asynchronously (like `setTimeout`).
- **animationFrameScheduler**: Aligns work with `requestAnimationFrame` for smoother UI updates.

Choosing the right scheduler can prevent blocking the UI and make rendering smoother.

---

<a name="two-advanced-examples"></a>

## 13. Putting It All Together: Two Advanced Examples

Let’s walk through two scenarios that illustrate more advanced use of operators and reactive patterns.

<a name="forkjoin-retry"></a>

### 13.1 Example 1: ForkJoin with Custom Retry Strategy

**Scenario**: You have three HTTP requests (user info, posts, comments). You want them all in parallel, but if any fail, you’ll retry a limited number of times before giving up.

```js
import { ajax } from 'rxjs/ajax';
import { forkJoin, of } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';

function getUser() {
  return ajax.getJSON('https://api.example.com/user').pipe(
    retry(2),
    catchError(err => of({ error: true, details: err }))
  );
}

function getPosts() {
  return ajax.getJSON('https://api.example.com/posts').pipe(
    retry(2),
    catchError(err => of({ error: true, details: err }))
  );
}

function getComments() {
  return ajax.getJSON('https://api.example.com/comments').pipe(
    retry(2),
    catchError(err => of({ error: true, details: err }))
  );
}

forkJoin([getUser(), getPosts(), getComments()])
  .pipe(
    map(([user, posts, comments]) => {
      return { user, posts, comments };
    })
  )
  .subscribe({
    next: allData => {
      // If any contain error, handle it
      console.log('All results:', allData);
    },
    error: err => console.error('Total error:', err),
    complete: () => console.log('All done!')
  });

```

- **forkJoin**: Waits for each observable to complete, then emits their last values.
- **retry(2)**: Each request is retried up to two times if it fails.
- **catchError**: Returns a fallback object instead of blowing up the entire stream.

<a name="live-data-feed"></a>

### 13.2 Example 2: Live Data Feed (WebSocket) + Polling

**Scenario**: You have a WebSocket feed for real-time data. If that feed disconnects or lags, fallback to periodic polling every few seconds.

```js
import { interval, merge, race, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { switchMap, catchError } from 'rxjs/operators';

function createWebSocketObservable(url) {
  return new Observable(observer => {
    const socket = new WebSocket(url);

    socket.onopen = () => console.log('WebSocket connected');
    socket.onmessage = (msg) => observer.next(JSON.parse(msg.data));
    socket.onerror = (err) => observer.error(err);
    socket.onclose = () => observer.complete();

    // Teardown
    return () => socket.close();
  });
}

function pollingObservable(intervalMs, url) {
  return interval(intervalMs).pipe(
    switchMap(() => ajax.getJSON(url)),
    catchError(err => of({ error: true, details: err }))
  );
}

const ws$ = createWebSocketObservable('wss://example.com/live');
const poll$ = pollingObservable(5000, 'https://api.example.com/data');

// Race: whichever observable emits first "wins"
const dataFeed$ = race(ws$, poll$);

dataFeed$.subscribe({
  next: data => console.log('Incoming data:', data),
  error: err => console.error('Feed error:', err),
  complete: () => console.log('Feed closed')
});
```

- **WebSocket** is hot: it emits values as they come from the server.
- **poll$** is cold: it starts generating values only when subscribed.
- **race(ws$, poll$)** means if the WebSocket starts delivering data, we use that; if not, polling steps in (emitting first). This approach can be adapted to handle fallback logic.

---

<a name="conclusion"></a>

## 14. Conclusion and Next Steps

**Reactive programming** reimagines how we think about and handle asynchronous data. Rather than meticulously orchestrating control flow and state changes, we rely on **streams** of data, **operators** for transformation, and a **subscription model** for resource management.

### **Key Takeaways**

1. **Streams Everywhere**: In reactive programming, events, timers, network responses—anything asynchronous—becomes a stream.
2. **Observables & Observers**: Observables produce values; observers consume them.
3. **Operators**: Make transforming data easy, clear, and composable.
4. **Error & Completion Handling**: Built-in to the stream flow, no additional callback layers needed.
5. **Unsubscribe / Teardown**: Always unsubscribe or let the stream complete to avoid leaks or wasted work.
6. **Advanced Patterns**: Flattening operators for concurrency, backpressure strategies for high-speed data, subjects for multicasting.

### **Where to Go Next**

- **Explore RxJS**: It’s the most popular reactive library in the JS ecosystem, featuring robust operators and scheduling options.
- **Angular**: Deeply integrated with RxJS, making it easy to handle everything from HTTP to forms in a reactive style.
- **React / Vue**: Use hooks or lifecycle methods to subscribe/unsubscribe from observables, or integrate with state management solutions.
- **Node.js**: Use observables on the server side for file streams, network data, or orchestrating concurrent calls.

By mastering the fundamentals and advanced concepts of **observables**, **subscriptions**, **operators**, **multicasting**, **error handling**, and **backpressure**, you’ll be well-equipped to tackle real-time, event-heavy, and complex asynchronous applications. Happy coding in the reactive world!
