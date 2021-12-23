/**
 * @description instanceof 命令
 * @author fangbin
 * @param {*} obj
 * @param {*} Ctor
 * @returns {Boolean} 构造函数的原型对象是否在对象的原型链上
 */
function myInstanceof (obj, Ctor){
  let obj_proto = Object.getPrototypeOf(obj);
  const proto = Ctor.prototype;
  while (obj_proto) {
    if (obj_proto === proto) return true;
    obj_proto = Object.getPrototypeOf(obj_proto);
  }
  return false;
}

/**
 * @description new 命令
 * @author fangbin
 * @returns 新对象
 */
function myNew (){
  const Ctor = [].shift.call(arguments);
  let obj = Object.create(Ctor.prototype);
  let ret = Ctor.apply(obj, arguments);
  return typeof ret === 'object' ? ret : obj;
}

/**
 * @description in 命令
 * @param {*} key 属性
 * @param {*} obj 对象
 * @returns {Boolean} 属性是否存在于对象或者其原型链上(包括不可遍历属性和 Symbol 属性)
 */
function myIn (key, obj){
  if (Reflect.ownKeys(obj).includes(key)) return true;
  let obj_proto = Object.getPrototypeOf(obj);
  while (obj_proto) {
    if (Reflect.ownKeys(obj_proto).includes(key)) return true;
    obj_proto = Object.getPrototypeOf(obj_proto);
  }
  return false;
}

export {
  myNew,
  myInstanceof,
  myIn,
};

export default {
  myNew,
  myInstanceof,
  myIn,
};