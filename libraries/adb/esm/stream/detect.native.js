// cspell: ignore chainable
// cspell: ignore backpressure
// cspell: ignore endregion
export let AbortController;
export let AbortSignal;
({ AbortController, AbortSignal } = globalThis);
export let ReadableStream;
export let ReadableStreamDefaultController;
export let ReadableStreamDefaultReader;
export let TransformStream;
export let TransformStreamDefaultController;
export let WritableStream;
export let WritableStreamDefaultController;
export let WritableStreamDefaultWriter;
// This library can't use `@types/node` or `lib: dom`
// because they will pollute the global scope
// So `ReadableStream`, `WritableStream` and `TransformStream` are not available
if ('ReadableStream' in globalThis && 'WritableStream' in globalThis && 'TransformStream' in globalThis) {
    ({
        ReadableStream,
        ReadableStreamDefaultController,
        ReadableStreamDefaultReader,
        TransformStream,
        TransformStreamDefaultController,
        WritableStream,
        WritableStreamDefaultController,
        WritableStreamDefaultWriter,
    } = globalThis);
}
else {
    try {
        // // Node.js 16 has Web Streams types in `stream/web` module
        ({
            // @ts-ignore
            ReadableStream,
            // @ts-ignore
            ReadableStreamDefaultController,
            // @ts-ignore
            ReadableStreamDefaultReader,
            // @ts-ignore
            TransformStream,
            // @ts-ignore
            TransformStreamDefaultController,
            // @ts-ignore
            WritableStream,
            // @ts-ignore
            WritableStreamDefaultController,
            // @ts-ignore
            WritableStreamDefaultWriter,
            // @ts-ignore
        } = await import(/* webpackIgnore: true */ 'stream/web'));
    }
    catch { }
}
// TODO: stream/detect: Load some polyfills
// @ts-ignore
if (!ReadableStream || !WritableStream || !TransformStream) {
    // throw new Error('Web Streams API is not available');
}
//# sourceMappingURL=detect.native.js.map