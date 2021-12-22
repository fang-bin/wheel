/**
 * @description Function.prototype.bind
 * @param {*} thisArg 
 * @param  {...any} args 
 * @returns 
 */
Function.prototype.myBind = function (thisArg, ...args){
  const that = this;
  const bindFn = function (..._args){
    return that.apply(that.prototype.isPrototypeOf(this) ? this : thisArg, args.concat(_args));
  }
  bindFn.prototype = Object.create(that.prototype);
  return bindFn;
}

/**
 * @description Function.prototype.call
 * @param {*} thisArg 
 * @param  {...any} args 
 * @returns 
 */
Function.prototype.myCall = function (thisArg, ...args){
  const fn = Symbol('fn');
  thisArg = thisArg || window;
  thisArg[fn] = this;
  const res = thisArg[fn](...args);
  Reflect.deleteProperty(thisArg, fn);
  return res;
}

/**
 * @description Function.prototype.apply
 * @param {*} thisArg 
 * @param {*} args 
 * @returns 
 */
Function.prototype.myApply = function (thisArg, args){
  const fn = Symbol('fn');
  thisArg = thisArg || window;
  thisArg[fn] = this;
  const res = thisArg[fn](...args);
  Reflect.deleteProperty(thisArg, fn);
  return res;
}