/**
 * @description Array.prototype.indexOf
 * @param {*} search 查找目标
 * @param {*} start 起始位置
 * @returns {number} 目标元素的位置，没有则返回-1
 */
Array.prototype.myIndexOf = function (search, start){
  const len = this.length;
  let index = start ?? 0;
  if (index >= len) return -1;
  else if(index < 0) index = Math.abs(index) > len ? 0 : len + index;
  while (index < len) {
    if (this[index] === search) return index;
    index++;
  }
  return -1;
}

/**
 * @description Array.prototype.lastIndexOf
 * @param {*} search 
 * @param {*} start 
 * @returns 
 */
Array.prototype.myLastIndexOf = function (search, start){
  const len = this.length;
  let index = start ?? len - 1;
  if (index >= len) index = len - 1;
  else if(index < 0) index = Math.abs(index) > len ? 0 : len + index;
  while (index >= 0) {
    if (this[index] === search) return index;
    index--;
  }
  return -1;
}

/**
 * @description Array.prototype.findIndex
 * @param {*} fn 查找函数
 * @param {*} thisArg 查找函数中的this对象
 * @returns {number} 目标元素的位置，没有则返回-1
 */
Array.prototype.myFindIndex = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  const len = this.length;
  let index = 0;
  while (index < len) {
    if (Reflect.has(this, index) && fn.call(thisArg, this[index], index, this)) return index;
    index++;
  }
  return -1;
}

/**
 * @description Array.prototype.find
 * @param {*} fn 查找函数
 * @param {*} thisArg 查找函数中的this对象
 * @returns {*} 目标元素，没有则返回undefined
 */
Array.prototype.myFind = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  const len = this.length;
  let index = 0;
  while (index < len) {
    if (Reflect.has(this, index) && fn.call(thisArg, this[index], index, this)) return this[index];
    index++;
  }
  return undefined;
}

/**
 * @description Array.prototype.map
 * @param {*} fn 遍历函数
 * @param {*} thisArg 遍历函数中的this对象
 * @returns {Array} 处理过的一个新数组
 */
Array.prototype.myMap = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  const len = this.length;
  let index = 0, arr = new Array(len);
  while (index < len) {
    if (Reflect.has(this, index)) {
      arr[index] = fn.call(thisArg, this[index], index, this);
    }
    index++;
  }
  return arr;
}

/**
 * @description Array.prototype.forEach
 * @param {*} fn 遍历函数
 * @param {*} thisArg 遍历函数中的this对象
 */
Array.prototype.myForEach = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  const len = this.length;
  let index = 0;
  while (index < len) {
    if (Reflect.has(this, index)) fn.call(thisArg, this[index], index, this);
    index++;
  }
}

/**
 * @description Array.prototype.filter
 * @param {*} fn 
 * @param {*} thisArg 
 * @returns 
 */
Array.prototype.myFilter = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  const len = this.length;
  let arr = [], index = 0;
  while (index < len) {
    if (Reflect.has(this, index) && fn.call(thisArg, this[index], index, this)) {
      arr.push(this[index]);
    }
    index++;
  }
  return arr;
}

/**
 * @description Array.prototype.some
 * @param {*} fn 
 * @param {*} thisArg 
 * @returns 
 */
Array.prototype.mySome = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  const len = this.length;
  let index = 0;
  while (index < len) {
    if (Reflect.has(this, index) && fn.apply(thisArg, this[index], index, this)) return true;
    index++;
  }
  return false;
}

/**
 * @description Array.prototype.every
 * @param {*} fn 
 * @param {*} thisArg 
 * @returns 
 */
Array.prototype.myEvery = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  const len = this.length;
  let index = 0;
  while (index < len) {
    if (Reflect.has(this, index) && !fn.apply(thisArg, this[index], index, this)) return false;
    index++;
  }
  return true;
}

/**
 * @description Array.prototype.concat
 * @param  {...any} arrs 
 * @returns 
 */
Array.prototype.myConcat = function (...arrs){
  const len = this.length;
  let array = new Array(len);
  for (let i = 0; i < len; i++) array[i] = this[i];

  for (let i = 0; i < arrs.length; i++) {
    for (let j = 0; j < arrs[i].length; j++) {
      array.push(arrs[i][j]);
    }
  }

  return array;
}

/**
 * @description Array.prototype.fill
 * @param {*} flag 
 * @returns 
 */
Array.prototype.myFill = function (flag){
  const len = this.length;
  let index = 0;
  while (index < len) {
    this[index] = flag;
    index++;
  }
  return this;
}

/**
 * @description Array.prototype.flat
 * @param {*} depth 
 * @returns 
 */
Array.prototype.myFlat = function (depth){
  depth = depth ?? 1;
  if (depth < 0) {
    depth = 0;
  }

  let res = [];
  (function flatten (arr, count){
    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i]) && count > 0) {
        flatten(arr[i], count - 1);
      }else {
        if (Reflect.has(arr, i)) {
          res.push(arr[i]);
        }
      }
    }
  })(this, depth);

  return res;
}

/**
 * @description Array.prototype.flatMap
 * @param {*} fn 
 * @param {*} thisArg 
 * @returns 
 */
Array.prototype.myFlatMap = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError(`${fn} is not a function`);
  const len = this.length;
  let arr = [], index = 0;
  while (index < len) {
    if (Reflect.has(this, index)) {
      arr = arr.concat(fn.call(thisArg, this[index], index, this));
    }
    index++;
  }
  return arr;
}

/**
 * @description Array.prototype.includes
 * @param {*} search 
 * @param {*} start 
 * @returns {Boolean}
 */
Array.prototype.myIncludes = (function (){
  const is = (a, b) => {
    if (a === b) return true;
    else return a !== a && b !== b;
  }
  return function (search, start){
    const len = this.length;
    let index = start ?? 0;
    if (index >= len) return false;
    else if(index < 0) index = Math.abs(index) > len ? 0 : len + index;
  
    while (index < len) {
      if (is(this[index], search)) return true;
      index++;
    }
  
    return false;
  }
})();

/**
 * @description Array.prototype.join
 * @param {*} separator 
 * @returns 
 */
Array.prototype.myJoin = function (separator){
  separator = separator ?? ',';
  const len = this.length;
  let index = 0, result = '';
  while (index < len) {
    if (typeof this[index] === 'symbol') throw new TypeError('Cannot convert a Symbol value to a string');
    result += this[index].toString();
    if (index !== len - 1) result += separator;
    index++;
  }
  return result;
}

/**
 * @description Array.prototype.keys
 * @returns ArrayIterator
 */
Array.prototype.myKeys = function (){
  const len = this.length;
  let arr = new Array(len);
  for (let i = 0; i < len; i++) arr[i] = i;
  return arr[Symbol.iterator]();
}

/**
 * Array.prototype.values
 * @returns ArrayIterator
 */
Array.prototype.myValues = function (){
  const len = this.length;
  let arr = new Array(len);
  for (let i = 0; i < len; i++) arr[i] = this[i];
  return arr[Symbol.iterator]();
}

/**
 * Array.prototype.entries
 * @returns ArrayIterator
 */
Array.prototype.myEntries = function (){
  const len = this.length;
  let arr = new Array(len);
  for (let i = 0; i < len; i++) arr[i] = [i, this[i]];
  return arr[Symbol.iterator]();
}

/**
 * @description Array.prototype.push
 * @param  {...any} adds 
 * @returns {number} 数组的新长度
 */
Array.prototype.myPush = function (...adds){
  const len = this.length;
  const addLen = adds.length;
  this.length = len + addLen;
  for (let i = 0; i < addLen; i++) {
    this[i + len] = adds[i];
  }
  return this.length;
}

/**
 * @description Array.prototype.pop
 * @returns {*} 删除的元素
 */
Array.prototype.myPop = function (){
  const len = this.length;
  let delElement = undefined;
  if (len > 0) {
    delElement = this[len - 1];
    this.length = len - 1;
  }
  return delElement;
}

/**
 * @description Array.prototype.unshift
 * @param  {...any} adds 
 * @returns {number} 数组的新长度
 */
Array.prototype.myUnshift = function (...adds){
  const len = this.length;
  const addLen = adds.length;
  this.length = len + addLen;
  for (let i = len + addLen - 1; i >= addLen; i--) {
    this[i] = this[i - addLen];
  }
  for (let i = 0; i < addLen; i++) {
    this[i] = adds[i];
  }
  return this.length;
}

/**
 * @description Array.prototype.shift
 * @returns {*} 删除的元素
 */
Array.prototype.myShift = function (){
  const len = this.length;
  let delElement = undefined;
  if (len > 0) {
    delElement = this[0];
    for (let i = 0; i < len - 1; i++) {
      this[i] = this[i + 1];
    }
    this.length = len - 1;
  }
  return delElement;
}

/**
 * @description Array.prototype.reduce
 * @param {*} fn 遍历函数(从头到尾)
 * @param {*} initValue 初始值
 * @returns {*} 最后返回值
 */
Array.prototype.myReduce = function (fn, initValue){
  if (typeof fn !== 'function') throw new TypeError('MyReduce of empty array with no initial value');
  const len = this.length;
  let value = initValue, index = 0;
  if (value === undefined) {
    while (index < len && !Reflect.has(this, index)) index++;
    if (index >= len) throw new TypeError();
    value = this[index++];
  }
  while (index < len) {
    if (Reflect.has(this, index)) {
      value = fn(value, this[index], index, this);
    }
    index++;
  }
  return value;
}

/**
 * @description Array.prototype.reduceRight
 * @param {*} fn 遍历函数(从尾到头)
 * @param {*} initValue 初始值
 * @returns {*} 最后返回值
 */
Array.prototype.myReduceRight = function (fn, initValue){
  if (typeof fn !== 'function') throw new TypeError(`MyReduceRight of empty array with no initial value`);
  const len = this.length;
  let value = initValue, index = len - 1;
  if (value === undefined) {
    while (index >= 0 && !Reflect.has(this, index)) index--;
    if (index < 0) throw new TypeError();
    value = this[index--];
  }
  while (index >= 0) {
    if (Reflect.has(this, index)) {
      value = fn(value, this[index], index, this);
    }
    index--;
  }
  return value;
}

/**
 * @description Array.prototype.splice
 * @param {*} index 起始位置
 * @param {*} delNum 删除数量
 * @param  {...any} adds 新增元素
 * @returns {Array} 删除元素组成的数组
 */
Array.prototype.mySplice = function (index, delNum, ...adds){
  const len = this.length;
  const addCount = adds.length;

  let startIndex = index ?? 0;
  if (startIndex > len) startIndex = len;
  else if (startIndex < 0) startIndex = Math.abs(startIndex) > len ? 0 : len + startIndex;

  let delCount = delNum ?? 0;
  if (delCount > len - startIndex) delCount = len - startIndex;
  else if (delCount < 0) delCount = 0;

  if (Object.isFrozen(this)) {
    throw new TypeError();
  }
  if (Object.isSealed(this) && delCount !== addCount) {
    throw new TypeError();
  }

  let delArr = new Array(delCount);
  for (let i = 0; i < delCount; i++) {
    delArr[i] = this[i + startIndex];
  }

  const over = addCount - delCount;
  if (over > 0) {
    for (let i = len - 1; i >= startIndex + delCount; i--) {
      this[i + over] = this[i];
    }
  }else if(over < 0) {
    for (let i = startIndex + addCount; i < len; i++) {
      if (i >= len + over) {
        Reflect.deleteProperty(this, i);
        continue;
      }
      this[i] = this[i - over];
    }
  }

  for (let i = 0; i < addCount; i++) {
    this[i + startIndex] = adds[i];
  }

  this.length = len + over;

  return delArr;
}

/**
 * @description Array.prototype.slice
 * @param {*} start 起始位置
 * @param {*} end 结束位置
 * @returns {Array} 截取的数组
 */
Array.prototype.mySlice = function (start, end){
  const len = this.length;
  let startIndex = start ?? 0;
  if (startIndex > len) return [];
  else if (startIndex < 0) startIndex = Math.abs(startIndex) > len ? 0 : len + startIndex;

  let endIndex = end ?? len - 1;
  if (endIndex > len) endIndex = len;
  else if (endIndex < 0) endIndex = Math.abs(endIndex) > len ? 0 : len + endIndex;

  if (startIndex >= endIndex) return [];
  const over = endIndex - startIndex;
  let result = new Array(over);
  for (let i = 0; i < over; i++) {
    result[i] = this[i + startIndex];
  }
  return result;
}

/**
 * @description Array.isArray
 * @param {*} target 
 * @returns 
 */
Array.myIsArray = function (target){
  return Object.prototype.toString.call(target).toLowerCase().slice(8, -1) === 'array';
}

/**
 * @description Array.of
 * @param  {...any} elements 
 * @returns 数组
 */
Array.myOf = function (...elements){
  return elements;
}

/**
 * @description Array.from 对一个类数组或可迭代对象创建一个新的、浅拷贝的数组实例
 * @param {ArrayLike} arrayLike 类数组（这里的类数组比较宽泛，只要带有length的对象即可，或者是其他的一些数据结构，类似map、set）或可迭代对象
 * @param {function} mapFn 
 * @param {*} thisArg 
 * @bug  对于 Map Set 要单独做处理，后期有时间再完善
 */
Array.myFrom = (function (){
  const getLen = l => {
    let num = Number(l);
    num = Number.isNaN(num) ? 0 : num;
    if (!Number.isFinite(num)) throw new RangeError('Invalid array length');
    num = (num > 0 ? 1 : -1) * Math.floor(Math.abs(num));
    // Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1;
    num = Math.max(Math.min(num, 0), Number.MAX_SAFE_INTEGER);
  }

  return function (arrayLike, mapFn, thisArg){
    if (mapFn !== undefined && typeof mapFn !== 'function') throw new TypeError(`${mapFn} is not a function`);
    if (arrayLike === null || arrayLike === undefined) throw new TypeError('Array.from requires an array-like object - not null or undefined');
    let items = Object(arrayLike);
    const len = getLen(items.length);
    let arr = new Array(len), index = 0;
    while (index < len) {
      if (mapFn) {
        arr[index] = mapFn.call(thisArg, items[index], index);
      }else {
        arr[index] = items[index];
      }
      index++;
    }
    return arr;
  }
})();

/**
 * 伪(类)数组对象: 拥有一个 length 属性和若干索引属性的任意对象（其没有数组的方法）
 * 
 * 常见类数组：
 * 1. arguments
 * 2. NodeList
 * 
 * 函数是拥有length属性的对象，但正常情况下没有其他索引属性
 */

// Array.isArrayLike = function (target){
//   return typeof target === 'object' && !Array.isArray(target) && Reflect.has(target, 'length')
// }
