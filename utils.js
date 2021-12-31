/**
 * @description 节流
 * @author fangbin
 * @param {function} fn
 * @param {number ms} time
 * @param {boolean} debounced  是否最后触发一次，算是防抖和节流的一种融合
 */
function throttle (fn, time, debounced){
  let t = undefined, timer = null;

  let throttled = function (...args){
    if (!t || Date.now() - t >= time) {
      fn.apply(this, args);
      t = Date.now();
    }
    if (debounced) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(fn.bind(this, ...args), time);
    }
  }
  
  throttled.cancel = function (){
    clearTimeout(timer);
    timer = null;
  }

  return throttled;
}

/**
 * @description 防抖
 * @author fangbin
 * @param {function} fn
 * @param {number ms} time
 * @param {boolean} immediate 是否立即执行,已经算是节流的实现了，个人觉得很没有必要
 */
function debounce (fn, time, immediate){
  let timer = null, result = undefined;

  let debounced = function (...args){
    if (timer) clearTimeout(timer);
    if (immediate) {
      let callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, time);
      if (callNow) result = fn.apply(this, args);
    }else {
      timer = setTimeout(fn.bind(this, ...args), time);
    }
    return result;
  }

  debounced.cancel = function (){
    clearTimeout(timer);
    timer = null;
  };

  return debounced;
}

/**
 * @description promisify
 * @author fangbin
 * @param {function} fn
 */
function promisify (fn){
  return function (...args){
    return new Promise((resolve, reject) => {
      args.push((err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data);
      });
      fn(...args);
    });
  }
}

/**
 * @description generator函数自执行
 * @author fangbin
 * @param {generator function} gen
 */
function co (gen){
  return new Promise((resolve, reject) => {
    const g = gen();
    const _next = val => {
      let res = undefined;
      try {
        res = g.next(val);
      }catch(err) {
        return reject(err);
      }
      if (res.done) {
        return resolve(res.value);
      }
      Promise.resolve(res.value).then(val => {
        _next(val);
      }, err => {
        g.throw(err);
      });
    }
    _next();
  })
}

/**
 * @description 深拷贝
 * @author fangbin
 * @param {*} target
 * @param {WeakMap} [map=new WeakMap()]
 */
function deepClone (target, map = new WeakMap()){
  if (typeof target !== 'object' || target === null) return target;
  const Ctor = target.constructor;
  const deepType = ['map', 'set', 'array', 'object', 'arguments'];
  const targetType = getType(target);
  let cloneTarget = undefined;
  if (deepType.includes(targetType)) cloneTarget = new Ctor();
  if (map.get(target)) return map.get(target);
  map.set(target, cloneTarget);

  switch(targetType) {
    case 'string':
    case 'boolean':
    case 'number':
    case 'date':
    case 'error':
    case 'symbol':
    case 'bigint':
      cloneTarget = Object(target);
      break;
    case 'regexp':
      const reflag = /\w+/;
      cloneTarget = new Ctor(target.source, reflag.exec(target));
      cloneTarget.lastIndex = target.lastIndex;
      break;
    case 'object':
      Object.keys(target).forEach(key => {
        cloneTarget[key] = clone(target[key], map);
      });
      break;
    case 'array':
    case 'arguments':
      target.forEach((e, i) => {
        cloneTarget[i] = clone(e, map);
      });
      break;
    case 'map':
      target.forEach((value, key) => {
        cloneTarget.set(key, clone(value, map));
      });
      break;
    case 'set':
      target.forEach(e => {
        cloneTarget.add(clone(e, map));
      })
      break;
    default:
      return null;
  }
  return cloneTarget;
}

/**
 * @description 尾递归优化
 * @author fangbin
 * @param {function} fn
 */
function tco (fn){
  let active = false,
    value = undefined,
    accumulated = [];
  return function (){
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = fn.apply(null, accumulated.shift());
      }
      active = false;
      return value;
    }
  }
}

/**
 * @description 获取参数
 * @author fangbin
 * @param {string} url
 */
function getParams (url){
  let regx = /([^&?=]+)=([^&?=]+)/g;
  let obj = {};
 
  url.replace(regx, (...args) => {
    if (obj[args[1]]) {
      obj[args[1]] = Array.isArray(obj[args[1]]) ? obj[args[1]] : [obj[args[1]]];
      obj[args[1]].push(args[2]);
    } else {
      obj[args[1]] = args[2];
    }
  });
 
  return obj;
}

/**
 * @description 模板渲染
 * @author fangbin
 * @param {string} template
 * @param {object} data
 */
function render (template, data){
  const reg = /\{\{(\w+?)\}\}/;
  while (reg.test(template)) {
    const name = reg.exec(template)[1];
    template = template.replace(reg, data[name]);
  }
  return template;
}

/**
 * @description 千分位划分
 * @author fangbin
 * @param {string} str
 * @returns
 */
function thousands (str){
  return str.replace(/(\d)(?=(?:\d{3})+$)/g,'$1,');
}

/**
 * @description 获取类型
 * @author fangbin
 * @param {*} target
 * @returns
 */
function getType (target){
  return Object.prototype.toString.call(target).toLowerCase().slice(8, -1);
}

/**
 * @description 柯里化
 * @author fangbin
 * @param {function} fn
 * @param {*} args
 * @returns
 */
function curry (fn, ...args){
  const len = fn.length;
  return function (..._args){
    const params = args.concat(_args);
    if (params.length < len) return curry.apply(this, params);
    else return fn.apply(this, params);
  }
}

/**
 * @description 浅比较
 * @author fangbin
 * @param {*} a
 * @param {*} b
 * @returns
 */
function shallowEqual (a, b){
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (let i = 0; i < aKeys.length; i++) {
    if (!Reflect.has(b, aKeys[i]) || !Object.is(a[aKeys[i]], b[aKeys[i]])) return false;
  }
  return true;
}

/**
 * @description 求最大公约数(辗转相除法)
 * @author fangbin
 * @param {*} a
 * @param {*} b
 * @returns
 */
function gcd (a, b){
  if (b === 0) return a;
  return gcd(b, a % b);
}

export {
  throttle,
  debounce,
  promisify,
  co,
  deepClone,
  tco,
  getParams,
  render,
  thousands,
  getType,
  curry,
  shallowEqual,
  gcd,
};