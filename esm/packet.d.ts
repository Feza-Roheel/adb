import Struct from '@yume-chan/struct';
import { TransformStream } from "./stream/index.js";
export declare enum AdbCommand {
    Auth = 1213486401,
    Close = 1163086915,
    Connect = 1314410051,
    OK = 1497451343,
    Open = 1313165391,
    Write = 1163154007
}
export declare const AdbPacketHeader: Struct<{
    command: number;
    arg0: number;
    arg1: number;
    payloadLength: number;
    checksum: number;
    magic: number;
}, never, {}, undefined>;
export declare type AdbPacketHeader = typeof AdbPacketHeader['TDeserializeResult'];
export declare const AdbPacket: Struct<{
    command: number;
    arg0: number;
    arg1: number;
    payloadLength: number;
    checksum: number;
    magic: number;
    payload: Uint8Array;
}, "payloadLength", {}, undefined>;
export declare type AdbPacket = typeof AdbPacket['TDeserializeResult'];
/**
 * `AdbPacketData` contains all the useful fields of `AdbPacket`.
 *
 * `AdbBackend#connect` will return a `ReadableStream<AdbPacketData>`,
 * so each backend can encode `AdbPacket` in different ways.
 *
 * `AdbBackend#connect` will return a `WritableStream<AdbPacketInit>`,
 * however, `AdbPacketDispatcher` will transform `AdbPacketData` to `AdbPacketInit` for you,
 * so `AdbSocket#writable#write` only needs `AdbPacketData`.
 */
export declare type AdbPacketData = Omit<typeof AdbPacket['TInit'], 'checksum' | 'magic'>;
export declare type AdbPacketInit = Omit<typeof AdbPacket['TInit'], 'magic'>;
export declare function calculateChecksum(payload: Uint8Array): number;
export declare function calculateChecksum(init: AdbPacketData): AdbPacketInit;
export declare class AdbPacketSerializeStream extends TransformStream<AdbPacketInit, Uint8Array> {
    constructor();
}
//# sourceMappingURL=packet.d.ts.map