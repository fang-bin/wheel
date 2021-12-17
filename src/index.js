import React, { useState, useLayoutEffect, useEffect, } from '../react';
import './index.less';

/**@jsx React.createElement */
const Box = props => {
  const { count, children, } = props;
  useLayoutEffect(() => {
    console.log('box');
  }, []);
  useLayoutEffect(() => {
    console.log('box1');
  }, []);
  useEffect(() => {
    console.log('effect box');
  }, []);
  return (
    <div>
      <div className="box">
        点击的次数为: {count}
      </div>
      {children}
    </div>
  )
}

const App = () => {
  const [count, setCount] = useState(0);
  const list = [1,2,3,4,5];

  const clickEvent = () => {
    console.log('点击了');
    setCount(prev => prev + 1);
  }

  useLayoutEffect(() => {
    console.log('count数据变动为:' + count);
  }, [count]);

  useLayoutEffect(() => {
    setCount(10);
    console.log('变化了没', count)
    console.log('app');
  }, []);

  useEffect(() => {
    console.log('effect app');
  }, []);

  return (
    <div className="app">
      <Box count={count}>
        测试组件
      </Box>
      <div className="btn" onClick={clickEvent}>点击+1</div>
      <div className="list-wrap">
        {
          list.map(e => <div className="list-item" style={{ textAlign: 'center', color: '#f00', }}>列表项{e}</div>)
        }
      </div>
    </div>
  )
}

React.render(<App />, document.querySelector('#app'));