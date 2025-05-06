---
title: "How I Slashed Angular Form Rendering Time by 90% Using WeakMap Caching"
date: "2025-04-10"
description: "Learn how strategic caching with WeakMap can dramatically improve Angular form performance without major refactoring."
tags: ["Angular", "TypeScript", "Performance", "WeakMap", "Caching"]
---

# How I Slashed Angular Form Rendering Time by 90% Using WeakMap Caching

Last month, I faced a performance nightmare with our enterprise Angular application. Our form rendering was painfully slow, especially on lower-end devices. Users were complaining, management was getting anxious, and I was tasked with fixing it without rewriting the entire codebase.

Today, I'm sharing how I solved this with some clever TypeScript caching. No frameworks, no libraries—just smart code organization and strategic caching.

> I'll admit, I was skeptical at first about whether such a simple concept could make a big difference. But after seeing our form render times drop by 90%, I'm convinced that strategic caching is one of the most underutilized performance tools in the Angular developer's toolkit.

{toc}

## The Performance Killer: Our Dynamic Forms System

Our app has these complex performance-agreement forms with different "process types" (OKR, SMART, Competency) that completely change how fields behave and look. Each field can:

- Change its layout (column/row span) based on process type
- Show/hide based on complex business rules
- Have dynamic validation rules
- Adapt its appearance based on view mode

The killer issue? Every time Angular ran change detection (which happens A LOT), we were recalculating these properties over and over. For a form with 20+ fields, this meant hundreds of redundant calculations per render cycle.

My initial time measurement showed that 80% of our render time was spent on these calculations. Not good.

## The Solution I Came Up With: WeakMap Caching

After digging through the code, I realized we needed a caching system that would:

1. Cache results based on the specific field and its context
2. Not cause memory leaks
3. Be simple enough that my team could maintain it
4. Work with our existing code without massive refactoring

My solution centered around TypeScript's `WeakMap`, which I'd never used in a real project before. Here's the approach:

```typescript
// I created a namespace to keep everything organized
namespace FieldUtils {
  // Different caches for different property types
  const caches = {
    displayProperties: new WeakMap(),
    editability: new WeakMap(),
    requirement: new WeakMap(),
    validation: new WeakMap(),
    visibility: new WeakMap()
  };

  // I made this helper to generate consistent cache keys
  function createCacheKey(processTypes, entity) {
    return `${entity?.id || ''}_${processTypes.sort().join(',')}`;
  }

  // Here's how one of the caching functions works
  function isVisible(field, processTypes, entity) {
    // Bail early if inputs are invalid
    if (!field || !processTypes.length) return false;

    // Create key and get the field's cache
    const cacheKey = createCacheKey(processTypes, entity);

    if (!caches.visibility.has(field)) {
      caches.visibility.set(field, new Map());
    }
    const fieldCache = caches.visibility.get(field);

    // Return cached value if we have it
    if (fieldCache.has(cacheKey)) {
      return fieldCache.get(cacheKey);
    }

    // Otherwise calculate, cache, and return
    let result = /* complex visibility calculation */;
    fieldCache.set(cacheKey, result);
    return result;
  }
}
```

## Why WeakMap Is Perfect for This

I chose `WeakMap` specifically because:

1. It uses object references as keys (perfect for our field objects)
2. It **automatically handles garbage collection** - when a field object is no longer referenced elsewhere, its cache automatically gets cleaned up
3. It's fast - O(1) lookup time

This approach meant zero memory management headaches. We never need to worry about clearing caches manually.

## The Real-World Results

After implementing this across our field property systems, the results were dramatic:

- Form rendering time dropped by ~90%
- Scrolling became buttery smooth even on complex forms
- CPU usage during form interaction plummeted
- No more "Angular is running in development mode" warnings about excessive change detection

The best part? We didn't need to change our component code or templates at all. The caching happens entirely in the utility functions, making it a mostly transparent optimization.

## Digging Into the Implementation Details

### The Double-Map Approach

One of the most interesting aspects of this solution is what I call the "double-map" approach. We don't just use a WeakMap - we use a WeakMap of Maps:

```typescript
// This is what's really going on:
WeakMap<FieldConfig, Map<string, ResultType>>;
```

This two-level structure gives us incredible flexibility:

- The outer WeakMap uses the field object as a key
- The inner Map uses a string key representing the specific context (like process types and entity state)

This approach lets us cache multiple different results for the same field based on different contexts. For example, the same field might be visible with OKR process type but hidden with SMART process type.

### The Cache Key Challenge

The trickiest part was designing proper cache keys. We needed keys that:

1. Uniquely identified the calculation context
2. Were consistent across calls with the same input values
3. Weren't unnecessarily complex (to avoid string parsing overhead)

For entity-based calculations, we used the entity ID as the basis:

```typescript
function createEntityCacheKey(entity, additionalContext) {
  const entityId = entity?.id || "";
  return additionalContext ? `${entityId}_${additionalContext}` : entityId;
}
```

For process-type based calculations, we needed to ensure consistent ordering:

```typescript
function createProcessTypeKey(processTypes) {
  // Sort to ensure consistent key regardless of array order
  return processTypes.slice().sort().join(",");
}
```

This became crucial for complex cases where we combined both:

```typescript
// For visibility that depends on both entity state AND process types
const typesKey = createProcessTypeKey(processTypes);
const cacheKey = createEntityCacheKey(entity, typesKey);
```

### The Validator Function Challenge

One particularly complex case was validation. Angular form validators don't naturally lend themselves to caching, since they're functions rather than plain values.

The challenge was that each field could have multiple different validation rules, and those rules could reference entity values. We solved this by creating a custom validation function factory:

```typescript
function createCachedValidator(rule, entity) {
  return (control) => {
    // For validators, we cache based on the control value as well
    const value = control.value;
    const valueKey =
      typeof value === "object" ? JSON.stringify(value) : String(value);
    const cacheKey = createEntityCacheKey(entity, valueKey);

    // Use our generic caching pattern
    return getCachedValue(rule, validationResultCache, cacheKey, () =>
      rule.validator(value, entity) ? null : { [rule.errorKey]: true }
    );
  };
}
```

This approach gave us validation that was both fast and properly integrated with Angular's form system.

## Beyond Simple Properties: Layout Calculations

The most dramatic improvements came from caching field layout calculations. In our system, fields could specify their layout in several ways:

1. Default layout (simple column/row span)
2. Process-type specific layouts
3. Custom calculation functions based on complex logic

Before caching, template bindings like this were causing major performance issues:

```html
<f-grid-item
  [colSpan]="getFieldColSpan(field, processTypes)"
  [rowSpan]="getFieldRowSpan(field, processTypes)"
></f-grid-item>
```

These calculations could involve multiple conditional checks, lookups, and function calls - all happening twice per field, every render cycle.

Our caching solution consolidated these into a single cached function:

```typescript
function getDisplayProperties(field, processTypes) {
  // Cache key based on process types
  const cacheKey = createProcessTypeKey(processTypes);

  // Get or create the field's cache
  if (!displayPropsCache.has(field)) {
    displayPropsCache.set(field, new Map());
  }
  const fieldCache = displayPropsCache.get(field);

  // Return cached result if available
  if (fieldCache.has(cacheKey)) {
    return fieldCache.get(cacheKey);
  }

  // Otherwise calculate the layout
  let result = { colSpan: 2, rowSpan: 1 }; // Default layout

  // Try the field's custom function first
  if (field.getDisplayProperties) {
    result = field.getDisplayProperties(processTypes);
  }
  // Then check process-type specific configurations
  else if (field.processTypeDisplayProperties) {
    for (const processType of processTypes) {
      const typeProps = field.processTypeDisplayProperties[processType];
      if (typeProps) {
        result = typeProps;
        break;
      }
    }
  }
  // Fall back to default display properties
  else if (field.displayProperties) {
    result = field.displayProperties;
  }

  // Cache and return
  fieldCache.set(cacheKey, result);
  return result;
}
```

Then we updated our component with a simpler method:

```typescript
getFieldDisplayValue(field, property) {
  const props = getDisplayProperties(field, this.processTypes);
  return props[property] || (property === 'colSpan' ? 2 : 1);
}
```

And our template became:

```html
<f-grid-item
  [colSpan]="getFieldDisplayValue(field, 'colSpan')"
  [rowSpan]="getFieldDisplayValue(field, 'rowSpan')"
></f-grid-item>
```

This change alone cut our rendering time in half because each field's display properties were now calculated exactly once per render cycle, regardless of how many properties we needed.

## Refactoring Our Service Layer

With the core caching mechanism in place, we refactored our services to use a facade pattern. This kept the API clean while leveraging our optimizations:

```typescript
@Injectable({ providedIn: "root" })
export class FieldConfigService {
  // Original methods now delegates to cached implementations
  isFieldEditable(field, entity) {
    return FieldUtils.isEditable(field, entity);
  }

  isFieldRequired(field, entity) {
    return FieldUtils.isRequired(field, entity);
  }

  // New methods for the expanded functionality
  getFieldDisplayProperties(field, processTypes) {
    return FieldUtils.getDisplayProperties(field, processTypes);
  }
}
```

This gave us the best of both worlds: clean service APIs with optimized implementations.

## Unexpected Benefits: Better Error Detection

An unexpected benefit of our caching approach was better error detection. By centralizing these calculations, we were able to add better error handling and debugging.

For example, in our validation function:

```typescript
function validate(field, value, entity) {
  // ... caching logic ...

  try {
    // Now we could add proper error boundaries around the validation
    if (field.validationRules) {
      field.validationRules.forEach((rule) => {
        try {
          if (!rule.validator(value, entity)) {
            errors.push(rule.errorKey);
          }
        } catch (error) {
          console.error(
            `Error validating field ${field.key} with rule ${rule.errorKey}:`,
            error
          );
          errors.push("internal.validationError");
        }
      });
    }
  } catch (error) {
    console.error(`Catastrophic error validating field ${field.key}:`, error);
    return ["internal.criticalError"];
  }

  // ... more logic ...
}
```

This improved error handling made debugging much easier and prevented cryptic UI errors.

## Lessons I Learned

This experience taught me several valuable lessons:

1. **Measure before optimizing** - My initial assumptions about what was causing slowness were wrong. Profiling showed the real culprits.

2. **WeakMap is underused in Angular** - It's perfect for component-level caching where you need to associate data with objects that have lifecycle.

3. **TypeScript namespaces are still useful** - Despite being considered "old-school" by some, they're great for organizing utility functions.

4. **Caching isn't just for HTTP calls** - Calculation caching can have just as big an impact as network caching.

5. **Performance optimization doesn't have to be ugly** - This solution actually made our code cleaner and more maintainable.

## The Code Pattern I Use Now

I've since standardized this pattern in our codebase:

```typescript
function getCachedValue<T>(
  object: any, // The object to associate with
  cache: WeakMap<any, Map<string, T>>, // The WeakMap cache to use
  cacheKey: string, // String key for this specific context
  calculator: () => T // Function to run on cache miss
): T {
  // Initialize cache for this object if needed
  if (!cache.has(object)) {
    cache.set(object, new Map<string, T>());
  }

  const objectCache = cache.get(object);

  // Return cached value if it exists
  if (objectCache.has(cacheKey)) {
    return objectCache.get(cacheKey);
  }

  // Calculate, cache and return
  const value = calculator();
  objectCache.set(cacheKey, value);
  return value;
}
```

This has been a game-changer for us. Whenever we have expensive calculations that run repeatedly with the same inputs, we wrap them with this pattern.

## Angular's Change Detection and Our Optimizations

One aspect I haven't discussed yet is how this interacts with Angular's change detection. Angular's default change detection strategy runs checks on all components after any event or async operation. For complex forms, this means a lot of recalculation.

We experimented with OnPush change detection, but that wasn't enough on its own. The problem was that our calculations were still being triggered during every check cycle because template bindings were calling functions.

Our caching solution dramatically reduced the work done during these check cycles. Even though the functions were still being called, they were now returning cached values instead of recalculating.

We did find one extra optimization though - Angular's binding system doesn't cache the results of method calls (like `[colSpan]="getColSpan(field)"`), but it does cache property access. This led us to experiment with a memoization decorator for component methods:

```typescript
function Memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const cacheKey = Symbol("memoizeCache");

  descriptor.value = function (...args) {
    this[cacheKey] = this[cacheKey] || new Map();
    const key = JSON.stringify(args);

    if (this[cacheKey].has(key)) {
      return this[cacheKey].get(key);
    }

    const result = originalMethod.apply(this, args);
    this[cacheKey].set(key, result);
    return result;
  };

  return descriptor;
}
```

Then we could use it like this:

```typescript
@Memoize
getFieldDisplayValue(field, property) {
  const props = FieldUtils.getDisplayProperties(field, this.processTypes);
  return props[property] || (property === 'colSpan' ? 2 : 1);
}
```

This added an extra layer of caching at the component level, making the binding system more efficient. However, we had to be careful with this approach, as it could lead to stale values if not properly managed.

## Real-World Trade-offs

While the caching approach was generally successful, we did face some trade-offs:

1. **Debugging complexity**: Cached values sometimes made debugging more difficult since the actual calculation might have happened much earlier than when an issue was observed.

2. **Cache invalidation concerns**: For some fields, we needed to explicitly clear caches when external state changed in ways our cache keys didn't capture.

3. **Memory usage**: While WeakMap helped with garbage collection, our approach did increase memory usage somewhat. The performance benefits far outweighed this cost.

4. **TypeScript complexity**: The typing for our caching system was nontrivial, especially with the nested maps and generic types.

Overall, these trade-offs were well worth it for the performance gains we achieved.

## Would I Recommend This Approach?

Absolutely, but with a few caveats:

1. Make sure you actually have a performance problem first
2. Only cache calculations that are genuinely expensive
3. Be careful with your cache keys to avoid incorrect cached values
4. Use TypeScript's strong typing to keep the caching system maintainable
5. Consider the memory implications, especially for very large forms
6. Add proper cache debugging tools if your app is complex

## What's Next for Us?

This project has opened several new avenues for optimization:

1. **Applying similar patterns to other complex components**: We've started using this approach in our data grid components with similar success.

2. **Building a more general caching utility**: We're developing a more abstract caching utility that can be used across our codebase.

3. **Exploring selector patterns**: Redux-style selectors with memoization offer similar benefits in a more structured way.

4. **Better dev tools**: We're building better debugging tools to work with our caching system, making it easier to inspect cached values and clear caches during development.

Have you faced similar performance challenges in complex Angular apps? What solutions have worked for you? I'm always looking to learn from others' experiences, so drop a comment below!

_P.S. If you're interested in more posts like this, sign up for my newsletter where I share performance tips and patterns I discover in my day-to-day work with complex Angular applications._
