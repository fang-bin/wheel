/**
 * @description instanceof命令
 * @author fangbin
 * @param {*} obj
 * @param {*} Ctor
 * @returns
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
 * @description new命令
 * @author fangbin
 * @returns
 */
function myNew (){
  const Ctor = [].shift.call(arguments);
  let obj = Object.create(Ctor.prototype);
  let ret = Ctor.apply(obj, arguments);
  return typeof ret === 'object' ? ret : obj;
}

function myIn (){
  
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