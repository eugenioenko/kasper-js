export type ErrorPhase = 'render' | 'watcher';

export type ErrorHandlerFn = (
  error: Error,
  context: { component?: any; phase: ErrorPhase }
) => void;

let globalHandler: ErrorHandlerFn | null = null;

export function setErrorHandler(handler: ErrorHandlerFn | undefined): void {
  globalHandler = handler ?? null;
}

export function handleError(error: unknown, phase: ErrorPhase, component?: any): void {
  const err = error instanceof Error ? error : new Error(String(error));

  // Try component-level onError first
  if (component && typeof component.onError === 'function') {
    try {
      component.onError(err, phase);
      return;
    } catch (e) {
      // onError itself threw — fall through with original error
    }
  }

  // Try global handler
  if (globalHandler) {
    try {
      globalHandler(err, { component, phase });
      return;
    } catch (_) {}
  }

  // Final fallback
  console.error(`[Kasper] Error during ${phase}:`, err);
}
