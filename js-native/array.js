/**
 * @description Array.prototype.indexOf
 * @param {*} search 查找目标
 * @param {*} start 起始位置
 * @returns {number} 目标元素的位置，没有则返回-1
 */
Array.prototype.myIndexOf = function (search, start){
  const len = this.length;
  let index = start;
  if (index >= len) return -1;
  else if(index < 0) index = Math.abs(index) > len ? 0 : len + index;
  while (index < len) {
    if (this[index] === search) return index;
    index++;
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
  if (typeof fn !== 'function') throw new TypeError();
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
  if (typeof fn !== 'function') throw new TypeError();
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
  if (typeof fn !== 'function') throw new TypeError();
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
  if (typeof fn !== 'function') throw new TypeError();
  const len = this.length;
  let index = 0;
  while (index < len) {
    if (Reflect.has(this, index)) fn.call(thisArg, this[index], index, this);
    index++;
  }
}

/**
 * @description Array.prototype.reduce
 * @param {*} fn 遍历函数(从头到尾)
 * @param {*} initValue 初始值
 * @returns {*} 最后返回值
 */
Array.prototype.myReduce = function (fn, initValue){
  if (typeof fn !== 'function') throw new TypeError();
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
  if (typeof fn !== 'function') throw new TypeError();
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

  let startIndex = index;
  if (startIndex > len) startIndex = len;
  else if (startIndex < 0) startIndex = Math.abs(startIndex) > len ? 0 : len + startIndex;

  let delCount = delNum;
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
  let startIndex = start;
  if (startIndex > len) return [];
  else if (startIndex < 0) startIndex = Math.abs(startIndex) > len ? 0 : len + startIndex;

  let endIndex = end;
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



