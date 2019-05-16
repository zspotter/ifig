import React from 'react';
import { Workspace, SAMPLE_STATE } from './Workspace';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Flowtur Editor
      </header>
      <Workspace network={SAMPLE_STATE} />
    </div>
  );
}

export default App;
