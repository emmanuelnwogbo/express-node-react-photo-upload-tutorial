import React, { Component } from 'react';

import Input from './Input';

class App extends Component {
  constructor() {
    super();
    this.state = {}
  }

  

  render() {
    return (
      <div className={`app`}>
        <Input />
      </div>
    )
  }
}

export default App;