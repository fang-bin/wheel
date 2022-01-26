/**
 * @description 创建同页面的Dedicated Worker
 * @author fangbin
 * @param {*} fn 处理函数
 * @param {*} options
 * @returns Dedicated Worker
 */
function createWorker (fn, options){
  const blob = new Blob([`(${fn.toString()})()`]);
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url, options);
  return worker;
}

export default createWorker;

/**
const worker = createWorker(function (){
  self.addEventListener('message', function ({data}){
    setTimeout(() => {
      self.postMessage(data + 100);
      self.close();
    }, 1000);
  });
});
worker.postMessage(1);
worker.addEventListener('message', function ({data}){
  console.log('计算后的信息:' + data);
});
 */

