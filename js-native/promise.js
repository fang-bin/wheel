const PENDING = Symbol('pending');
const FULFILLED = Symbol('fulfilled');
const REJECTED = Symbol('rejected');
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
  static abort(promise) {
    let _abort = undefined;
    let _abort_promise = new MyPromise((_, reject) => {
      _abort = reject;
    });
    let p = MyPromise.race([promise, _abort_promise]);
    p.abort = _abort;
    return p;
  }
  static try(action) {
    return new MyPromise(resolve => resolve(typeof action === 'function' ? action() : action));
  }
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

MyPromise.defer = MyPromise.deferred = function(){
  let dfd = {};
  dfd.promise = new MyPromise((resolve, reject)=>{
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd;
}

module.exports =  MyPromise;