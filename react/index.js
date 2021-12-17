export default {
  createElement,
  render,
  useState,
  useLayoutEffect,
  useEffect,
}

export {
  createElement,
  render,
  useState,
  useLayoutEffect,
  useEffect,
}

let nextUnitOfWork = null,
  deletions = null,
  wipRoot = null,
  currentRoot = null,
  hookIndex = null,
  wipFiber = null,
  layoutEffects = null,
  effects = null;
;

function createElement (type, props, ...children){
  return {
    type,
    props: {
      ...props,
      children: children.map(child => typeof child === 'object' ? child : createTextElement(child)),
    },
  };
}

function createTextElement (text){
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function commitDelete (domParent, fiber){
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  }else {
    return commitDelete(domParent, fiber.child);
  }
}

function cancelEffects (fiber, tag){
  if (!fiber.hooks) return;
  fiber.hooks.filter(
    hook => hook.tag === tag && hook.cancel
  ).forEach(effectHook => {
    effectHook.cancel?.();
  });
}

function runEffects (fiber, tag){
  if (!fiber.hooks) return;
  let effectStack = tag === 'LAYOUT_EFFECT' ? layoutEffects : effects;
  fiber.hooks.filter(
    hook => hook.tag === tag && hook.effect
  ).reverse().forEach(effectHook => {
    effectStack.unshift(effectHook);
  });
}

function commitWork (fiber){
  if (!fiber) return;
  let parentFiber = fiber.parent;
  while (!parentFiber.dom) parentFiber = parentFiber.parent;
  const domParent = parentFiber.dom;

  if (fiber.effectTag === 'UPDATE') {
    cancelEffects(fiber, 'LAYOUT_EFFECT');
    runEffects(fiber, 'LAYOUT_EFFECT');
    runEffects(fiber, 'EFFECT');
    if (fiber.dom) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    }
  }else if (fiber.effectTag === 'PLACEMENT') {
    runEffects(fiber, 'LAYOUT_EFFECT');
    runEffects(fiber, 'EFFECT');
    if (fiber.dom) {
      domParent.appendChild(fiber.dom);
    }
  }else if (fiber.effectTag === 'DELETION') {
    cancelEffects(fiber, 'LAYOUT_EFFECT');
    commitDelete(domParent, fiber);
    return;
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRoot (){
  deletions.forEach(commitWork);
  currentRoot = wipRoot;
  commitWork(wipRoot.child);
  wipRoot = null;
  layoutEffects.forEach(effectHook => {
    effectHook.cancel = effectHook?.effect?.();
  });

  requestIdleCallback(() => {
    effects.forEach(effectHook => {
      effectHook.cancel = effectHook?.effect?.();
    });
  });
}

function reconcileChildren (wipFiber, elements){
  let oldFiber = wipFiber?.alternate?.child,
    index = 0,
    nextSibling = null;
  while (index < elements.length || oldFiber) {
    const element = elements[index];
    let newFiber = null;
    const sameType = element && oldFiber && element.type === oldFiber.type;
    if (sameType) {
      newFiber = {
        type: element.type,
        dom: oldFiber.dom,
        props: element.props,
        alternate: oldFiber,
        parent: wipFiber,
        effectTag: 'UPDATE',
      };
    }
    if (!sameType && element) {
      newFiber = {
        type: element.type,
        dom: null,
        props: element.props,
        alternate: null,
        parent: wipFiber,
        effectTag: 'PLACEMENT',
      };
    }
    if (!sameType && oldFiber) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    }else {
      nextSibling.sibling = newFiber;
    }
    nextSibling = newFiber;

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    index++;
  }
}

function transformDomStyle (dom, styles){
  dom.style = Object.keys(styles).reduce((acc, key) => {
    const styleProperty = key.replace(/[A-Z]/, v => `-${v.toLowerCase()}`);
    acc += `${styleProperty}: ${styles[key]};`;
    return acc;
  }, '');
}

function updateDom (dom, prevProps, nextProps){
  const isEvent = key => key.startsWith('on');
  const isProperty = key => key !== 'children' && !isEvent(key);
  const isOld = key => !Reflect.has(nextProps, key);
  const isNew = key => !Object.is(nextProps[key], prevProps[key]);

  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => isOld(key) || isNew(key))
    .forEach(name => {
      const typeName = name.toLowerCase().slice(2);
      dom.removeEventListener(typeName, prevProps[name]);
    });

  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isOld)
    .forEach(name => {
      dom[name] = '';
    });
  
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew)
    .forEach(name => {
      if (name === 'style') transformDomStyle(dom, nextProps.style);
      else dom[name] = nextProps[name];
    });

  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew)
    .forEach(name => {
      const typeName = name.toLowerCase().slice(2);
      dom.addEventListener(typeName, nextProps[name]);
    })
}

function createDom (fiber){
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

function updateHostComponent (fiber){
  if (!fiber.dom) fiber.dom = createDom(fiber);
  reconcileChildren(fiber, fiber.props.children.flat())
}

function compareDepsChanged (prevDeps, nextDeps){
  return !nextDeps || !prevDeps || nextDeps.length !== prevDeps.length || prevDeps.some((dep, index) => !Object.is(dep, nextDeps[index]));
}

function useLayoutEffect (effect, deps){
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];
  const hasChanged = compareDepsChanged(oldHook ? oldHook.deps : undefined, deps);
  const hook = {
    tag: 'LAYOUT_EFFECT',
    effect: hasChanged ? effect : null,
    cancel: hasChanged && oldHook?.cancel,
    deps,
  };
  wipFiber.hooks.push(hook);
  hookIndex++;
}

function useEffect (effect, deps){
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];
  const hasChanged = compareDepsChanged(oldHook ? oldHook.deps : undefined, deps);
  const hook = {
    tag: 'EFFECT',
    effect: hasChanged ? effect : null,
    cancel: hasChanged && oldHook?.cancel,
    deps,
  };
  wipFiber.hooks.push(hook);
  hookIndex++;
}

function useState (action){
  const oldHook = wipFiber?.alternate?.hooks?.[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : (Function.prototype.isPrototypeOf(action) ? action() : action),
    queue: [],
  };
  const actions = oldHook?.queue ?? [];
  actions.forEach(act => {
    hook.state = Function.prototype.isPrototypeOf(act) ? act(hook.state) : act;
  });
  function setState (act){
    hook.queue.push(act);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
    layoutEffects = [];
  }
  hookIndex++;
  wipFiber.hooks.push(hook);
  return [hook.state, setState];
}

function updateFunctionComponent (fiber){
  hookIndex = 0;
  wipFiber = fiber;
  wipFiber.hooks = [];
  const elements = fiber.type(fiber.props);
  reconcileChildren(fiber, [elements]);
}

function performUnitOfWork (fiber){
  if (Function.prototype.isPrototypeOf(fiber.type)) updateFunctionComponent(fiber);
  else updateHostComponent(fiber);

  if (fiber.child) return fiber.child;
  let prevFiber = fiber;
  while (prevFiber) {
    if (prevFiber.sibling) return prevFiber.sibling;
    prevFiber = prevFiber.parent;
  }
}

function workLoop (deadline){
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function render (element, container){
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
  layoutEffects = [];
  effects = [];
}