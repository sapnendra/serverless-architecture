import { useRef, useCallback, useEffect } from "react";

/**
 * Debounces a function call - delays execution until after wait time has elapsed
 * since the last time it was invoked
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * Throttles a function call - ensures function is called at most once per wait time
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): (...args: Parameters<T>) => void {
  const inThrottle = useRef(false);
  const lastArgs = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    return () => {
      inThrottle.current = false;
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;

        setTimeout(() => {
          inThrottle.current = false;
          if (lastArgs.current) {
            callback(...lastArgs.current);
            lastArgs.current = null;
          }
        }, limit);
      } else {
        lastArgs.current = args;
      }
    },
    [callback, limit]
  );
}

/**
 * Combined debounce and throttle - debounces input but also throttles to prevent
 * excessive calls even if user keeps typing
 */
export function useDebouncedThrottle<T extends (...args: any[]) => any>(
  callback: T,
  debounceMs: number,
  throttleMs: number
): (...args: Parameters<T>) => void {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const throttleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecutionRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (throttleTimerRef.current) clearTimeout(throttleTimerRef.current);
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      const now = Date.now();
      const timeSinceLastExecution = now - lastExecutionRef.current;

      // Throttle: if last execution was recent, schedule for later
      if (timeSinceLastExecution < throttleMs && throttleTimerRef.current === null) {
        throttleTimerRef.current = setTimeout(() => {
          callback(...args);
          lastExecutionRef.current = Date.now();
          throttleTimerRef.current = null;
        }, throttleMs - timeSinceLastExecution);
      } else {
        // Debounce: wait for user to stop typing
        debounceTimerRef.current = setTimeout(() => {
          callback(...args);
          lastExecutionRef.current = Date.now();
        }, debounceMs);
      }
    },
    [callback, debounceMs, throttleMs]
  );
}
