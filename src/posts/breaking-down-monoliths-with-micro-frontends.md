---
title: "Breaking Down Monoliths with Micro-Frontends"
date: "2025-05-15"
description: "Learn how to split your giant frontend apps into smaller, independent pieces that teams can build and deploy separately."
tags:
  [
    "Architecture",
    "JavaScript",
    "Frontend",
    "Micro-Frontends",
    "Team Collaboration",
    "ERP",
  ]
---

I've seen many large enterprise applications that turned into maintenance nightmares. Codebases so huge that making even tiny changes felt like performing surgery while blindfolded. New team members taking weeks just to understand how things fit together. And deployments? One small bug could delay the whole release.

Sound familiar? I bet many of you are nodding right now.

Micro-frontends can change everything. Today I'll show you how breaking your giant app into smaller pieces can make your dev life much less stressful.

> I was skeptical at first. "Great, another buzzword to put on my LinkedIn profile," I thought. But after seeing how it transforms workflows and codebases, I became a believer. This isn't just architecture theory – it's a practical way to make large frontends manageable again.

{toc}

## What's Wrong With Our Current Approach?

Before diving into micro-frontends, let's talk about why we need them in the first place.

Most of us start with a single frontend application. It makes perfect sense when you're building something new. One repo, one build process, one deployment – simple!

But as your product grows, things get messy:

- The codebase balloons to thousands of files
- Different teams step on each other's toes constantly
- One team's experimental code breaks another team's stable features
- The build time stretches from seconds to many minutes
- Deployments become scary, high-risk events

We've tried to solve this with better folder structures, strict code reviews, and fancy state management. These help, but they don't solve the core problem: **everything is still connected**.

### The "Too Big to Fail" Frontend

I've seen enterprise applications grow so large that:

- A full rebuild took 15 minutes
- No one person understood the entire codebase
- Teams had to coordinate all their releases
- New hires took 3+ months to become productive

The app had become "too big to fail" – and paradoxically, that made it fail more often.

That's exactly where micro-frontends come in.

## What Are Micro-Frontends, Really?

Put simply, micro-frontends are:

**Independent pieces of your UI that different teams can build, test, and deploy separately.**

Think of it like microservices, but for your frontend. Instead of one massive app, you have several smaller apps that work together to create a unified experience for users.

Each micro-frontend:

- Can be built with different technologies (React, Vue, etc.)
- Has its own repo, build process, and deployment pipeline
- Is owned by a specific team
- Can be updated without touching other parts of the application

Here's an example scenario: Imagine a large ERP system that handles everything from inventory management to HR and accounting. You might have:

- A team building the inventory and warehouse management modules
- Another team focusing on the accounting and financial reporting features
- A HR team building employee management and payroll functionality
- A common components team that builds shared UI elements everyone uses

With micro-frontends, each team builds their part as a separate application. These pieces then come together in the user's browser to create what feels like one seamless system.

## Core Principles: What Makes It Work

For micro-frontends to really shine, you need to follow some key principles:

### 1. Team Autonomy

Each team should be able to work independently without waiting on others. This means:

- Separate codebases
- Separate build pipelines
- Freedom to choose the right tools for their specific needs
- Clear ownership boundaries

When we implemented this at my previous job, teams went from having multiple meetings per week to coordinate work to almost none. The productivity boost was immediate.

### 2. Technology Agnostic

Different parts of your app can use different technologies when it makes sense. This is powerful because:

- Teams can pick the best tool for their specific job
- You can gradually modernize legacy code
- You can experiment with new frameworks in isolated areas

I saw this in action when our team needed to use D3.js for complex visualizations while the rest of the app used React. Instead of forcing everything into React, we built our part as a separate micro-frontend with the tools that made sense for us.

### 3. Resilience By Design

Each micro-frontend should be robust enough that if one fails, the others keep working. This means:

- Isolated JavaScript execution
- Independent API calls
- Fallback UIs when something breaks

This saved us during a major outage when our recommendation service went down. Instead of the whole site crashing, only the "Recommended Products" section showed an error message – customers could still browse and purchase normally.

### 4. Simple Integration

The pieces need to come together smoothly for users. This requires:

- A solid composition strategy (I'll cover different approaches soon)
- Shared design systems for visual consistency
- Communication contracts between micro-frontends

## Composition Strategies: How to Put The Pieces Together

There are several ways to combine your micro-frontends into a cohesive application:

### 1. Client-Side Composition

This is where your micro-frontends are loaded and assembled directly in the browser:

```js
// In your container application
import { mountProductGallery } from "product-gallery";
import { mountShoppingCart } from "shopping-cart";

// Mount each micro-frontend in its designated spot
mountProductGallery(document.getElementById("product-section"));
mountShoppingCart(document.getElementById("cart-section"));
```

**Pros:**

- Flexible loading of features
- Good for single-page applications
- Can lazy-load micro-frontends as needed

**Cons:**

- Can impact initial load time
- Requires runtime integration logic

### 2. Server-Side Composition

Here, your backend assembles the page by gathering HTML from different micro-frontend servers:

```js
// On your edge server or BFF (Backend For Frontend)
async function renderPage(req, res) {
  const header = await fetch("http://team-header/header").then((r) => r.text());
  const products = await fetch("http://team-products/products").then((r) =>
    r.text()
  );
  const footer = await fetch("http://team-footer/footer").then((r) => r.text());

  res.send(`
    <html>
      <body>
        ${header}
        ${products}
        ${footer}
      </body>
    </html>
  `);
}
```

**Pros:**

- Faster initial page load
- Better SEO out of the box
- Works without JavaScript

**Cons:**

- More complex server setup
- Less dynamic interaction between components

### 3. Edge-Side Composition

A newer approach where CDN edge workers stitch content together:

```js
// In your Cloudflare Worker or similar edge function
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const headerResponse = await fetch("https://header.yourdomain.com/");
  const contentResponse = await fetch("https://content.yourdomain.com/");

  const headerHtml = await headerResponse.text();
  const contentHtml = await contentResponse.text();

  return new Response(
    `
    <html>
      <body>
        ${headerHtml}
        ${contentHtml}
      </body>
    </html>
  `,
    {
      headers: { "Content-Type": "text/html" },
    }
  );
}
```

**Pros:**

- Combines benefits of server and client approaches
- Great performance with global distribution
- Reduced backend complexity

**Cons:**

- Newer technology with less established patterns
- Limited processing capabilities at the edge

### 4. Web Components

Using the Web Components standard to create custom HTML elements:

```js
// Team creates a custom element
class ProductGallery extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="product-gallery">...</div>`;
    // Initialize the component, fetch data, etc.
  }
}

customElements.define("product-gallery", ProductGallery);

// Main app just uses the HTML tag
<body>
  <header-component></header-component>
  <product-gallery category="electronics"></product-gallery>
  <footer-component></footer-component>
</body>;
```

**Pros:**

- Uses web standards
- Framework-agnostic
- Good encapsulation

**Cons:**

- Less mature ecosystem than popular frameworks
- Browser support considerations

## Real-World Implementation: ERP System Example

Let's get practical and see how this could be implemented for a typical ERP system.

### Step 1: Define Your Boundaries

First, identify distinct functional areas of your ERP app and map them to teams:

- **Shell Application**: The container that brings everything together (navigation, authentication, etc.)
- **Inventory Module**: Stock management, warehousing, and procurement
- **Financial Module**: Accounting, reporting, and budgeting
- **HR Module**: Employee records, payroll, and time tracking
- **Customer Module**: CRM, sales, and customer service

### Step 2: Set Up Your Infrastructure

Create:

1. A shared design system package for consistent UI
2. A simple event bus for cross-team communication
3. A development environment that can run all micro-frontends locally

### Step 3: Build the Shell Application

The shell is responsible for:

- Main navigation
- Authentication
- Loading the correct modules based on user permissions
- Providing shared services

```js
// simplified shell application
import { createMicroFrontend } from "./framework";

// Define which micro-frontend serves which ERP module
const modules = {
  "/dashboard": "http://localhost:3001/remoteEntry.js",
  "/inventory": "http://localhost:3002/remoteEntry.js",
  "/finance": "http://localhost:3003/remoteEntry.js",
  "/hr": "http://localhost:3004/remoteEntry.js",
  "/customers": "http://localhost:3005/remoteEntry.js",
};

// When the user navigates to a different module
window.addEventListener("popstate", () => {
  const path = window.location.pathname;
  const moduleUrl = modules[path] || modules["/dashboard"];

  // Load and mount the micro-frontend
  createMicroFrontend(moduleUrl, document.getElementById("content"));
});
```

### Step 4: Communication Between Micro-Frontends

For micro-frontends to work together without tight coupling, we used a simple pub/sub system:

```js
// A basic event bus we all agreed to use
const EventBus = {
  events: {},

  subscribe(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => this.unsubscribe(event, callback);
  },

  publish(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  },

  unsubscribe(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  },
};

// In the product micro-frontend
function addToCart(product) {
  // Logic to add the product

  // Then notify other micro-frontends
  EventBus.publish("product:added-to-cart", {
    id: product.id,
    name: product.name,
    price: product.price,
  });
}

// In the cart micro-frontend
EventBus.subscribe("product:added-to-cart", (product) => {
  updateCartCount();
  showAddedNotification(product.name);
});
```

### Step 5: Shared UI Components

To maintain visual consistency, we created a shared component library:

```js
// In a shared NPM package @our-company/design-system
export const Button = (props) => {
  const { variant = "primary", children, ...rest } = props;
  return (
    <button className={`btn btn-${variant}`} {...rest}>
      {children}
    </button>
  );
};

// Used in each micro-frontend
import { Button } from "@our-company/design-system";

function ProductActions() {
  return (
    <div>
      <Button variant="secondary">Save for Later</Button>
      <Button variant="primary">Add to Cart</Button>
    </div>
  );
}
```

## ERP-Specific Considerations for Micro-Frontends

Enterprise Resource Planning systems present some unique challenges and opportunities for micro-frontends:

### Shared Data Models

ERP systems are heavily interconnected - inventory affects accounting, sales affects inventory, and so on.

**How to handle it**: Create a shared data layer with clear contracts between modules. For example, when the inventory module creates a purchase order, it can publish an event with a specifically structured data object that the finance module consumes.

```js
// When a purchase order is approved in the inventory module
EventBus.publish("inventory:purchase-order-approved", {
  id: "PO-12345",
  vendor: { id: "V-789", name: "Acme Supplies" },
  totalAmount: 5000.0,
  items: [{ sku: "WIDGET-A", quantity: 100, unitPrice: 50.0 }],
  approvedBy: "user-456",
  approvedAt: "2025-04-01T10:30:00Z",
});

// The finance module listens for this to create corresponding entries
EventBus.subscribe("inventory:purchase-order-approved", (purchaseOrder) => {
  createAccountsPayableEntry(purchaseOrder);
  updateBudgetAllocation(purchaseOrder);
});
```

### Permission Management

ERP systems have complex permission structures - a user might have access to certain parts of multiple modules.

**Potential solution**: Centralize permission management in the shell application, with a shared permission service that each micro-frontend can query:

```js
// In any micro-frontend
import { permissionService } from "@our-erp/core";

function InventoryActions({ itemId }) {
  const canAdjustStock = permissionService.hasPermission(
    "inventory:adjust-stock"
  );
  const canOrder = permissionService.hasPermission(
    "inventory:create-purchase-order"
  );

  return (
    <div>
      {canAdjustStock && (
        <Button onClick={() => adjustStock(itemId)}>Adjust Stock</Button>
      )}
      {canOrder && <Button onClick={() => createPO(itemId)}>Order More</Button>}
    </div>
  );
}
```

### Consistent Terminology

One unexpected challenge was keeping terminology consistent across modules - what the inventory team calls a "vendor" might be a "supplier" to the finance team.

**Our approach**: We created a shared glossary service that all teams use, ensuring that UI labels and documentation use consistent terms:

```js
// Instead of hardcoding terms
<label>Vendor:</label>;

// We do this
import { terms } from "@our-erp/glossary";
<label>{terms.get("vendor")}:</label>;
```

This might seem trivial, but in an ERP with hundreds of business terms, consistency makes a huge difference in user experience.

## Common Challenges (And How We Solved Them)

### Challenge 1: Styling Conflicts

Each micro-frontend loading its own CSS can lead to conflicts.

**Solution:**

- CSS-in-JS with scoped styles
- CSS Modules to namespace classes
- A shared design system with consistent naming

```js
// Using CSS Modules in a micro-frontend
import styles from "./Header.module.css";

function Header() {
  return <header className={styles.header}>...</header>;
}
```

### Challenge 2: Duplicate Dependencies

When each app bundles React, you might end up downloading React 5 times!

**Solution:**

- Webpack Module Federation to share common libraries
- Import maps for native browser support
- A well-planned shared dependencies strategy

```js
// webpack.config.js with Module Federation
module.exports = {
  // ...
  plugins: [
    new ModuleFederationPlugin({
      name: "productApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductList": "./src/ProductList",
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
      },
    }),
  ],
};
```

### Challenge 3: Authentication & Session Management

Users shouldn't have to log in separately for each micro-frontend.

**Solution:**

- Centralized auth in the shell application
- Shared auth cookies or tokens
- Single sign-on implementation

### Challenge 4: Performance Concerns

Multiple separate applications can impact load time.

**Solution:**

- Server-side rendering for initial loads
- Careful bundling strategy
- Preloading critical micro-frontends
- Skeleton screens while loading

### Challenge 5: Cross-Module Workflows

In ERP systems, many processes span multiple modules - like when a sales order triggers inventory changes and financial transactions.

**Solution:**

- Workflow orchestration service in the shell
- Clear event contracts between modules
- Status tracking for cross-module processes

```js
// In the shell application
const workflowService = {
  startWorkflow(type, data) {
    const workflow = this.workflows[type];
    const state = { status: "started", currentStep: 0, data };
    workflow.steps[0].execute(state);
  },

  workflows: {
    salesOrderFulfillment: {
      steps: [
        {
          module: "sales",
          execute: (state) =>
            EventBus.publish("workflow:sales-order-created", state),
        },
        {
          module: "inventory",
          execute: (state) =>
            EventBus.publish("workflow:allocate-inventory", state),
        },
        {
          module: "finance",
          execute: (state) =>
            EventBus.publish("workflow:create-invoice", state),
        },
      ],
    },
  },
};
```

## Is This Right For Your Team?

Micro-frontends aren't for everyone. Consider these questions:

1. **Team Size**: Do you have multiple teams working on the same frontend? Smaller teams (<10 devs total) might not need this complexity.

2. **Application Complexity**: Is your app large enough that breaking it down makes sense? If your app is simple, stick with a monolith.

3. **Technical Maturity**: Does your team have the DevOps skills to manage multiple deployments and integration points?

4. **Business Value**: Will the overhead of setup pay off in faster future delivery?

A good exercise when considering this approach is to ask each team to list their biggest development pain points. If most complaints are about team coordination, release conflicts, and codebase complexity, micro-frontends could be the answer.

## Lessons From The Trenches

From what I've observed across multiple projects using this approach, here are key takeaways:

1. **Start Small**: Begin with just two micro-frontends and get the infrastructure right before expanding.

2. **Document Contracts**: Write clear documentation about how your micro-frontends communicate.

3. **Test Integration Points**: Create tests specifically for the places where your micro-frontends connect.

4. **Monitor Carefully**: Set up proper monitoring to catch issues quickly.

5. **Focus on DX**: Developer experience matters – make local development easy.

The most successful micro-frontend projects aren't necessarily the ones with the fanciest tech – they're the ones where teams pay attention to these practical points.

## Conclusion: Breaking Free From Monolithic Frontends

Micro-frontends aren't just an architectural pattern – they're a way to structure your teams for better independence and ownership. When done right, they transform not just your codebase but your entire development culture.

Are they perfect? Nope.  
Are they complex? Sometimes.  
Can they radically improve how you build large applications? Absolutely.

From what I've seen, the initial setup cost is quickly recovered through faster feature delivery, happier teams, and a more maintainable codebase. Teams that implement this approach effectively often find themselves shipping features more frequently and with greater confidence.
