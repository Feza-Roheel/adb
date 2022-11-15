import Struct from "@yume-chan/struct";
import { StructValueType, ValueOrPromise } from "@yume-chan/struct";
import { AbortSignal, ReadableStream, TransformStream, WritableStream, QueuingStrategy, ReadableStreamDefaultController, ReadableWritablePair } from "./detect.js";
export interface DuplexStreamFactoryOptions {
    /**
     * Callback when any `ReadableStream` is cancelled (the user doesn't need any more data),
     * or `WritableStream` is ended (the user won't produce any more data),
     * or `DuplexStreamFactory#close` is called.
     *
     * Usually you want to let the other peer know that the duplex stream should be clsoed.
     *
     * `dispose` will automatically be called after `close` completes,
     * but if you want to wait another peer for a close confirmation and call
     * `DuplexStreamFactory#dispose` yourself, you can return `false`
     * (or a `Promise` that resolves to `false`) to disable the automatic call.
     */
    close?: (() => ValueOrPromise<boolean | void>) | undefined;
    /**
     * Callback when any `ReadableStream` is closed (the other peer doesn't produce any more data),
     * or `WritableStream` is aborted (the other peer can't receive any more data),
     * or `DuplexStreamFactory#abort` is called.
     *
     * Usually indicates the other peer has closed the duplex stream. You can clean up
     * any resources you have allocated now.
     */
    dispose?: (() => void | Promise<void>) | undefined;
}
/**
 * A factory for creating a duplex stream.
 *
 * It can create multiple `ReadableStream`s and `WritableStream`s,
 * when any of them is closed, all other streams will be closed as well.
 */
export declare class DuplexStreamFactory<R, W> {
    private readableControllers;
    private writers;
    private _writableClosed;
    get writableClosed(): boolean;
    private _closed;
    get closed(): Promise<void>;
    private options;
    constructor(options?: DuplexStreamFactoryOptions);
    wrapReadable(readable: ReadableStream<R>): WrapReadableStream<R>;
    createWritable(stream: WritableStream<W>): WritableStream<W>;
    close(): Promise<void>;
    dispose(): Promise<void>;
}
export declare class DecodeUtf8Stream extends TransformStream<Uint8Array, string> {
    constructor();
}
export declare class GatherStringStream extends WritableStream<string> {
    private _result;
    get result(): string;
    constructor();
}
export declare class StructDeserializeStream<T extends Struct<any, any, any, any>> implements ReadableWritablePair<Uint8Array, StructValueType<T>> {
    private _readable;
    get readable(): ReadableStream<Awaited<ReturnType<T["deserialize"]>>>;
    private _writable;
    get writable(): WritableStream<Uint8Array>;
    constructor(struct: T);
}
export declare class StructSerializeStream<T extends Struct<any, any, any, any>> extends TransformStream<T['TInit'], Uint8Array> {
    constructor(struct: T);
}
export declare type WrapWritableStreamStart<T> = () => ValueOrPromise<WritableStream<T>>;
export interface WritableStreamWrapper<T> {
    start: WrapWritableStreamStart<T>;
    close?(): Promise<void>;
}
export declare class WrapWritableStream<T> extends WritableStream<T> {
    writable: WritableStream<T>;
    private writer;
    constructor(wrapper: WritableStream<T> | WrapWritableStreamStart<T> | WritableStreamWrapper<T>);
}
export declare type WrapReadableStreamStart<T> = (controller: ReadableStreamDefaultController<T>) => ValueOrPromise<ReadableStream<T>>;
export interface ReadableStreamWrapper<T> {
    start: WrapReadableStreamStart<T>;
    cancel?(reason?: any): ValueOrPromise<void>;
    close?(): ValueOrPromise<void>;
}
/**
 * This class has multiple usages:
 *
 * 1. Get notified when the stream is cancelled or closed.
 * 2. Synchronously create a `ReadableStream` by asynchronously return another `ReadableStream`.
 * 3. Convert native `ReadableStream`s to polyfilled ones so they can `pipe` between.
 */
export declare class WrapReadableStream<T> extends ReadableStream<T> {
    readable: ReadableStream<T>;
    private reader;
    constructor(wrapper: ReadableStream<T> | WrapReadableStreamStart<T> | ReadableStreamWrapper<T>);
}
export declare class ChunkStream extends TransformStream<Uint8Array, Uint8Array> {
    constructor(size: number);
}
export declare class SplitLineStream extends TransformStream<string, string> {
    constructor();
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
export declare function pipeFrom<W, T>(writable: WritableStream<W>, pair: ReadableWritablePair<W, T>): WritableStream<T>;
export declare class InspectStream<T> extends TransformStream<T, T> {
    constructor(callback: (value: T) => void);
}
export interface PushReadableStreamController<T> {
    abortSignal: AbortSignal;
    enqueue(chunk: T): Promise<void>;
    close(): void;
    error(e?: any): void;
}
export declare type PushReadableStreamSource<T> = (controller: PushReadableStreamController<T>) => void;
export declare class PushReadableStream<T> extends ReadableStream<T> {
    constructor(source: PushReadableStreamSource<T>, strategy?: QueuingStrategy<T>);
}
//# sourceMappingURL=transform.d.ts.map