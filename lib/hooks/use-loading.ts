import { useState, useCallback, useRef } from 'react';
import { logPerformance } from '@/lib/logger';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  startTime: number | null;
}

interface UseLoadingOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  logOperation?: string;
}

export function useLoading(initialState = false, options: UseLoadingOptions = {}) {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialState,
    error: null,
    startTime: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = useCallback(() => {
    setState({
      isLoading: true,
      error: null,
      startTime: Date.now(),
    });
  }, []);

  const stopLoading = useCallback(() => {
    setState(prev => {
      if (prev.startTime && options.logOperation) {
        const duration = Date.now() - prev.startTime;
        logPerformance(options.logOperation, duration);
      }

      return {
        isLoading: false,
        error: null,
        startTime: null,
      };
    });

    if (options.onSuccess) {
      options.onSuccess();
    }
  }, [options]);

  const setError = useCallback(
    (error: string | Error) => {
      const errorMessage = error instanceof Error ? error.message : error;

      setState(prev => {
        if (prev.startTime && options.logOperation) {
          const duration = Date.now() - prev.startTime;
          logPerformance(`${options.logOperation}-error`, duration);
        }

        return {
          isLoading: false,
          error: errorMessage,
          startTime: null,
        };
      });

      if (options.onError && error instanceof Error) {
        options.onError(error);
      }
    },
    [options]
  );

  const withLoading = useCallback(
    async <T>(asyncOperation: () => Promise<T>, minDuration = 0): Promise<T> => {
      startLoading();

      try {
        const operationPromise = asyncOperation();

        // Ensure minimum loading duration for better UX
        if (minDuration > 0) {
          const [result] = await Promise.all([
            operationPromise,
            new Promise(resolve => {
              timeoutRef.current = setTimeout(resolve, minDuration);
            }),
          ]);
          return result;
        }

        const result = await operationPromise;
        stopLoading();
        return result;
      } catch (error) {
        setError(error as Error);
        throw error;
      }
    },
    [startLoading, stopLoading, setError]
  );

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState({
      isLoading: false,
      error: null,
      startTime: null,
    });
  }, []);

  return {
    ...state,
    startLoading,
    stopLoading,
    setError,
    withLoading,
    reset,
    // Computed properties
    hasError: !!state.error,
    duration: state.startTime ? Date.now() - state.startTime : 0,
  };
}

// Multiple loading states manager
export function useMultipleLoading<T extends string>(
  keys: readonly T[],
  options: UseLoadingOptions = {}
) {
  const [states, setStates] = useState<Record<T, LoadingState>>(
    () =>
      Object.fromEntries(
        keys.map(key => [key, { isLoading: false, error: null, startTime: null }])
      ) as Record<T, LoadingState>
  );

  const startLoading = useCallback((key: T) => {
    setStates(prev => ({
      ...prev,
      [key]: {
        isLoading: true,
        error: null,
        startTime: Date.now(),
      },
    }));
  }, []);

  const stopLoading = useCallback(
    (key: T) => {
      setStates(prev => {
        const current = prev[key];
        if (current.startTime && options.logOperation) {
          const duration = Date.now() - current.startTime;
          logPerformance(`${options.logOperation}-${key}`, duration);
        }

        return {
          ...prev,
          [key]: {
            isLoading: false,
            error: null,
            startTime: null,
          },
        };
      });

      if (options.onSuccess) {
        options.onSuccess();
      }
    },
    [options]
  );

  const setError = useCallback(
    (key: T, error: string | Error) => {
      const errorMessage = error instanceof Error ? error.message : error;

      setStates(prev => {
        const current = prev[key];
        if (current.startTime && options.logOperation) {
          const duration = Date.now() - current.startTime;
          logPerformance(`${options.logOperation}-${key}-error`, duration);
        }

        return {
          ...prev,
          [key]: {
            isLoading: false,
            error: errorMessage,
            startTime: null,
          },
        };
      });

      if (options.onError && error instanceof Error) {
        options.onError(error);
      }
    },
    [options]
  );

  const withLoading = useCallback(
    async <R>(key: T, asyncOperation: () => Promise<R>, minDuration = 0): Promise<R> => {
      startLoading(key);

      try {
        const operationPromise = asyncOperation();

        if (minDuration > 0) {
          const [result] = await Promise.all([
            operationPromise,
            new Promise(resolve => setTimeout(resolve, minDuration)),
          ]);
          stopLoading(key);
          return result;
        }

        const result = await operationPromise;
        stopLoading(key);
        return result;
      } catch (error) {
        setError(key, error as Error);
        throw error;
      }
    },
    [startLoading, stopLoading, setError]
  );

  const isAnyLoading = (Object.values(states) as LoadingState[]).some(state => state.isLoading);
  const hasAnyError = (Object.values(states) as LoadingState[]).some(state => state.error);

  return {
    states,
    startLoading,
    stopLoading,
    setError,
    withLoading,
    isAnyLoading,
    hasAnyError,
    getState: (key: T) => states[key],
    isLoading: (key: T) => states[key]?.isLoading ?? false,
    getError: (key: T) => states[key]?.error ?? null,
  };
}
