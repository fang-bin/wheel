/**
 * @description 限制并发Promise
 * @author fangbin
 * @class LimitPromise
 */
class LimitPromise {
  #count = 0;
  #queue = [];
  constructor (max, callback) {
    this.max = max;
    this.callback = callback;
  }
  call(caller, ...args) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(caller, args, resolve, reject);
      if (this.#count >= this.max) {
        this.#queue.push(task);
      }else {
        task();
      }
    })
  }
  finally(callback) {
    this.callback = callback;
  }
  _createTask(caller, args, resolve, reject) {
    return () => {
      this.#count++;
      caller(...args)
        .then(resolve, reject)
        .finally(() => {
          this.#count--;
          if (this.#queue.length) {
            this.#queue.shift()?.();
          }
          if (this.#count === 0) {
            this?.callback?.();
          }
        })
    }
  }
}

export default LimitPromise;

/**
var urls = [
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting1.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting2.png",
  // "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting3.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting4.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting5.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn6.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn7.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn8.png",
];
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function() {
      console.log("一张图片加载完成");
      resolve(img);
    };
    img.onerror = function() {
    	reject(new Error('Could not load image at' + url));
    };
    img.src = url;
  });
}

let limitP = new LimitPromise(3);
limitP.finally(() => {
  console.log('完结');
})
urls.forEach(url => {
  limitP.call(loadImg, url);
});

或者使用

function limitLoad (urls, handler, limit){
  const allUrls = [].concat(urls);
  const queue = allUrls.splice(0, limit).map((url, index) => handler(url).then(() => index));
  return allUrls.reduce((promiseRace, url) => 
    promiseRace.then(() => Promise.race(queue))
      .then(index => {
        queue[index] = handler(url).then(() => index);
      }).catch(err => {
        console.log(err);
      }), Promise.resolve())
      .then(() => Promise.all(queue));
}

limitLoad(urls, loadImg, 4).then(res => {
  console.log('完结');
}).catch(err => {
  console.error(err);
});
 */