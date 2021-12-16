### 轮子的问题

1. 在轮子中，render阶段会遍历整棵树。相反，React 遵循一些提示和启发法来跳过没有任何变化的整个子树。(shouldComponentUpdate等)
2. 在轮子中，commit阶段会遍历整个树。React 则是保留一个链表，其中只包含有 effects 的fiber，并且只访问这些fiber。
3. 每次构建一个新的正在进行的工作树时，都会为每个fiber创建新对象。React 从之前的树中回收纤维。
4. 轮子 在渲染阶段收到新的更新时，它会丢弃正在进行的工作树并从根重新开始。React 用过期时间戳标记每个更新，并使用它来决定哪个更新具有更高的优先级。
5. React 的 reconciliation 会依赖启发性的 key 比对 fiber
6. useLayoutEffect 实现时机并不对，React 的 useLayoutEffect (包括 useEffect ) 会从最底层的子组件开始执行，一直到最外层组件。