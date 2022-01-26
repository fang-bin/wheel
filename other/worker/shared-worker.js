/**
 * 此处文件主要用于 多tab通信（受同源策略影响的）
 */

let portList = [];
self.onconnect = function (e){
  let port = e.ports[0];
  portList.push(port);
  port.onmessage = function (e){
    const data = e.data;
    const index = portList.findIndex(p => p === port);
    if (data === 'CLOSED') {
      portList.splice(index, 1);
      return;
    }
    portList.forEach((p, i) => {
      if (i === index) {
        // 过滤发信方自身;
        return;
      };
      p.postMessage(data);
    });
  };
}

/**
引用的shared-worker文件地址必须为网络地址，这里暂用xxx代替

// 页面A
const sharedWorker = new SharedWorker('xxx/shared-worker.js');
sharedWorker.port.onmessage = function ({data}){
  console.log('接收到的信息' + data);
}
sharedWorker.port.start();

window.onbeforeunload = function (){
  sharedWorker.port.postMessage('CLOSED');
}

function sharedSendB (){
  sharedWorker.port.postMessage('A真帅');
}



// 页面B
const sharedWorker = new SharedWorker('xxx/shared-worker.js');
sharedWorker.port.onmessage = function ({data}){
  console.log('接收到的信息' + data);
}
sharedWorker.port.start();

window.onbeforeunload = function (){
  sharedWorker.port.postMessage('CLOSED');
}

function sharedSendA (){
  sharedWorker.port.postMessage('B真帅');
}
*/