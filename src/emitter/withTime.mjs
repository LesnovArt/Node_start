import { EventEmitter } from "./eventEmitter.mjs";

export const EVENTS = {
  start: "start",
  end: "end",
  error: "error",
};

export class WithTime extends EventEmitter {
  #startTime = 0;

  #setStartTime() {
    this.#startTime = Date.now();
  }

  #resetStartTime() {
    this.#startTime = 0;
  }

  calculateExecTimeOnEnd() {
    return Date.now() - this.#startTime;
  }

  execute(asyncFunc, ...args) {
    this.#setStartTime();
    this.emit(EVENTS.start, { startTime: this.#startTime });

    asyncFunc(...args)
      .then((data) => {
        const executionTime = this.calculateExecTimeOnEnd();

        this.emit(EVENTS.end, { data, executionTime });
      })
      .catch((error) => {
        const executionTime = this.calculateExecTimeOnEnd();

        this.emit(EVENTS.error, { error, executionTime });
      })
      .finally(() => {
        this.#resetStartTime();
      });
  }
}
