/**
 * @description Object.is 解决js中 0 === -0  &  NaN !== NaN 的问题
 * @param {*} x 
 * @param {*} y 
 * @returns 
 */
Object.myIs = function (x, y){
  if (x === y) {
    return x !== 0 && y !== 0 && (1 / x === 1 / y);
  }else {
    return x !== x && y !== y;
  }
}

/**
 * @description Object.create
 * @param {*} proto 
 * @param {*} descriptors 
 * @returns 
 */
Object.myCreate = function (proto, descriptors){
  if (descriptors === null) throw new TypeError();
  function Fn() {}
  Fn.prototype = proto;
  let obj = new Fn();
  if (descriptors !== undefined) Object.defineProperties(obj, descriptors);
  if (proto === null) obj.__proto__ = null;
  return obj;
}

/**
 * @description Object.assign
 * @param {*} target 
 * @param  {...any} sources 
 * @returns 
 */
Object.myAssign = function (target, ...sources){
  if (target === null) throw new TypeError();
  target = Object(target);
  sources.forEach(source => {
    if (source === null) return;
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  });
  return target;
}

Object.myKeys = function (){
  
}

Object.myValues = function (){
  
}

Object.myEntries = function (){
  
}

Object.myFreeze = function (){
  
}

Object.mySeal = function (){
  
}

Object.myPreventExtensions = function (){
  
}

Object.myIsExtensible = function (){
  
}

Object.myIsFrozen = function (){
  
}

Object.myIsSealed = function (){
  
}

Object.myGetPrototypeOf = function (){
  
}

Object.mySetPrototypeOf = function (){
  
}

Object.myFromEntries = function (){
  
}


Object.prototype.myIsPrototypeOf = function (){
  
}

Object.prototype.myHasOwnProperty = function (){
  
}

Object.prototype.myPropertyIsEnumerable = function (){
  
}