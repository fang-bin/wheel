/**
 * @description ajax
 * @author fangbin
 * @param {*} options
 * @returns XMLHttpRequest
 */
function ajax (options){
  let opts = Object.assign({}, {
    url: '',
    type: 'GET',
    data: {},
    dataType: 'json',
    success: undefined,
    fail: undefined,
    withCredentials: false,
    timeout: 0,
  }, options);

  opts.type = (opts.type || 'GET').toUpperCase();

  const formatParams = function (data){
    let arr = [];
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        arr.push(`${encodeURIComponent(key)}=${encodeURIcomponent(element)}`);
      }
    }
    arr.push(`v=${Math.random().toString(16).slice(2)}`);
    return arr.join('&');
  }

  const params = formatParams(opts.data);

  let xhr = undefined;
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  }else {
    xhr = new ActiveXObject();
  }

  xhr.onreadystatechange = function (){
    if (xhr.readystate === 4) {
      const status = xhr.status;
      if (status >= 200 && status < 300 || status === 304) {
        opts?.success?.(opts.dataType === 'json' ? JSON.parse(xhr.responseText) : xhr.responseText);
      }else {
        opts?.fail?.(status);
      }
    }
  }

  if (opts.type === 'GET') {
    xhr.open('GET', `${opts.url}${opts.url.indexOf('?') > -1 ? '' : '?'}${params}`, true);
    opts.timeout && (xhr.timeout = timeout);
    opts.withCredentials && (xhr.withCredentials = true);
    xhr.send(null);
  }else if (opts.type === 'POST') {
    xhr.open('POST', opts.url, true);
    opts.timeout && (xhr.timeout = timeout);
    opts.withCredentials && (xhr.withCredentials = true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
  }

  return xhr;
}

export default ajax;