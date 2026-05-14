// centralized error logging for production monitoring
// replace console.error/warn with these to prepare for Sentry integration

interface ErrorContext {
  screen?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

export function logError(error: Error | string, context?: ErrorContext) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;
  
  // development: log to console
  console.error('[ERROR]', errorMessage, context);
  if (errorStack) console.error(errorStack);
  
  // production: send to monitoring service (Sentry, Bugsnag, etc.)
  // if (__DEV__ === false) {
  //   Sentry.captureException(error, { contexts: { custom: context } });
  // }
}

export function logWarning(message: string, context?: ErrorContext) {
  console.warn('[WARN]', message, context);
  
  // production: send non-critical issues to monitoring
  // if (__DEV__ === false) {
  //   Sentry.captureMessage(message, { level: 'warning', contexts: { custom: context } });
  // }
}

export function logInfo(message: string, context?: ErrorContext) {
  console.log('[INFO]', message, context);
  
  // production: breadcrumbs for debugging
  // if (__DEV__ === false) {
  //   Sentry.addBreadcrumb({ message, data: context });
  // }
}
