/**
 * @description String.prototype.indexOf (KMP实现版)
 * @param {*} str 
 * @param {*} index 
 * @returns {number}
 */
String.prototype.myIndexOf = function (str, index){
  // KMP算法实现
  const n = this.length;
  const m = str.length;
  
  index = index ?? 0;
  if (index < 0) index = 0;
  else if(index > n && m !== 0) return -1;

  if (m === 0) return index;

  let next = new Array(m).fill(0);
  for (let i = 1, j = 0; i < m; i++) {
    while (j > 0 && str.charAt(i) !== str.charAt(j)) j = next[j - 1];
    if (str.charAt(i) === str.charAt(j)) j++;
    next[i] = j;
  }

  for (let i = index, j = 0; i < n; i++) {
    while (j > 0 && this.charAt(i) !== str.charAt(j)) j = next[j - 1];
    if (this.charAt(i) === str.charAt(j)) j++;
    if (j === m) return i - m + 1;
  }
  return -1;
}

String.prototype.myLastIndexOf = function (str, index){
  
}

/**
 * @description String.prototype.includes
 * @param {*} str 
 * @param {*} index 
 * @returns {Boolean}
 */
String.prototype.myIncludes = function (str, index){
  // KMP算法实现
  const n = this.length;
  const m = str.length;

  index = index ?? 0;
  if (index < 0) index = 0;
  else if(index > n && m !== 0) return false;

  if (m === 0) return true;

  let next = new Array(m).fill(0);
  for (let i = 1, j = 0; i < m; i++) {
    while (j > 0 && str.charAt(i) !== str.charAt(j)) j = next[j - 1];
    if (str.charAt(i) === str.charAt(j)) j++;
    next[i] = j;
  }

  for (let i = index, j = 0; i < n; i++) {
    while (j > 0 && this.charAt(i) !== str.charAt(j)) j = next[j - 1];
    if (this.charAt(i) === str.charAt(j)) j++;
    if (j === m) return true;
  }
  return false;
}

/**
 * @description String.prototype.startsWith
 * @param {*} str 
 * @param {*} index 
 * @returns {Boolean}
 */
String.prototype.myStartsWith = function (str, index){
  index = index ?? 0;
  if (index < 0) index = 0;
  return this.substring(index, index + str.length) === str;
}

/**
 * @description String.prototype.endsWith
 * @param {*} str 
 * @param {*} len 
 * @returns 
 */
String.prototype.myEndsWith = function (str, len){
  if (len === undefined || len > this.length) {
    len = this.length;
  }
  return this.substring(len - str.length, len) === str;
}


String.prototype.myPadStart = function (len, padStr){
  
}

String.prototype.myPadEnd = function (len, padStr){
  
}

String.prototype.myRepeat = function (){
  
}

String.prototype.myTrimStart = function (){
  
}

String.prototype.myTrimEnd = function (){
  
}

String.prototype.myTrim = function (){
  
}

String.prototype.myTrimLeft = function (){
  
}

String.prototype.myTrimRight = function (){
  
}

String.prototype.myAt = function (){
  
}

String.prototype.myConcat = function (){
  
}

String.prototype.mySearch = function (){
  
}

String.prototype.mySlice = function (){
  
}

String.prototype.mySplit = function (){
  
}

String.prototype.mySubstr = function (){
  
}

String.prototype.mySubstring = function (){
  
}

