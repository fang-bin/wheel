/**
 * 简单实现堆，一些其他的方法再补充
 * comparator函数和数组原生sort的comparator一样
 */

/**
 * @description 最小堆
 * @author fangbin
 * @class MinHeap
 */
class MinHeap {
  constructor (data, comparator = (a, b) => a - b) {
    this.data = data;
    this.comparator = comparator;
    this._heapify();
  }
  _heapify() {
    if (this._size() < 2) return;
    for (let i = 1; i < this._size(); i++) {
      this._shiftUp(i);
    }
  }
  _size() {
    return this.data.length;
  }
  _swap(a, b) {
    [this.data[a], this.data[b]] = [this.data[b], this.data[a]];
  }
  _shiftDown(index) {
    const len = this._size();
    while (true) {
      const lIndex = index * 2 + 1;
      const rIndex = index * 2 + 2;
      let changeIndex = index;
      while (lIndex < len && this.comparator(this.data[changeIndex], this.data[lIndex]) > 0) {
        changeIndex = lIndex;
      }
      while (rIndex < len && this.comparator(this.data[changeIndex], this.data[rIndex]) > 0) {
        changeIndex = rIndex;
      }
      if (changeIndex !== index) {
        this._swap(changeIndex, index);
        index = changeIndex;
      }else {
        break;
      }
    }
  }
  _shiftUp(index) {
    while (index > 0) {
      const parentIndex = index - 1 >> 1;
      if (this.comparator(this.data[parentIndex], this.data[index]) > 0) {
        this._swap(parentIndex, index);
        index = parentIndex;
      }else {
        break;
      }
    }
  }
  peek() {
    return this.data[0];
  }
  pool() {
    if (this._size() === 0) return undefined;
    const res = this.data[0];
    const last = this.data.pop();
    if (this._size() !== 0) {
      this.data[0] = last;
      this._shiftDown(0);
    }
    return res;
  }
  offer(value) {
    this.data.push(value);
    this._shiftUp(this._size() - 1);
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
    super(data, (a, b) => b - a);
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