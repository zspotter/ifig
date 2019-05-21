import React from 'react';
import { Workspace, SAMPLE_STATE } from './Workspace';

function App() {
  return (
    <div className="App">
      <h1 className="App-header">
        Flowtur Editor
      </h1>
      <Workspace network={SAMPLE_STATE} />
    </div>
  );
}

export default App;
