/**
 * @description 字典树
 * @author fangbin
 * @class Trie
 * 字典树如果要实现删除功能，就必须对每个节点添加一个引用计数的属性，以后有时间再去实现
 */
class Trie {
  children = new Map();
  constructor(words = []) {
    this.insert(words);
  }
  /**
   * @description 添加单个词
   * @author fangbin
   * @param {*} word
   * @memberof Trie
   */
  insertWord(word) {
    let node = this.children;
    for (let w of word) {
      if (!node.get(w)) node.set(w, new Map());
      node = node.get(w);
    }
    node.isEnd = true;
  }
  /**
   * @description 添加单个或多个词
   * @author fangbin
   * @param {*} words
   * @memberof Trie
   */
  insert(...words) {
    for (let word of words) {
      this.insertWord(word);
    }
  }
  /**
   * @description 查找符合prefix前缀的节点
   * @author fangbin
   * @param {*} prefix
   * @returns {Map}
   * @memberof Trie
   */
  searchNode(prefix) {
    let node = this.children;
    for (let w of prefix) {
      if (!node.get(w)) return false;
      node = node.get(w);
    }
    return node;
  }
  /**
   * @description 是否有以prefix为前缀的词
   * @author fangbin
   * @param {*} prefix
   * @returns {boolean}
   * @memberof Trie
   */
  startsWith(prefix) {
    return !!this.searchNode(prefix);
  }
  /**
   * @description 查找是否有该词
   * @author fangbin
   * @param {*} word
   * @returns {boolean}
   * @memberof Trie
   */
  includesWord(word) {
    const node = this.searchNode(word);
    return node && node.isEnd === true;
  }
  /**
   * @description 查找所有前缀为prefix的词
   * @author fangbin
   * @param {*} prefix
   * @returns {array<string>}
   * @memberof Trie
   */
  searchPrefixWords(prefix) {
    let root = this.searchNode(prefix);
    let result = [];
    const traverse = (node, text) => {
      if (node.isEnd) result.push(text);
      for (let [w, nextNode] of node.entries()) {
        traverse(nextNode, text + w);
      }
    }
    traverse(root, prefix);
    return result;
  }
}

export default Trie;