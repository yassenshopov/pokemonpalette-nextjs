import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { logger } from '@/lib/logger';

export interface ErrorState {
  error: Error | null;
  isError: boolean;
  errorType: 'network' | 'validation' | 'api' | 'unknown' | null;
  retryCount: number;
  lastErrorTime: number | null;
}

export interface ErrorHandlerOptions {
  maxRetries?: number;
  showToast?: boolean;
  logErrors?: boolean;
  onError?: (error: Error, errorType: string) => void;
  onRetry?: () => void;
  retryDelay?: number;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const {
    maxRetries = 3,
    showToast = true,
    logErrors = true,
    onError,
    onRetry,
    retryDelay = 1000,
  } = options;

  const { toast } = useToast();
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false,
    errorType: null,
    retryCount: 0,
    lastErrorTime: null,
  });

  const determineErrorType = useCallback((error: Error): ErrorState['errorType'] => {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return 'network';
    }
    if (error.message.includes('validation') || error.message.includes('invalid')) {
      return 'validation';
    }
    if (error.message.includes('API') || error.message.includes('HTTP')) {
      return 'api';
    }
    return 'unknown';
  }, []);

  const getErrorMessage = useCallback((error: Error, errorType: ErrorState['errorType']) => {
    switch (errorType) {
      case 'network':
        return 'Network error. Please check your connection and try again.';
      case 'validation':
        return 'Invalid input. Please check your data and try again.';
      case 'api':
        return 'Server error. Please try again in a moment.';
      case 'unknown':
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }, []);

  const handleError = useCallback(
    (error: Error, context: Record<string, any> = {}) => {
      const errorType = determineErrorType(error);
      const errorMessage = getErrorMessage(error, errorType);

      setErrorState(prev => ({
        error,
        isError: true,
        errorType,
        retryCount: prev.retryCount,
        lastErrorTime: Date.now(),
      }));

      // Log error
      if (logErrors) {
        logger.error(error.message, error, {
          errorType,
          retryCount: errorState.retryCount,
          context,
        });
      }

      // Show toast notification
      if (showToast) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }

      // Call custom error handler
      if (onError) {
        onError(error, errorType || 'unknown');
      }
    },
    [
      determineErrorType,
      getErrorMessage,
      logErrors,
      showToast,
      toast,
      onError,
      errorState.retryCount,
    ]
  );

  const retry = useCallback(
    async (retryFn?: () => Promise<void> | void) => {
      if (errorState.retryCount >= maxRetries) {
        toast({
          title: 'Maximum retries exceeded',
          description: 'Please refresh the page or contact support.',
          variant: 'destructive',
        });
        return;
      }

      setErrorState(prev => ({
        ...prev,
        retryCount: prev.retryCount + 1,
      }));

      // Add delay before retry
      if (retryDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }

      try {
        if (retryFn) {
          await retryFn();
        }
        clearError();

        if (onRetry) {
          onRetry();
        }
      } catch (error) {
        handleError(error as Error);
      }
    },
    [errorState.retryCount, maxRetries, retryDelay, onRetry, toast, handleError]
  );

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      errorType: null,
      retryCount: 0,
      lastErrorTime: null,
    });
  }, []);

  const reset = useCallback(() => {
    setErrorState({
      error: null,
      isError: false,
      errorType: null,
      retryCount: 0,
      lastErrorTime: null,
    });
  }, []);

  // Wrapper for async operations with error handling
  const withErrorHandling = useCallback(
    async <T>(
      operation: () => Promise<T>,
      context: Record<string, any> = {}
    ): Promise<T | null> => {
      try {
        const result = await operation();
        clearError();
        return result;
      } catch (error) {
        handleError(error as Error, context);
        return null;
      }
    },
    [handleError, clearError]
  );

  return {
    ...errorState,
    handleError,
    retry,
    clearError,
    reset,
    withErrorHandling,
    canRetry: errorState.retryCount < maxRetries,
    remainingRetries: Math.max(0, maxRetries - errorState.retryCount),
  };
}

// Pokemon-specific error handling
export function usePokemonErrorHandler() {
  return useErrorHandler({
    maxRetries: 3,
    showToast: true,
    retryDelay: 1500,
    onError: (error, errorType) => {
      // Pokemon-specific error logging or handling
      if (errorType === 'api' && error.message.includes('404')) {
        // Handle Pokemon not found specifically
        console.warn('Pokemon not found:', error.message);
      }
    },
  });
}

// Network-specific error handling
export function useNetworkErrorHandler() {
  return useErrorHandler({
    maxRetries: 5,
    retryDelay: 2000,
    showToast: true,
    onError: (error, errorType) => {
      if (errorType === 'network') {
        // Could trigger offline mode or cache fallback
        console.warn('Network error detected:', error.message);
      }
    },
  });
}
