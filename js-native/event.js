/**
 * @description 发布订阅模式event
 * @author fangbin
 * @class EventEmitter
 */
class EventEmitter {
  #events = Object.create(null);
  on(type, listener) {
    if (!this.#events[type]) this.#events[type] = new Set();
    this.#events[type].add(listener);
  }
  off(type, listener) {
    if (!this.#events[type]) return false;
    this.#events[type].delete(listener);
  }
  emit(type, ...args) {
    if (!this.#events[type]) return false;
    this.#events[type].forEach(listener => {
      Reflect.apply(listener, undefined, args);
    });
  }
  once(type, listener) {
    const callback = (...args) => {
      Reflect.apply(listener, undefined, args);
      this.off(type, callback);
    }
    this.on(type, callback);
  }
}

export default EventEmitter;