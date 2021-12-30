/**
 * 简单实现堆，一些其他的方法再补充
 */

/**
 * @description 最小堆
 * @author fangbin
 * @class MinHeap
 */
class MinHeap {
  constructor (data = [], comparator = (a, b) => b - a) {
    this.comparator = comparator;
    this.data = data;
    this.heapify();
  }
  heapify() {
    if (this.size() < 2) return;
    for (let i = 1; i < this.size(); i++) {
      this.shiftUp(i);
    }
  }
  peek() {
    return this.data[0];
  }
  offer(value) {
    this.data.push(value);
    this.shiftUp(this.size() - 1);
  }
  pool() {
    if (this.size() === 0) return undefined;
    const res = this.data[0];
    const last = this.data.pop();
    if (this.size() !== 0) {
      this.data[0] = last;
      this.shiftDown(0);
    }
    return res;
  }
  shiftUp(index) {
    while (index > 0) {
      const parentIndex = (index - 1) >> 1;
      if (this.comparator(this.data[parentIndex], this.data[index]) < 0) {
        this.swap(index, parentIndex);
        index = parentIndex;
      }else {
        break;
      }
    }
  }
  shiftDown(index) {
    const len = this.size();
    while (true) {
      const lIndex = 2 * index + 1;
      const rIndex = 2 * index + 2;
      let changeIndex = index;
      if (lIndex < len && this.comparator(this.data[changeIndex], this.data[lIndex]) < 0) {
        changeIndex = lIndex;
      }
      if (rIndex < len && this.comparator(this.data[changeIndex], this.data[rIndex]) < 0) {
        changeIndex = rIndex;
      }
      if (changeIndex !== index) {
        this.swap(changeIndex, index);
        index = changeIndex;
      }else {
        break;
      }
    }
  }
  swap(a, b) {
    [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
  }
  size() {
    return this.data.length;
  }
}

/**
 * @description 最大堆
 * @author fangbin
 * @class MaxHeap
 * @extends {MinHeap}
 */
class MaxHeap extends MinHeap {
  constructor(data) {
    super(data, (a, b) => a - b);
  }
}

export default {
  MaxHeap,
  MinHeap,
};

export {
  MaxHeap,
  MinHeap,
};