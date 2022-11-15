import { PromiseResolver } from '@yume-chan/async';
export class AutoResetEvent {
    list = [];
    blocking;
    constructor(initialSet = false) {
        this.blocking = initialSet;
    }
    wait() {
        if (!this.blocking) {
            this.blocking = true;
            if (this.list.length === 0) {
                return Promise.resolve();
            }
        }
        const resolver = new PromiseResolver();
        this.list.push(resolver);
        return resolver.promise;
    }
    notify() {
        if (this.list.length !== 0) {
            this.list.pop().resolve();
        }
        else {
            this.blocking = false;
        }
    }
    dispose() {
        for (const item of this.list) {
            item.reject(new Error('The AutoResetEvent has been disposed'));
        }
        this.list.length = 0;
    }
}
//# sourceMappingURL=auto-reset-event.js.map