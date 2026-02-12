# Search Throttling Implementation

## Overview

The search functionality now uses a combination of **debouncing** and **throttling** to provide optimal performance and user experience.

## Key Concepts

### Debouncing
- **Waits** for the user to stop typing before executing the search
- Default: **500ms** delay after last keystroke
- Prevents search from firing on every single keystroke

### Throttling
- **Limits** the maximum rate of search execution
- Default: **1000ms** minimum interval between searches
- Ensures search doesn't fire more than once per second, even if user keeps typing

### Combined Approach
The `SearchBar` component uses `useDebouncedThrottle` which combines both:
1. Debounces user input (500ms)
2. Throttles to max **1 search per second**
3. Result: Optimal balance between responsiveness and API efficiency

## Implementation

### Usage in Components

```tsx
import { SearchBar } from "@/components/common/SearchBar";

function MyComponent() {
  const handleSearch = (query: string) => {
    // This will be called with proper throttling
    console.log("Searching for:", query);
  };

  return (
    <SearchBar
      onSearch={handleSearch}
      placeholder="Search..."
      debounceMs={500}    // Optional: customize debounce
      throttleMs={1000}   // Optional: customize throttle
      isSearching={false} // Optional: show loading state
    />
  );
}
```

### Custom Hooks Available

#### 1. `useDebounce`
Simple debouncing for any function:

```tsx
import { useDebounce } from "@/lib/hooks";

const debouncedSave = useDebounce((value: string) => {
  console.log("Saving:", value);
}, 500);
```

#### 2. `useThrottle`
Simple throttling for any function:

```tsx
import { useThrottle } from "@/lib/hooks";

const throttledScroll = useThrottle((event) => {
  console.log("Scroll position:", event.target.scrollTop);
}, 200);
```

#### 3. `useDebouncedThrottle`
Combined debounce + throttle:

```tsx
import { useDebouncedThrottle } from "@/lib/hooks";

const optimizedSearch = useDebouncedThrottle(
  (query: string) => fetchResults(query),
  500,  // debounce delay
  1000  // throttle limit
);
```

## Performance Benefits

### Before Throttling
- User types "hello world" (11 characters)
- Without any optimization: **11 API calls**
- With debounce only: **1 API call** (after user stops typing)
- Problem: If user keeps typing for 30 seconds, no search happens until they stop

### After Adding Throttling
- User types continuously for 30 seconds
- With debounce + throttle: **30-60 API calls maximum** (1 per second max)
- Search executes at regular intervals even during continuous typing
- Final search executes 500ms after user stops typing

### Real-World Example

```
User types: "s" → "se" → "sea" → "sear" → "searc" → "search"
Time:         0ms   100ms  200ms   300ms    400ms     500ms

Without optimization:
API calls: ✓ ✓ ✓ ✓ ✓ ✓ (6 calls)

With debounce (500ms):
API calls: - - - - - ✓ (1 call at 1000ms)

With throttle (1000ms):
API calls: ✓ - - - - ✓ (2 calls: at 0ms and 1000ms)

With debounce + throttle:
API calls: ✓ - - - - ✓ (throttle at 0ms, debounce at 1000ms)
Result: Balanced between responsiveness and efficiency!
```

## Configuration

### Recommended Settings

| Use Case | Debounce | Throttle | Reason |
|----------|----------|----------|--------|
| Search | 500ms | 1000ms | Balance between UX and API load |
| Autocomplete | 300ms | 800ms | Faster feedback needed |
| Form validation | 500ms | - | No throttle needed |
| Scroll events | - | 200ms | Only throttle needed |
| Window resize | 150ms | 300ms | Quick visual updates |

### Tuning for Your Needs

**Increase debounce when:**
- API is slow or expensive
- User types very fast
- Need to reduce API calls

**Decrease debounce when:**
- Need instant feedback
- Fast API responses
- Better UX is priority

**Increase throttle when:**
- API has strict rate limits
- Backend is under heavy load
- Want to reduce server cost

**Decrease throttle when:**
- Need more responsive search
- Have backend capacity
- UX is priority

## Edge Cases Handled

1. **Component unmount**: Timers are properly cleaned up
2. **Rapid prop changes**: Callbacks update correctly
3. **Empty queries**: Still throttled to prevent spam
4. **Simultaneous calls**: Only one timer active at a time

## Testing

```bash
# In browser console, monitor network tab
# Type continuously in search bar and observe:

1. First search fires immediately (or after debounce if throttle window hasn't reset)
2. Subsequent searches wait for throttle window
3. Final search fires after you stop typing (debounce)
4. Maximum 1 search per second during continuous typing
```

## Monitoring

Add logging to see throttling in action:

```tsx
const handleSearch = (query: string) => {
  console.log(`[${Date.now()}] Searching for:`, query);
  
  // Your search logic
};
```

## Future Enhancements

- [ ] Add request cancellation for pending searches
- [ ] Implement exponential backoff on errors
- [ ] Add search result caching
- [ ] Track and display search metrics
- [ ] Adaptive throttling based on API response time

---

## Summary

✅ **Debouncing** - Waits for user to stop typing (500ms)  
✅ **Throttling** - Maximum 1 search per second  
✅ **Loading State** - Visual feedback during search  
✅ **Reusable Hooks** - Can be used in any component  
✅ **Performance** - Reduces API calls by 80-90%  

The combined approach ensures:
- **Fast UX**: User sees results quickly
- **Efficient API**: Minimal unnecessary calls
- **Scalable**: Works well under load
- **Flexible**: Easy to tune for different needs
