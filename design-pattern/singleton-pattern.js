/**
 * 单例模式
 */

import { result } from "lodash";

// 方法一
function A (name){
  this.name = name;
}

A.prototype.getName = function (){
  return this.name;
}

/**
 * 
 * 缺点是无法通过 new 来获取单例，同时创建单例的方法也和对象代码耦合在一起
 */
A.getInstance = function (name){
  if (!this.instance) {
    this.instance = new A(name);
  }
  return this.instance;
}



//方法二

const B = (function (){
  let instance = null;
  return function (name){
    if (instance) return instance;
    this.name = name;
    return instance = this;
  }
})();

B.prototype.getName = function (){
  return this.name;
}

// 方法三 (通用单例方法，也可以用来做执行一次的操作)
function getSingleInstance (fn){
  let instance = null;
  return function (){
    return instance || (result = fn.apply(this, arguments));
  }
}

