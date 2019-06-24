import React, { Component } from 'react';

import PhotoDisplay from './PhotoDisplay';

class App extends Component {
  constructor() {
    super();
    this.state = {}
  }



  render() {
    return (
      <div className={`app`}>
        <PhotoDisplay />
      </div>
    )
  }
}

export default App;