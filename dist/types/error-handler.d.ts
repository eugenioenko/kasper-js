export type ErrorPhase = 'render' | 'watcher';
export type ErrorHandlerFn = (error: Error, context: {
    component?: any;
    phase: ErrorPhase;
}) => void;
export declare function setErrorHandler(handler: ErrorHandlerFn | undefined): void;
export declare function handleError(error: unknown, phase: ErrorPhase, component?: any): void;
