import Struct from "@yume-chan/struct";
import { AdbBufferedStream } from '../stream/index.js';
const Version = new Struct({ littleEndian: true })
    .uint32('version');
/*
 * ADB uses 8 int32 fields to describe bit depths
 * The only combination I have seen is RGBA8888, which is
 *   red_offset:   0
 *   red_length:   8
 *   blue_offset:  16
 *   blue_length:  8
 *   green_offset: 8
 *   green_length: 8
 *   alpha_offset: 24
 *   alpha_length: 8
 */
export const AdbFrameBufferV1 = new Struct({ littleEndian: true })
    .uint32('bpp')
    .uint32('size')
    .uint32('width')
    .uint32('height')
    .uint32('red_offset')
    .uint32('red_length')
    .uint32('blue_offset')
    .uint32('blue_length')
    .uint32('green_offset')
    .uint32('green_length')
    .uint32('alpha_offset')
    .uint32('alpha_length')
    .uint8Array('data', { lengthField: 'size' });
export const AdbFrameBufferV2 = new Struct({ littleEndian: true })
    .uint32('bpp')
    .uint32('colorSpace')
    .uint32('size')
    .uint32('width')
    .uint32('height')
    .uint32('red_offset')
    .uint32('red_length')
    .uint32('blue_offset')
    .uint32('blue_length')
    .uint32('green_offset')
    .uint32('green_length')
    .uint32('alpha_offset')
    .uint32('alpha_length')
    .uint8Array('data', { lengthField: 'size' });
export async function framebuffer(adb) {
    const socket = await adb.createSocket('framebuffer:');
    const stream = new AdbBufferedStream(socket);
    const { version } = await Version.deserialize(stream);
    switch (version) {
        case 1:
            return AdbFrameBufferV1.deserialize(stream);
        case 2:
            return AdbFrameBufferV2.deserialize(stream);
        default:
            throw new Error('Unknown FrameBuffer version');
    }
}
//# sourceMappingURL=framebuffer.js.map