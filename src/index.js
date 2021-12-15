import React, { useState, } from '../react';
import './index.less';

/**@jsx React.createElement */
const Box = props => {
  const { count, } = props;
  return (
    <div className="box">
      点击的次数为: {count}
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
  return (
    <div className="app">
      <Box count={count} />
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