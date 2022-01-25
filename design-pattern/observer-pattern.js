/**
 * 观察者模式
 */

class Subject {
  observers = new Set();
  add(observer) {
    this.observers.add(observer);
  }
  remove(observer) {
    this.observer.delete(observer);
  }
}

class ConcreteSubject extends Subject {
  notify(text) {
    this.observers.forEach(observer => {
      observer.log(text);
    })
  }
}

class Observer1 {
  log(text) {
    console.log(`observer1 广播 ${text}`);
  }
}

class Observer2 {
  log(text) {
    console.log(`observer2 广播 ${text}`);
  }
}

const sub = new ConcreteSubject();
const ob1 = new Observer1();
const ob2 = new Observer2();

sub.add(ob1);
sub.add(ob2);

sub.notify('你好');


// 发布订阅模式 ../js-native/event

/**
 * 发布订阅模式 与 观察者模式
 * 
 * 发布-订阅模式是面向调度中心编程的，而观察者模式则是面向目标和观察者编程的。
 * 前者用于解耦发布者和订阅者，后者用于耦合目标和观察者。
 * 相对来说，发布-订阅模式能够根据不同主题来添加订阅者，从而实现更为颗粒度的控制。
 */