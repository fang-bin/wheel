/**
 * 排序算法
 * comparator 和 Array.prototype.sort 方法一致，comparator < 0 不交换位置，comparator > 0 交换位置
 */

/**
 * @description 冒泡排序
 * @author fangbin
 * @param {*} arr
 * @param {*} [comparator=(a, b) => a - b]
 * @returns 排序后的数组（原地交换）
 */
function bubbleSort (arr, comparator = (a, b) => a - b){
  if (!Array.isArray(arr)) throw new TypeError(`${arr} must be an array`);
  const len = arr.length;
  if (len < 2) return arr;
  let j = len - 1,
    posi = 0;
  while (j > 0) {
    posi = 0;
    for (let i = 0; i < j; i++) {
      if (comparator(arr[i], arr[i + 1]) > 0) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        posi = i;
      }
    }
    j = posi;
  }
  return arr;
}

/**
 * @description 选择排序
 * @author fangbin
 * @param {*} arr
 * @param {*} [comparator=(a, b) => a - b]
 * @returns 排序后的数组（原地交换）
 */
function selectSort (arr, comparator = (a, b) => a - b){
  if (!Array.isArray(arr)) throw new TypeError(`${arr} must be an array`);
  const len = arr.length;
  if (len < 2) return arr;
  let sortIndex = 0;
  for (let i = 0; i < len - 1; i++) {
    sortIndex = i;
    for (let j = i + 1; j < len; j++) {
      if (comparator(arr[sortIndex], arr[j]) > 0) sortIndex = j;
    }
    if (sortIndex !== i) {
      [arr[sortIndex], arr[i]] = [arr[i], arr[sortIndex]];
    }
  }
  return arr;
}

/**
 * @description 插入排序
 * @author fangbin
 * @param {*} arr
 * @param {*} [comparator=(a, b) => a - b]
 * @returns 排序后的数组（原地交换）
 */
function insertSort (arr, comparator = (a, b) => a - b){
  if (!Array.isArray(arr)) throw new TypeError(`${arr} must be an array`);
  const len = arr.length;
  if (len < 2) return arr;
  let j = 0, l = 0, r = 0, mid = 0, temp = 0;
  for (let i = 1; i < len; i++) {
    j = i;
    l = 0;
    r = i - 1;
    temp = arr[i];
    while (l <= r) {
      mid = ~~((l + r) / 2);
      if (comparator(arr[mid], temp) > 0) {
        r = mid - 1;
      }else {
        l = mid + 1;
      }
    }
    while (j > l) {
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = temp;
  }
  return arr;
}

/**
 * @description 归并排序
 * @author fangbin
 * @param {*} arr
 * @param {*} [comparator=(a, b) => a - b]
 * @returns 排序后的数组（原地交换）
 */
function mergeSort (arr, comparator = (a, b) => a - b){
  if (!Array.isArray(arr)) throw new TypeError(`${arr} must be an array`);
  const len = arr.length;
  if (len < 2) return arr;
  const merge = (l, r) => {
    const res = [];
    while (l.length && r.length) {
      if (comparator(l[0], r[0]) > 0) {
        res.push(r.shift());
      }else {
        res.push(l.shift());
      }
    }
    l.length && res.push(...l);
    r.length && res.push(...r);
    return res;
  }
  const mergeSplit = arr => {
    if (arr.length === 1) return arr;
    const mid = ~~(arr.length / 2);
    const l = arr.slice(0, mid);
    const r = arr.slice(mid);
    return merge(mergeSplit(l), mergeSplit(r));
  }
  return mergeSplit(arr);
}

/**
 * @description 快速排序
 * @author fangbin
 * @param {*} arr
 * @param {*} [comparator=(a, b) => a - b]
 * @returns 排序后的数组（原地交换）
 */
function quickSort (arr, comparator = (a, b) => a - b){
  if (!Array.isArray(arr)) throw new TypeError(`${arr} must be an array`);
  const len = arr.length;
  if (len < 2) return arr;
  const parttion = (arr, s, e) => {
    const pivot = arr[s];
    while (true) {
      while (comparator(pivot, arr[s]) > 0) s++;
      while (comparator(arr[e], pivot) > 0) e--;
      if (s > e) return s - 1;
      else if (s === e) return s;
      else {
        [arr[s], arr[e]] = [arr[e], arr[s]];
        s++;
        e--;
      }
    }
  }
  const quick_sort = (arr, s, e) => {
    if (s >= e) return;
    const pivotIndex = parttion(arr, s, e);
    quick_sort(arr, s, pivotIndex);
    quick_sort(arr, pivotIndex + 1, e);
    return arr;
  }
  return quick_sort(arr, 0, len - 1);
}

/**
 * @description 堆排序
 * @author fangbin
 * @param {*} arr
 * @returns 排序后的数组（原地交换）
 */
function heapSort (arr){
  if (!Array.isArray(arr)) throw new TypeError(`${arr} must be an array`);
  const len = arr.length;
  if (len < 2) return arr;
  const shiftDown = (index, leng) => {
    while (true) {
      const lIndex = index * 2 + 1;
      const rIndex = index * 2 + 2;
      let changeIndex = index;
      if (lIndex < leng && comparator(arr[lIndex], arr[changeIndex]) > 0) {
        changeIndex = lIndex;
      }
      if (rIndex < leng && comparator(arr[rIndex], arr[changeIndex]) > 0) {
        changeIndex = rIndex;
      }
      if (changeIndex !== index) {
        [arr[changeIndex], arr[index]] = [arr[index], arr[changeIndex]];
        index = changeIndex;
      }else {
        break;
      }
    }
  }
  for (let i = ~~(len / 2); i >= 0; i--) {
    shiftDown(i, len);
  }
  for (let i = len - 1; i >= 0; i--) {
    [arr[i], arr[0]] = [arr[0], arr[i]];
    shiftDown(0, i);
  }
  return arr;
}

/**
 * @description Timsort 
 * v8 Array.prototype.sort 使用的排序算法 归并排序做了大量优化的版本
 * @author fangbin
 * @param {*} arr
 * @returns 排序后的数组（原地交换）
 */
function timSort (arr){
  if (!Array.isArray(arr)) throw new TypeError(`${arr} must be an array`);
  const len = arr.length;
  if (len < 2) return arr;
  return arr;
}

export default {
  bubbleSort,
  selectSort,
  insertSort,
  mergeSort,
  quickSort,
  heapSort,
  timSort,
};

export {
  bubbleSort,
  selectSort,
  insertSort,
  mergeSort,
  quickSort,
  heapSort,
  timSort,
};