import { WrapWritableStream } from "../stream/index.js";
import { escapeArg } from "./subprocess/index.js";
export function install(adb) {
    const filename = `/data/local/tmp/${Math.random().toString().substring(2)}.apk`;
    let sync;
    return new WrapWritableStream({
        async start() {
            // TODO: install: support other install apk methods (streaming, etc.)
            // Upload apk file to tmp folder
            sync = await adb.sync();
            return sync.write(filename, undefined, undefined);
        },
        async close() {
            sync.dispose();
            // Invoke `pm install` to install it
            await adb.subprocess.spawnAndWaitLegacy(['pm', 'install', escapeArg(filename)]);
            // Remove the temp file
            await adb.rm(filename);
        }
    });
}
//# sourceMappingURL=install.js.map