---
title: "Building a Collaborative Drawing App with Reactive Programming"
date: "2025-04-05"
description: "Learn how to build a shared canvas where multiple people can draw together using RxJS and WebSockets."
tags:
  [
    "JavaScript",
    "Reactive Programming",
    "WebSockets",
    "RxJS",
    "Tutorial",
    "Real-time",
  ]
---

After diving into [reactive programming basics](./reactive-programming-from-scratch-in-javascript) and [building a real-time dashboard](./building-a-real-time-dashboard-with-reactive-programming), let's take things up a notch! Today we're going to build something super fun - a drawing app where multiple people can draw on the same canvas at the same time.

Remember when you were a kid and would fight with your siblings over who gets to color which part of the drawing? Well, this app solves that problem - everyone can draw at once!

The complete source code for this tutorial is available in [my GitHub repository](https://github.com/ducksonmoon/drawing-app).

{toc}

## What We're Building

We'll create a collaborative drawing app where:

- Multiple users can draw on the same canvas at the same time
- Everyone sees what others are drawing in real-time
- Each person gets their own color
- You can see who's currently online and drawing
- The drawing persists if you reload the page

This project showcases some powerful reactive programming concepts:

1. Using WebSockets to share drawing events between users
2. Handling mouse movements as streams of events
3. Broadcasting state changes to all connected clients
4. Synchronizing the canvas state for new users who join

Don't worry if that sounds like a lot - I'll walk you through it step by step!

## Prerequisites

Before we start, you should:

- Know JavaScript basics and ES6
- Have a basic understanding of reactive programming (observables, subscribers)
- Have gone through the [reactive programming introduction](./reactive-programming-from-scratch-in-javascript)
- Have Node.js and npm installed

If you're brand new to reactive programming, check out the other posts in this series first.

## Project Setup

Let's create our project structure:

```
drawing-app/
  ├── package.json
  ├── server.js
  ├── public/
  │   ├── index.html
  │   ├── style.css
  │   └── app.js
  └── .gitignore
```

First, make a new project folder and set things up:

```bash
mkdir drawing-app
cd drawing-app
npm init -y
npm install express socket.io rxjs
npm install --save-dev nodemon
```

We need both a server and a client, so Express and Socket.IO will help us with the WebSocket communication between users.

### Basic Server (server.js)

Let's create a simple server that will host our app and handle WebSocket connections:

```js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

// Create our Express app, HTTP server, and Socket.io server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Keep track of all drawing points to replay for new users
let drawHistory = [];
// Keep track of connected users
let users = {};

// When a client connects
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Create a random color for this user
  const color = getRandomColor();
  users[socket.id] = {
    id: socket.id,
    color,
    isDrawing: false,
  };

  // Send the current state to the new user
  socket.emit("init", {
    drawHistory,
    users,
  });

  // Let everyone know about the new user
  io.emit("userJoined", users[socket.id]);

  // When user sends draw data
  socket.on("draw", (data) => {
    data.color = users[socket.id].color;
    data.userId = socket.id;

    // Store in history (so new users can see existing drawing)
    drawHistory.push(data);

    // Keep history from getting too big
    if (drawHistory.length > 1000) {
      drawHistory = drawHistory.slice(drawHistory.length - 1000);
    }

    // Send to all OTHER clients (broadcasting)
    socket.broadcast.emit("draw", data);
  });

  // When user starts/stops drawing
  socket.on("drawingState", (isDrawing) => {
    users[socket.id].isDrawing = isDrawing;
    io.emit("userStateChanged", { userId: socket.id, isDrawing });
  });

  // Handle clear canvas request
  socket.on("clearCanvas", () => {
    // Clear the drawing history
    drawHistory = [];
    // Broadcast to all clients to clear their canvases
    io.emit("clearCanvas");
  });

  // When user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete users[socket.id];
    io.emit("userLeft", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Helper to generate random colors
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
```

The server code is pretty straightforward:

1. We set up Socket.IO to handle WebSocket connections
2. We track drawing history and connected users
3. For each new user, we send them the current state and give them a random color
4. We handle drawing events and broadcast them to other users
5. We manage when users connect, disconnect, and change drawing state

### HTML Structure (public/index.html)

Next, let's create the front-end interface:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Collaborative Drawing App</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Let's Draw Together!</h1>
        <div class="tools">
          <button id="clear-btn">Clear Canvas</button>
          <div class="user-list">
            <h3>Who's Drawing:</h3>
            <ul id="users"></ul>
          </div>
        </div>
      </div>

      <div class="canvas-container">
        <canvas id="drawing-canvas"></canvas>
      </div>

      <div class="footer">
        <p>Your color: <span id="my-color">loading...</span></p>
        <p class="help-text">
          Start drawing by clicking and dragging on the canvas
        </p>
      </div>
    </div>

    <script src="/socket.io/socket.io.js"></script>
    <script src="https://unpkg.com/rxjs@7/dist/bundles/rxjs.umd.min.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

### CSS Styling (public/style.css)

Let's add some basic styling:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

h1 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.tools {
  display: flex;
  gap: 1rem;
  align-items: start;
}

button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  background-color: #2980b9;
}

.canvas-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

#drawing-canvas {
  display: block;
  background-color: white;
  cursor: crosshair;
  width: 100%;
  height: 600px;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.user-list {
  background: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 150px;
}

.user-list h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.user-list ul {
  list-style-type: none;
}

.user-list li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.user-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
}

.user-drawing {
  font-weight: bold;
}

#my-color {
  font-weight: bold;
}
```

## The Client-Side App

Now comes the fun part - let's build the reactive drawing app!

### Reactive Drawing Logic (public/app.js)

```js
// Get RxJS from the UMD bundle
const { fromEvent, merge } = rxjs;
const { map, switchMap, takeUntil, tap, filter, share, pairwise, startWith } =
  rxjs.operators;

// Set up canvas and context
const canvas = document.getElementById("drawing-canvas");
const context = canvas.getContext("2d");
const usersElement = document.getElementById("users");
const clearButton = document.getElementById("clear-btn");
const myColorElement = document.getElementById("my-color");

// Socket.io is loaded from the server
const socket = io();

// Set the canvas size to match its display size
function setupCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.lineWidth = 3;
}

// Set up the canvas when page loads and when window resizes
window.addEventListener("load", setupCanvas);
window.addEventListener("resize", setupCanvas);

// Keep track of our user
let myColor;
let myUserId;
let users = {};

// Process drawing events from the server
socket.on("draw", drawLine);

// Process initial state when connecting
socket.on("init", (data) => {
  // Save user info
  myUserId = socket.id;
  myColor = data.users[myUserId].color;
  users = data.users;

  // Display my color
  myColorElement.textContent = myColor;
  myColorElement.style.color = myColor;

  // Draw the existing drawing
  data.drawHistory.forEach(drawLine);

  // Update the user list
  updateUserList();
});

// Handle user joining
socket.on("userJoined", (user) => {
  users[user.id] = user;
  updateUserList();
});

// Handle user leaving
socket.on("userLeft", (userId) => {
  delete users[userId];
  updateUserList();
});

// Handle user state change (drawing or not)
socket.on("userStateChanged", (data) => {
  users[data.userId].isDrawing = data.isDrawing;
  updateUserList();
});

// Clear button handler
clearButton.addEventListener("click", () => {
  // Clear locally
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Tell server to clear for everyone
  socket.emit("clearCanvas");
});

// Server tells us to clear
socket.on("clearCanvas", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
});

// Draw a line segment based on coordinates
function drawLine(data) {
  context.strokeStyle = data.color;
  context.beginPath();
  context.moveTo(data.prevX, data.prevY);
  context.lineTo(data.currX, data.currY);
  context.stroke();
}

// Update the user list display
function updateUserList() {
  usersElement.innerHTML = "";
  Object.values(users).forEach((user) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="user-color" style="background-color: ${user.color}"></span>
      <span class="${user.isDrawing ? "user-drawing" : ""}">${
      user.id === myUserId ? "You" : `User ${user.id.substr(0, 5)}`
    }</span>
      ${user.isDrawing ? " (drawing)" : ""}
    `;
    usersElement.appendChild(li);
  });
}

// Now for the reactive part!
// Let's create observables from mouse events on the canvas
const mouseMove$ = fromEvent(canvas, "mousemove");
const mouseDown$ = fromEvent(canvas, "mousedown");
const mouseUp$ = fromEvent(canvas, "mouseup");
const mouseLeave$ = fromEvent(canvas, "mouseleave");

// This is where reactive programming really shines for drawing apps
// We'll track mouse movements while the mouse is down
const drawing$ = mouseDown$.pipe(
  tap(() => {
    // Tell everyone we're drawing
    socket.emit("drawingState", true);
  }),
  // switchMap lets us switch to a new observable sequence
  switchMap((down) => {
    // Get the starting position
    const startX = down.offsetX;
    const startY = down.offsetY;

    // Create the initial point
    const startPoint = {
      offsetX: startX,
      offsetY: startY,
    };

    // Return the movements until mouse up or leave
    return mouseMove$.pipe(
      // Start with the initial point to connect properly
      startWith(startPoint),
      // Use pairwise to get the previous and current points
      pairwise(),
      // Map to the format our drawing function expects
      map(([prev, curr]) => ({
        prevX: prev.offsetX,
        prevY: prev.offsetY,
        currX: curr.offsetX,
        currY: curr.offsetY,
      })),
      // Stop tracking when mouse up or leave occurs
      takeUntil(merge(mouseUp$, mouseLeave$))
    );
  }),
  // This is important! Share makes this a hot observable
  // so multiple subscribers don't recreate the events
  share()
);

// When we finish drawing
merge(mouseUp$, mouseLeave$).subscribe(() => {
  socket.emit("drawingState", false);
});

// Subscribe to the drawing stream
drawing$.subscribe((coords) => {
  // Draw locally
  drawLine({
    ...coords,
    color: myColor,
  });

  // Emit to the server
  socket.emit("draw", coords);
});

// Debug when we connect/disconnect
socket.on("connect", () => console.log("Connected to server"));
socket.on("disconnect", () => console.log("Disconnected from server"));
```

## Understanding The Reactive Drawing Logic

Let's break down the cool parts of our reactive drawing app:

### 1. Event Streams

We're turning mouse events into observables:

```js
const mouseMove$ = fromEvent(canvas, "mousemove");
const mouseDown$ = fromEvent(canvas, "mousedown");
const mouseUp$ = fromEvent(canvas, "mouseup");
const mouseLeave$ = fromEvent(canvas, "mouseleave");
```

These are streams of events that we can transform and combine using RxJS operators. This is much cleaner than nesting traditional event listeners.

### 2. Drawing as a Stream

The magic happens in the `drawing$` observable:

```js
const drawing$ = mouseDown$.pipe(
  tap(() => {
    socket.emit("drawingState", true);
  }),
  switchMap((down) => {
    const startX = down.offsetX;
    const startY = down.offsetY;

    return mouseMove$.pipe(
      map((move) => ({
        prevX: startX,
        prevY: startY,
        currX: move.offsetX,
        currY: move.offsetY,
      })),
      takeUntil(merge(mouseUp$, mouseLeave$))
    );
  }),
  share()
);
```

Let's break this down in simpler terms:

- When you press the mouse button (`mouseDown$`), we start paying attention to where your mouse moves
- We capture each movement and calculate the line that should be drawn
- We keep doing this until you release the mouse or move it off the canvas
- `share()` makes sure we don't duplicate the events for multiple subscribers

This way, drawing becomes a single stream of line segments, where each segment connects where your mouse was to where it is now.

### 3. Multicasting with Socket.IO

When we subscribe to the drawing stream, we both draw locally AND send the line data to other users:

```js
drawing$.subscribe((coords) => {
  // Draw locally
  drawLine({
    ...coords,
    color: myColor,
  });

  // Emit to the server
  socket.emit("draw", coords);
});
```

The server then broadcasts this to all other connected clients:

```js
socket.on("draw", (data) => {
  socket.broadcast.emit("draw", data);
});
```

This creates a synchronized drawing experience. When you draw something, everyone else sees it immediately.

## The Power of Sharing State

In our app, there are two main types of state that get shared:

1. **Drawing State** - The actual lines people draw
2. **User State** - Who's connected and whether they're actively drawing

Let me walk you through how each part works.

### Sharing Drawing State

When someone draws, we:

1. Capture their mouse movements as line segments using RxJS
2. Draw those segments locally on their canvas
3. Send the segment data to the server via Socket.IO
4. The server broadcasts to all other clients
5. Other clients receive the data and draw the same segment

This direct sharing of drawing actions (not just the final picture) means everyone can see the drawing happen stroke by stroke. It's much more interactive than just sharing a final image!

### Sharing User State

We also keep track of:

- Who's currently connected (with their unique colors)
- Who's actively drawing right now

This information gets updated in real-time. When someone starts drawing, everyone else can see that they're active.

### Syncing New Users

When a new person joins, we don't want them to see a blank canvas! So:

1. We store drawing history on the server
2. When someone new connects, we send them the full drawing history
3. Their canvas gets filled in with all existing lines
4. Then they start receiving real-time updates

This creates a seamless experience - you can join at any time and still see what everyone has drawn so far.

## Testing The App

Let's run the app to see it in action:

1. Add this start script to `package.json`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

2. Start the development server:

```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser

4. For the full experience, open the app in multiple browser windows and watch as drawings sync between them!

## Troubleshooting Common Issues

### 1. "Why aren't the lines connecting smoothly?"

When drawing, you might notice gaps between line segments. This happens because we're only capturing mouse movements at certain intervals. To fix this, change how we draw lines:

```js
// Original drawing function
function drawLine(data) {
  context.strokeStyle = data.color;
  context.beginPath();
  context.moveTo(data.prevX, data.prevY);
  context.lineTo(data.currX, data.currY);
  context.stroke();
}

// Improved version that tracks the last position
let lastX = null;
let lastY = null;

function drawLine(data) {
  context.strokeStyle = data.color;
  context.beginPath();

  // If this is part of an ongoing drawing, connect from the last point
  if (lastX && data.userId === lastUserId) {
    context.moveTo(lastX, lastY);
  } else {
    context.moveTo(data.prevX, data.prevY);
  }

  context.lineTo(data.currX, data.currY);
  context.stroke();

  // Remember the last position and user
  lastX = data.currX;
  lastY = data.currY;
  lastUserId = data.userId;
}
```

### 2. "The app slows down after drawing a lot"

The canvas can get sluggish when there's too much drawing history. Two fixes:

1. Limit history on the server (we already do this)
2. Periodically convert the canvas to an image:

```js
// Take a snapshot every 100 drawing actions
let drawCount = 0;

drawing$.subscribe((coords) => {
  drawCount++;

  if (drawCount % 100 === 0) {
    takeCanvasSnapshot();
  }
});

function takeCanvasSnapshot() {
  // Temporarily store the canvas data
  const imageData = canvas.toDataURL("image/png");

  // Optionally send to server to update baseline for new users
  socket.emit("canvasSnapshot", imageData);
}
```

### 3. "Users don't see all drawing actions"

WebSockets sometimes miss messages if there's network lag. Add acknowledgments and retries:

```js
// When sending drawing data
socket.emit("draw", coords, (ack) => {
  if (!ack) {
    // If no acknowledgment, try again
    socket.emit("draw", coords);
  }
});

// On the server
socket.on("draw", (data, callback) => {
  // Process the data...

  // Send acknowledgment
  if (callback) callback(true);
});
```

## Real-World Improvements

Here are some ways to make this app even better:

### 1. Drawing Tools

Add options for:

- Different brush sizes
- Shapes (circles, rectangles)
- An eraser tool
- Text tool

```js
// Example of implementing brush size
const brushSize = document.getElementById("brush-size");

brushSize.addEventListener("change", (e) => {
  context.lineWidth = e.target.value;
  socket.emit("updateSettings", { lineWidth: e.target.value });
});

socket.on("updateSettings", (settings) => {
  if (settings.userId !== socket.id) {
    userSettings[settings.userId] = settings;
  }
});

// Then in drawLine():
function drawLine(data) {
  context.strokeStyle = data.color;
  context.lineWidth = userSettings[data.userId]?.lineWidth || 3;
  // Rest of drawing logic...
}
```

### 2. Rooms & Private Drawing Spaces

Let users create private drawing rooms:

```js
// On the client
const roomButton = document.getElementById("create-room");

roomButton.addEventListener("click", () => {
  const roomName = prompt("Enter a room name:");
  if (roomName) {
    socket.emit("joinRoom", roomName);
  }
});

// On the server
socket.on("joinRoom", (roomName) => {
  // Leave current rooms
  Object.keys(socket.rooms).forEach((room) => {
    if (room !== socket.id) socket.leave(room);
  });

  // Join new room
  socket.join(roomName);

  // Get room history
  const roomHistory = drawHistoryByRoom[roomName] || [];
  socket.emit("roomJoined", { room: roomName, history: roomHistory });

  // Broadcast to room members only
  socket.to(roomName).emit("userJoined", users[socket.id]);
});
```

### 3. Undo/Redo Functionality

Add undo/redo support:

```js
// Track drawing actions in arrays
let drawActions = [];
let redoStack = [];

drawing$.subscribe((coords) => {
  // Add to actions stack
  drawActions.push({
    type: "draw",
    data: { ...coords, color: myColor },
  });

  // Clear redo stack when new drawing happens
  redoStack = [];

  // Draw and emit as before
  // ...
});

document.getElementById("undo-btn").addEventListener("click", () => {
  if (drawActions.length === 0) return;

  // Move latest action to redo stack
  const lastAction = drawActions.pop();
  redoStack.push(lastAction);

  // Redraw everything from scratch
  redrawCanvas();

  // Tell others
  socket.emit("undo");
});

socket.on("undo", (userId) => {
  // Handle others' undos
  // ...
  redrawCanvas();
});
```

## The Magic Behind Multiuser Drawing

The real magic of this app isn't just in the drawing - it's in synchronizing state between users in real-time. Let's look at what makes this possible:

### 1. Shared Observable Execution

With traditional event listeners, each listener runs independently. But with RxJS, we can create a pipeline where events flow through transformations and can be shared between multiple subscribers.

The `share()` operator is key here - it turns a "cold" observable (which runs separately for each subscriber) into a "hot" observable (which runs once and broadcasts to all subscribers).

### 2. Stateful vs. Stateless Communication

Our app uses both patterns:

**Stateful** (the canvas itself):

- We keep the entire drawing history on the server
- New users get the full history to catch up

**Stateless** (the drawing actions):

- Each drawing action is independent
- Actions flow from user → server → other users without requiring context

This hybrid approach gives us the best of both worlds: full state for new users, and fast, lightweight updates for ongoing drawing.

### 3. Eventual Consistency

What happens if messages arrive out of order? In our app, it doesn't matter much! Each line segment is drawn where it should be, regardless of when it arrives.

This is called "eventual consistency" - even if there are temporary network delays, everyone's canvas will eventually look the same.

## Key Takeaways

As you build apps like this collaborative drawing tool, keep these concepts in mind:

1. **Think in streams** - Mouse movements, drawing actions, and user state are all streams of events

2. **Share resources efficiently** - Use `share()` to avoid duplicate processing and prevent multiple WebSocket connections

3. **Design for real-time sync** - Send small, frequent updates rather than large batches

4. **Handle new users gracefully** - Make sure people joining late can catch up with the current state

5. **Plan for network issues** - Add retry logic and fallbacks for when connections drop

6. **Separate UI updates from data logic** - Reactive programming makes this natural

## References & Resources

### Official Documentation

- [RxJS Documentation](https://rxjs.dev/) - The official docs for RxJS
- [Socket.IO Documentation](https://socket.io/docs/) - Learn more about WebSocket communication
- [HTML5 Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - MDN's guide to the Canvas API

### Tutorials & Articles

- [Building Real-time Applications with RxJS](https://www.learnrxjs.io/learn-rxjs/recipes/real-time-apps) - More patterns for real-time apps
- [WebSockets vs. Server-Sent Events](https://medium.com/platform-engineer/web-api-design-using-server-sent-events-vs-websockets-d42194e375. Eventsd) - Comparing real-time technologies

### Libraries & Tools

- [RxJS](https://rxjs.dev/) - The reactive extensions library for JavaScript
- [Socket.IO](https://socket.io/) - Real-time bidirectional event-based communication
- [Fabric.js](http://fabricjs.com/) - Canvas library with more advanced drawing tools

### Example Projects

- [RxJS Whiteboard](https://github.com/johnlindquist/rx-whiteboard) - Another example of a reactive whiteboard
- [Excalidraw](https://github.com/excalidraw/excalidraw) - Open-source collaborative drawing app

## Final Thoughts

Building a collaborative drawing app with reactive programming shows how powerful this approach can be for real-time, interactive applications. The beauty is in how clean and maintainable the code stays, even as complexity grows.

The real win here is that we've created something that would be pretty complicated with traditional approaches, but becomes straightforward when thinking in terms of streams and transformations.

I hope this tutorial has shown you not just how to build a drawing app, but how reactive programming can tackle real-world problems in an elegant way.

Next time you're building something where multiple users need to interact in real-time, remember the patterns we've used here. Whether it's a collaborative text editor, a multiplayer game, or a shared dashboard - reactive programming has you covered!

Happy coding (and drawing)!
