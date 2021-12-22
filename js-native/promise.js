const PENDING = Symbol('pending');
const FULFILLED = Symbol('fulfilled');
const REJECTED = Symbol('rejected');
/**
 * @description 实现Promise，不过没有完全按照Promise/A+实现
 * @author fangbin
 * @class MyPromise
 */
class MyPromise {
  #status = PENDING;
  #val = undefined;
  #fulfilledQueue = [];
  #rejectedQueue = [];
  constructor(executor) {
    const _resolve = val => {
      if (this.#status !== PENDING) return;
      this.#status = FULFILLED;
      this.#val = val;
      while (this.#fulfilledQueue.length) this.#fulfilledQueue.shift()?.(this.#val);
    }
    const _reject = err => {
      if (this.#status !== PENDING) return;
      this.#status = REJECTED;
      this.#val = err;
      while (this.#rejectedQueue.length) this.#rejectedQueue.shift()?.(this.#val);
    }
    executor(_resolve, _reject);
  }
  then(resolveFn, rejectFn) {
    typeof resolveFn !== 'function' && (resolveFn = val => val);
    typeof rejectFn !== 'function' && (rejectFn => err => {
      throw new Error(Error.prototype.isPrototypeOf(err) ? err.message : err);
    });
    return new MyPromise((resolve, reject) => {
      const _fulfilledFn = val => {
        queueMicrotask(() => {
          try{
            let res = resolveFn(val);
            MyPromise.prototype.isPrototypeOf(res) ? res.then(resolve, reject) : resolve(res);
          }catch (err) {
            reject(err);
          }
        });
      }
      const _rejectedFn = err => {
        queueMicrotask(() => {
          try {
            let res = rejectFn(err);
            MyPromise.prototype.isPrototypeOf(res) ? res.then(resolve, reject) : resolve(res);
          }catch (err) {
            reject(err);
          }
        });
      }
      switch (this.#status) {
        case PENDING:
          this.#fulfilledQueue.push(_fulfilledFn);
          this.#rejectedQueue.push(_rejectedFn);
          break;
        case FULFILLED:
          _fulfilledFn(this.#val);
          break;
        case REJECTED:
          _reject(this.#val);
          break;
      }
    });
  }
  catch(rejectFn) {
    return this.then(undefined, rejectFn);
  }
  finally(callback) {
    return this.then(
      val => MyPromise.resolve(callback()).then(() => val),
      err => MyPromise.resolve(callback()).then(() => {throw err}),
    );
  }
  static resolve(action) {
    if (MyPromise.prototype.isPrototypeOf(action)) return action;
    return new MyPromise(resolve => resolve(action));
  }
  static reject(action) {
    if (MyPromise.prototype.isPrototypeOf(action)) return action;
    return new MyPromise((_, reject) => reject(action));
  }
  static all(promiseArr) {
    let res = [], index = 0;
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        MyPromise.resolve(p).then(val => {
          res[i] = val;
          index++;
          if (index === promiseArr.length) resolve(res);
        }, err => {
          reject(err);
        });
      });
    });
  }
  static allSettled(promiseArr) {
    let res = [], index = 0;
    return new MyPromise(resolve => {
      promiseArr.forEach((p, i) => {
        MyPromise.resolve(p).then(val => {
          res[i] = {
            status: 'fulfilled',
            value: val,
          };
          index++;
        }, err => {
          res[i] = {
            status: 'rejected',
            reason: err,
          };
          index++;
        }).finally(() => {
          if (index === promiseArr.length) resolve(res);
        });
      });
    });
  }
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      for (let p of promiseArr) {
        MyPromise.resolve(p).then(val => {
          resolve(val);
        }, err => {
          reject(err);
        });
      }
    });
  }
  static any(promiseArr) {
    let errorArr = [], index = 0;
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((p, i) => {
        MyPromise.resolve(p).then(val => {
          resolve(val);
        }, err => {
          errorArr[i] = err;
          index++;
          if (index === promiseArr.length) reject(errorArr);
        });
      });
    });
  }
  /**
   * @description 可直接rejected状态的MyPromise
   * @param {*} promise 
   * @returns 
   */
  static abort(promise) {
    let _abort = undefined;
    let _abort_promise = new MyPromise((_, reject) => {
      _abort = reject;
    });
    let p = MyPromise.race([promise, _abort_promise]);
    p.abort = _abort;
    return p;
  }
  /**
   * @description 不区分fn是否异步，都用 MyPromise 来处理它
   * @param {*} action 
   * @returns 
   */
  static try(action) {
    return new MyPromise(resolve => resolve(typeof action === 'function' ? action() : action));
  }
  /**
   * @description promiseFn->rejected后再次尝试执行promiseFn
   * @param {*} promiseFn 
   * @param {*} times 
   * @returns 
   */
  static retry(promiseFn, times) {
    return new MyPromise(async (resolve, reject) => {
      while (times--) {
        try {
          const res = await promiseFn();
          return resolve(res);
        }catch (err) {
          if (!times) {
            reject(err);
          } 
        }
      }
    });
  }
}

// 用来测试MyPromise是否符合Promise/A+
MyPromise.defer = MyPromise.deferred = function(){
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd;
}

module.exports =  MyPromise;