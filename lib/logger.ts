// Production-ready logging utility for Pokemon Palette app

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isClient = typeof window !== 'undefined';

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      stack: level === 'error' ? new Error().stack : undefined,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (!this.isDevelopment) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  private logToConsole(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const { level, message, context, timestamp } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        // console.debug(prefix, message, context || '');
        break;
      case 'info':
        // console.info(prefix, message, context || '');
        break;
      case 'warn':
        console.warn(prefix, message, context || '');
        break;
      case 'error':
        console.error(prefix, message, context || '');
        if (entry.stack) console.error('Stack:', entry.stack);
        break;
    }
  }

  private logToService(entry: LogEntry): void {
    // In production, you might want to send logs to a service like Sentry, LogRocket, etc.
    if (
      !this.isDevelopment &&
      this.isClient &&
      (entry.level === 'warn' || entry.level === 'error')
    ) {
      // Example: Send to external logging service
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // }).catch(() => {
      //   // Silently fail - don't want logging to break the app
      // });
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatMessage('debug', message, context);
    this.logToConsole(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatMessage('info', message, context);
    this.logToConsole(entry);
    this.logToService(entry);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.formatMessage('warn', message, context);
    this.logToConsole(entry);
    this.logToService(entry);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    const entry = this.formatMessage('error', message, {
      ...context,
      error:
        error instanceof Error
          ? {
              message: error.message,
              name: error.name,
              stack: error.stack,
            }
          : error,
    });
    this.logToConsole(entry);
    this.logToService(entry);
  }

  // Pokemon-specific logging methods
  pokemonFetch(pokemonName: string, success: boolean, error?: Error): void {
    if (success) {
      this.debug('Pokemon data fetched successfully', { pokemonName });
    } else {
      this.error('Failed to fetch Pokemon data', error, { pokemonName });
    }
  }

  colorExtraction(spriteUrl: string, success: boolean, colors?: string[], error?: Error): void {
    if (success) {
      this.debug('Color extraction completed', { spriteUrl, colorsCount: colors?.length });
    } else {
      this.error('Color extraction failed', error, { spriteUrl });
    }
  }

  apiCall(
    endpoint: string,
    method: string,
    success: boolean,
    responseTime?: number,
    error?: Error
  ): void {
    const context = { endpoint, method, responseTime };

    if (success) {
      this.debug('API call successful', context);
    } else {
      this.error('API call failed', error, context);
    }
  }

  userAction(action: string, context?: Record<string, unknown>): void {
    this.info(`User action: ${action}`, context);
  }

  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.debug(`Performance: ${metric}`, { value, unit });
  }
}

// Create a singleton instance
export const logger = new Logger();

// Convenience exports for common use cases
export const logPokemonFetch = logger.pokemonFetch.bind(logger);
export const logColorExtraction = logger.colorExtraction.bind(logger);
export const logApiCall = logger.apiCall.bind(logger);
export const logUserAction = logger.userAction.bind(logger);
export const logPerformance = logger.performance.bind(logger);

// Default export
export default logger;
