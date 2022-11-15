import { PromiseResolver } from "@yume-chan/async";
import { decodeUtf8 } from "../utils/index.js";
import { BufferedStream, BufferedStreamEndedError } from "./buffered.js";
import { AbortController, ReadableStream, TransformStream, WritableStream } from "./detect.js";
/**
 * A factory for creating a duplex stream.
 *
 * It can create multiple `ReadableStream`s and `WritableStream`s,
 * when any of them is closed, all other streams will be closed as well.
 */
export class DuplexStreamFactory {
    readableControllers = [];
    writers = [];
    _writableClosed = false;
    get writableClosed() { return this._writableClosed; }
    _closed = new PromiseResolver();
    get closed() { return this._closed.promise; }
    options;
    constructor(options) {
        this.options = options ?? {};
    }
    wrapReadable(readable) {
        return new WrapReadableStream({
            start: (controller) => {
                this.readableControllers.push(controller);
                return readable;
            },
            cancel: async () => {
                // cancel means the local peer closes the connection first.
                await this.close();
            },
            close: async () => {
                // stream end means the remote peer closed the connection first.
                await this.dispose();
            },
        });
    }
    createWritable(stream) {
        const writer = stream.getWriter();
        this.writers.push(writer);
        // `WritableStream` has no way to tell if the remote peer has closed the connection.
        // So it only triggers `close`.
        return new WritableStream({
            write: async (chunk) => {
                await writer.ready;
                await writer.write(chunk);
            },
            abort: async (reason) => {
                await writer.abort(reason);
                await this.close();
            },
            close: async () => {
                try {
                    await writer.close();
                }
                catch { }
                await this.close();
            },
        });
    }
    async close() {
        if (this._writableClosed) {
            return;
        }
        this._writableClosed = true;
        // Call `close` first, so it can still write data to `WritableStream`s.
        if (await this.options.close?.() !== false) {
            // `close` can return `false` to disable automatic `dispose`.
            await this.dispose();
        }
        for (const writer of this.writers) {
            try {
                await writer.close();
            }
            catch { }
        }
    }
    async dispose() {
        this._writableClosed = true;
        this._closed.resolve();
        for (const controller of this.readableControllers) {
            try {
                controller.close();
            }
            catch { }
        }
        await this.options.dispose?.();
    }
}
export class DecodeUtf8Stream extends TransformStream {
    constructor() {
        super({
            transform(chunk, controller) {
                controller.enqueue(decodeUtf8(chunk));
            },
        });
    }
}
export class GatherStringStream extends WritableStream {
    // Optimization: rope (concat strings) is faster than `[].join('')`
    _result = '';
    get result() { return this._result; }
    constructor() {
        super({
            write: (chunk) => {
                this._result += chunk;
            },
        });
    }
}
// TODO: StructTransformStream: Looking for better implementation
export class StructDeserializeStream {
    _readable;
    get readable() { return this._readable; }
    _writable;
    get writable() { return this._writable; }
    constructor(struct) {
        // Convert incoming chunks to a `BufferedStream`
        let incomingStreamController;
        const incomingStream = new BufferedStream(new PushReadableStream(controller => incomingStreamController = controller));
        this._readable = new ReadableStream({
            async pull(controller) {
                try {
                    const value = await struct.deserialize(incomingStream);
                    controller.enqueue(value);
                }
                catch (e) {
                    if (e instanceof BufferedStreamEndedError) {
                        controller.close();
                        return;
                    }
                    throw e;
                }
            }
        });
        this._writable = new WritableStream({
            async write(chunk) {
                await incomingStreamController.enqueue(chunk);
            },
            abort() {
                incomingStreamController.close();
            },
            close() {
                incomingStreamController.close();
            },
        });
    }
}
export class StructSerializeStream extends TransformStream {
    constructor(struct) {
        super({
            transform(chunk, controller) {
                controller.enqueue(struct.serialize(chunk));
            },
        });
    }
}
async function getWrappedWritableStream(wrapper) {
    if ('start' in wrapper) {
        return await wrapper.start();
    }
    else if (typeof wrapper === 'function') {
        return await wrapper();
    }
    else {
        // Can't use `wrapper instanceof WritableStream`
        // Because we want to be compatible with any WritableStream-like objects
        return wrapper;
    }
}
export class WrapWritableStream extends WritableStream {
    writable;
    writer;
    constructor(wrapper) {
        super({
            start: async () => {
                // `start` is invoked before `ReadableStream`'s constructor finish,
                // so using `this` synchronously causes
                // "Must call super constructor in derived class before accessing 'this' or returning from derived constructor".
                // Queue a microtask to avoid this.
                await Promise.resolve();
                this.writable = await getWrappedWritableStream(wrapper);
                this.writer = this.writable.getWriter();
            },
            write: async (chunk) => {
                // Maintain back pressure
                await this.writer.ready;
                await this.writer.write(chunk);
            },
            abort: async (reason) => {
                await this.writer.abort(reason);
                if ('close' in wrapper) {
                    await wrapper.close?.();
                }
            },
            close: async () => {
                // Close the inner stream first.
                // Usually the inner stream is a logical sub-stream over the outer stream,
                // closing the outer stream first will make the inner stream incapable of
                // sending data in its `close` handler.
                await this.writer.close();
                if ('close' in wrapper) {
                    await wrapper.close?.();
                }
            },
        });
    }
}
function getWrappedReadableStream(wrapper, controller) {
    if ('start' in wrapper) {
        return wrapper.start(controller);
    }
    else if (typeof wrapper === 'function') {
        return wrapper(controller);
    }
    else {
        // Can't use `wrapper instanceof ReadableStream`
        // Because we want to be compatible with any ReadableStream-like objects
        return wrapper;
    }
}
/**
 * This class has multiple usages:
 *
 * 1. Get notified when the stream is cancelled or closed.
 * 2. Synchronously create a `ReadableStream` by asynchronously return another `ReadableStream`.
 * 3. Convert native `ReadableStream`s to polyfilled ones so they can `pipe` between.
 */
export class WrapReadableStream extends ReadableStream {
    readable;
    reader;
    constructor(wrapper) {
        super({
            start: async (controller) => {
                // `start` is invoked before `ReadableStream`'s constructor finish,
                // so using `this` synchronously causes
                // "Must call super constructor in derived class before accessing 'this' or returning from derived constructor".
                // Queue a microtask to avoid this.
                await Promise.resolve();
                this.readable = await getWrappedReadableStream(wrapper, controller);
                this.reader = this.readable.getReader();
            },
            cancel: async (reason) => {
                await this.reader.cancel(reason);
                if ('cancel' in wrapper) {
                    await wrapper.cancel?.(reason);
                }
            },
            pull: async (controller) => {
                const result = await this.reader.read();
                if (result.done) {
                    controller.close();
                    if ('close' in wrapper) {
                        await wrapper.close?.();
                    }
                }
                else {
                    controller.enqueue(result.value);
                }
            }
        });
    }
}
export class ChunkStream extends TransformStream {
    constructor(size) {
        super({
            transform(chunk, controller) {
                for (let start = 0; start < chunk.byteLength;) {
                    const end = start + size;
                    controller.enqueue(chunk.subarray(start, end));
                    start = end;
                }
            }
        });
    }
}
function* splitLines(text) {
    let start = 0;
    while (true) {
        const index = text.indexOf('\n', start);
        if (index === -1) {
            return;
        }
        const line = text.substring(start, index);
        yield line;
        start = index + 1;
    }
}
export class SplitLineStream extends TransformStream {
    constructor() {
        super({
            transform(chunk, controller) {
                for (const line of splitLines(chunk)) {
                    controller.enqueue(line);
                }
            }
        });
    }
}
/**
 * Create a new `WritableStream` that, when written to, will write that chunk to
 * `pair.writable`, when pipe `pair.readable` to `writable`.
 *
 * It's the opposite of `ReadableStream.pipeThrough`.
 *
 * @param writable The `WritableStream` to write to.
 * @param pair A `TransformStream` that converts chunks.
 * @returns A new `WritableStream`.
 */
export function pipeFrom(writable, pair) {
    const writer = pair.writable.getWriter();
    const pipe = pair.readable
        .pipeTo(writable);
    return new WritableStream({
        async write(chunk) {
            await writer.ready;
            await writer.write(chunk);
        },
        async close() {
            await writer.close();
            await pipe;
        }
    });
}
export class InspectStream extends TransformStream {
    constructor(callback) {
        super({
            transform(chunk, controller) {
                callback(chunk);
                controller.enqueue(chunk);
            }
        });
    }
}
export class PushReadableStream extends ReadableStream {
    constructor(source, strategy) {
        let waterMarkLow;
        const canceled = new AbortController();
        super({
            start: (controller) => {
                source({
                    abortSignal: canceled.signal,
                    async enqueue(chunk) {
                        if (canceled.signal.aborted) {
                            // If the stream is already cancelled,
                            // throw immediately.
                            throw canceled.signal.reason ?? new Error('Aborted');
                        }
                        // Only when the stream is errored, `desiredSize` will be `null`.
                        // But since `null <= 0` is `true`
                        // (`null <= 0` is evaluated as `!(null > 0)` => `!false` => `true`),
                        // not handling it will cause a deadlock.
                        if ((controller.desiredSize ?? 1) <= 0) {
                            waterMarkLow = new PromiseResolver();
                            await waterMarkLow.promise;
                        }
                        // `controller.enqueue` will throw error for us
                        // if the stream is already errored.
                        controller.enqueue(chunk);
                    },
                    close() {
                        controller.close();
                    },
                    error(e) {
                        controller.error(e);
                    },
                });
            },
            pull: () => {
                waterMarkLow?.resolve();
            },
            cancel: async (reason) => {
                canceled.abort(reason);
                waterMarkLow?.reject(reason);
            },
        }, strategy);
    }
}
//# sourceMappingURL=transform.js.map