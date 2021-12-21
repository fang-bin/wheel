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

Array.prototype.myForEach = function (fn, thisArg){
  if (typeof fn !== 'function') throw new TypeError();
  const len = this.length;
  let index = 0;
  while (index < len) {
    if (Reflect.has(this, index)) fn.call(thisArg, this[index], index, this);
    index++;
  }
}

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



