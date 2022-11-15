import { AutoDisposable } from '@yume-chan/event';
import { AdbFeatures } from '../../features.js';
import { AdbBufferedStream, WrapReadableStream, WrapWritableStream } from '../../stream/index.js';
import { AutoResetEvent } from '../../utils/index.js';
import { escapeArg } from "../index.js";
import { adbSyncOpenDir } from './list.js';
import { adbSyncPull } from './pull.js';
import { adbSyncPush } from './push.js';
import { adbSyncLstat, adbSyncStat } from './stat.js';
/**
 * A simplified `dirname` function that only handles absolute unix paths.
 * @param path an absolute unix path
 * @returns the directory name of the input path
 */
export function dirname(path) {
    const end = path.lastIndexOf('/');
    if (end === -1) {
        throw new Error(`Invalid path`);
    }
    if (end === 0) {
        return '/';
    }
    return path.substring(0, end);
}
export class AdbSync extends AutoDisposable {
    adb;
    stream;
    writer;
    sendLock = this.addDisposable(new AutoResetEvent());
    get supportsStat() {
        return this.adb.features.includes(AdbFeatures.StatV2);
    }
    get supportsList2() {
        return this.adb.features.includes(AdbFeatures.ListV2);
    }
    get fixedPushMkdir() {
        return this.adb.features.includes(AdbFeatures.FixedPushMkdir);
    }
    get needPushMkdirWorkaround() {
        // https://android.googlesource.com/platform/packages/modules/adb/+/91768a57b7138166e0a3d11f79cd55909dda7014/client/file_sync_client.cpp#1361
        return this.adb.features.includes(AdbFeatures.ShellV2) && !this.fixedPushMkdir;
    }
    constructor(adb, socket) {
        super();
        this.adb = adb;
        this.stream = new AdbBufferedStream(socket);
        this.writer = socket.writable.getWriter();
    }
    async lstat(path) {
        await this.sendLock.wait();
        try {
            return adbSyncLstat(this.stream, this.writer, path, this.supportsStat);
        }
        finally {
            this.sendLock.notify();
        }
    }
    async stat(path) {
        if (!this.supportsStat) {
            throw new Error('Not supported');
        }
        await this.sendLock.wait();
        try {
            return adbSyncStat(this.stream, this.writer, path);
        }
        finally {
            this.sendLock.notify();
        }
    }
    async isDirectory(path) {
        try {
            await this.lstat(path + '/');
            return true;
        }
        catch (e) {
            return false;
        }
    }
    async *opendir(path) {
        await this.sendLock.wait();
        try {
            yield* adbSyncOpenDir(this.stream, this.writer, path, this.supportsList2);
        }
        finally {
            this.sendLock.notify();
        }
    }
    async readdir(path) {
        const results = [];
        for await (const entry of this.opendir(path)) {
            results.push(entry);
        }
        return results;
    }
    /**
     * Read the content of a file on device.
     *
     * @param filename The full path of the file on device to read.
     * @returns A `ReadableStream` that reads from the file.
     */
    read(filename) {
        return new WrapReadableStream({
            start: async () => {
                await this.sendLock.wait();
                return adbSyncPull(this.stream, this.writer, filename);
            },
            close: async () => {
                this.sendLock.notify();
            },
        });
    }
    /**
     * Write (or overwrite) a file on device.
     *
     * @param filename The full path of the file on device to write.
     * @param mode The unix permissions of the file.
     * @param mtime The modified time of the file.
     * @returns A `WritableStream` that writes to the file.
     */
    write(filename, mode, mtime) {
        return new WrapWritableStream({
            start: async () => {
                await this.sendLock.wait();
                if (this.needPushMkdirWorkaround) {
                    // It may fail if the path is already existed.
                    // Ignore the result.
                    // TODO: sync: test this
                    await this.adb.subprocess.spawnAndWait([
                        'mkdir',
                        '-p',
                        escapeArg(dirname(filename)),
                    ]);
                }
                return adbSyncPush(this.stream, this.writer, filename, mode, mtime);
            },
            close: async () => {
                this.sendLock.notify();
            }
        });
    }
    async dispose() {
        super.dispose();
        await this.stream.close();
        await this.writer.close();
    }
}
//# sourceMappingURL=sync.js.map