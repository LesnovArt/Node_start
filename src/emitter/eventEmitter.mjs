export class EventEmitter {
  listeners = {};

  addListener(eventName, fn) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(fn);
  }

  on(eventName, fn) {
    this.addListener(eventName, fn);
  }

  removeListener(eventName, fn) {
    const listener = this.listeners[eventName];

    if (!listener) return;

    const listenerIndex = listener.indexOf(fn);

    if (listenerIndex === -1) return;

    listener.splice(listenerIndex, 1);
  }

  removeAllListener() {
    this.listeners = {};
  }

  off(eventName, fn) {
    this.removeListener(eventName, fn);
  }

  once(eventName, fn) {
    const executeOnce = (...args) => {
      fn(...args);
      this.removeListener(eventName, executeOnce);
    };

    this.addListener(eventName, executeOnce);
  }

  emit(eventName, ...args) {
    const listener = this.listeners[eventName];

    if (!listener) return;

    listener.forEach((fn) => fn(...args));
  }

  listenerCount(eventName) {
    return this.listeners[eventName]?.length ?? 0;
  }

  rawListeners(eventName) {
    return this.listeners[eventName] ?? [];
  }
}
