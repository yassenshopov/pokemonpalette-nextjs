'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
// Using div for alerts instead
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error
    logger.error(error.message, error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
      retryCount: this.state.retryCount,
    });

    this.setState({
      errorInfo,
    });

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                We apologize for the inconvenience. An unexpected error occurred.
              </p>

              {this.props.showDetails && this.state.error && (
                <div className="border border-destructive/20 bg-destructive/5 rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Bug className="h-4 w-4" />
                    <span className="text-sm font-medium">Error Details</span>
                  </div>
                  <div className="font-mono text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                    {this.state.error.message}
                    {this.state.errorInfo?.componentStack && (
                      <details className="mt-2">
                        <summary className="cursor-pointer">Component Stack</summary>
                        <pre className="text-xs mt-1 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {this.state.retryCount < this.maxRetries && (
                  <Button onClick={this.handleRetry} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Try Again ({this.maxRetries - this.state.retryCount} attempts left)
                  </Button>
                )}

                <Button variant="outline" onClick={this.handleReset} className="gap-2">
                  <Home className="w-4 h-4" />
                  Reset Component
                </Button>

                <Button variant="ghost" onClick={() => window.location.reload()} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </Button>
              </div>

              {this.state.retryCount >= this.maxRetries && (
                <div className="border border-destructive/20 bg-destructive/5 rounded p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">
                      Maximum retry attempts reached. Please reload the page or contact support if
                      the issue persists.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Functional error boundary hook for modern React
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Pokemon-specific error components
export function PokemonNotFoundError({
  pokemon,
  onRetry,
}: {
  pokemon: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="text-center py-8">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold mb-2">Pokemon Not Found</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't find a Pokemon named "{pokemon}". Please check the spelling and try again.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="text-center py-8">
        <div className="text-6xl mb-4">📡</div>
        <h3 className="text-lg font-semibold mb-2">Connection Problem</h3>
        <p className="text-muted-foreground mb-4">
          Unable to connect to Pokemon data. Please check your internet connection and try again.
        </p>
        {onRetry && (
          <Button onClick={onRetry} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function APIError({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <Card className="w-full max-w-md mx-auto border-destructive">
      <CardContent className="text-center py-8">
        <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">API Error</h3>
        <p className="text-muted-foreground mb-4 text-sm">{error}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
