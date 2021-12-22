/**
 * @description jsonp
 * @param {string} url 
 * @param {object} options 
 * @param {function} callback 
 */
const jsonp = function (url, options, callback){
  let urlStr = url.indexOf('?') > -1 ? '&' : '?';
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const element = options[key];
      urlStr += `${encodeURLComponent(key)}=${encodeURIComponent(element)}&`;
    }
  }
  const callbackName = Math.random().toString(16).slice(2);
  const scriptDom = document.createElement('script');
  scriptDom.src = `${url}${urlStr}callback=${callbackName}`;
  window[callbackName] = function (data){
    callback?.(data);
    document.body.removeChild(scriptDom);
  }
  document.body.appendChild(scriptDom);
}

export default jsonp;