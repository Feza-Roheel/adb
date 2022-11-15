import { AdbCredentialStore } from "@yume-chan/adb";
export default class AdbWebCredentialStore implements AdbCredentialStore {
    readonly localStorageKey: string;
    constructor(localStorageKey?: string);
    iterateKeys(): Generator<Uint8Array, void, void>;
    generateKey(): Promise<Uint8Array>;
}
//# sourceMappingURL=index.d.ts.map