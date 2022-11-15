import Struct from "@yume-chan/struct";
import { Adb } from '../adb.js';
export declare const AdbFrameBufferV1: Struct<{
    bpp: number;
    size: number;
    width: number;
    height: number;
    red_offset: number;
    red_length: number;
    blue_offset: number;
    blue_length: number;
    green_offset: number;
    green_length: number;
    alpha_offset: number;
    alpha_length: number;
    data: Uint8Array;
}, "size", {}, undefined>;
export declare type AdbFrameBufferV1 = typeof AdbFrameBufferV1['TDeserializeResult'];
export declare const AdbFrameBufferV2: Struct<{
    bpp: number;
    colorSpace: number;
    size: number;
    width: number;
    height: number;
    red_offset: number;
    red_length: number;
    blue_offset: number;
    blue_length: number;
    green_offset: number;
    green_length: number;
    alpha_offset: number;
    alpha_length: number;
    data: Uint8Array;
}, "size", {}, undefined>;
export declare type AdbFrameBufferV2 = typeof AdbFrameBufferV2['TDeserializeResult'];
export declare type AdbFrameBuffer = AdbFrameBufferV1 | AdbFrameBufferV2;
export declare function framebuffer(adb: Adb): Promise<AdbFrameBuffer>;
//# sourceMappingURL=framebuffer.d.ts.map