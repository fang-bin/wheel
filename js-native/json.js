// JSON 的 polyfill (https://github.com/douglascrockford/JSON-js)

/**
 * @description JSON.stringify
 * @param {*} value 
 * @param {function|array} replacer
 * function replacer(key, value) 在序列化过程中，被序列化的值的每个属性都会经过该函数的转换和处理；
 * array 只有包含在这个数组中的属性名才会被序列化到最终的 JSON 字符串中
 * 如果该参数为 null 或者未提供，则对象所有的属性都会被序列化。
 * @param {sting|number} space 指定缩进用的空白字符串，用于美化输出（pretty-print）；
 * number 代表有多少的空格；上限为10。该值若小于1，则意味着没有空格；
 * string 当字符串长度超过10个字母，取其前10个字母，该字符串将被作为空格；
 * 如果该参数没有提供（或者为 null），将没有空格。
 * @returns {JSON String} JSON字符串
 */
JSON.myStringify = function (value){
  const valueType = typeof value;
  if (valueType !== 'object') {
    let result = value;
    // NaN Infinity -Infinity 转化为 "null";
    if (Number.isNaN(value) || value === Infinity || value === -Infinity) {
      result = "null";
    // 单独作为值时，function undefined symbol转化为 undefined
    }else if(valueType === 'function' || valueType === 'undefined' || valueType === 'symbol') {
      return undefined;
    }else if (valueType === 'string') {
      result = '"' + value + '"';
    // JSON.stringify不能处理BigInt类型数据
    }else if(valueType === 'bigint') {
      throw new TypeError('Do not know how to serialize a BigInt');
    }
    return String(result);
  }else if (valueType === 'object') {
    if (value === null) return "null";
    // 优先尝试调用对象自身的 toJSON 方法
    else if(value.toJSON && typeof value.toJSON === 'function') {
      return JSON.myStringify(value.toJSON());
    }else if(Object.prototype.toString.call(value).toLowerCase().slice(8, -1) === 'array') {
      let result = [];
      value.forEach((item, index) => {
        // 作为数组中的元素项，function symbol undefined 转化为 "null"
        if (typeof item === 'function' || typeof item === 'symbol' || typeof item === 'undefined') {
          result[index] = "null";
        }else if(typeof item === 'bigint') {
          throw new TypeError('Do not know how to serialize a BigInt');
        }else {
          result[index] = JSON.myStringify(item);
        }
      });
      result = "[" + result + "]";
      return result.replace(/'/g, '"');
    }else {
      let result = [];
      // map set regexp 的 Object.keys 为 []  最后返回的就是{}
      Object.keys(value).forEach(key => {
        // 过滤掉对象中 symbol 作为键的项
        if (typeof key !== 'symbol') {
          if (typeof value[key] === 'bigint') throw new TypeError('Do not know how to serialize a BigInt');
          // 作为对象中的键值，function symbol undefined 会被直接过滤掉
          if (typeof value[key] !== 'function' && typeof value[key] !== 'symbol' && typeof value[key] !== 'undefined') {
            result.push('"' + key + '"' + ':' + JSON.myStringify(value[key]));
          }
        }
      });
      return ('{' + result + '}').replace(/'/g, '"');
    }
  }
}

/**
 * 使用eval实现
 * eval 会有 XSS 漏洞（解析的对象可能并非 json 而是可以执行的 js）
 * 所以要对参数做校验，只有真正符合 JSON 格式，才能调用 eval
 */
JSON.myParseEval = (function (){
  const rx_one = /^[\],:{}\s]*$/;
  const rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  const rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  const rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  return function (target){
    if (
        rx_one.test(
          target
            .replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
        )
    ) {
      return eval("(" + target + ")");
    }
  }
})();

/**
 * 和上面方法有一样的问题
 */
JSON.myParseFunction = (function (){
  const rx_one = /^[\],:{}\s]*$/;
  const rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
  const rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
  const rx_four = /(?:^|:|,)(?:\s*\[)+/g;
  return function (target){
    if (
        rx_one.test(
          target
            .replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
        )
    ) {
      return (new Function("return " + target))();
    }
  }
})();
