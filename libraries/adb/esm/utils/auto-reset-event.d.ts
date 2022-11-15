import { Disposable } from '@yume-chan/event';
export declare class AutoResetEvent implements Disposable {
    private readonly list;
    private blocking;
    constructor(initialSet?: boolean);
    wait(): Promise<void>;
    notify(): void;
    dispose(): void;
}
//# sourceMappingURL=auto-reset-event.d.ts.map