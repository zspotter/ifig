import React from 'react';
import Workspace from './Workspace';

import * as BasicPatches from './engine/patches/BasicPatches';
import NetworkManager from './engine/NetworkManager';
import PatchRegistry from './engine/PatchRegistry';

const NETWORK_MANAGER = new NetworkManager(
  new PatchRegistry([
    BasicPatches.AddPatch,
    BasicPatches.MultiplyPatch,
    BasicPatches.SignPatch,
    BasicPatches.GatePatch,
    BasicPatches.NoopPatch,
    BasicPatches.LogPatch,
    BasicPatches.FloatPatch,
    BasicPatches.PopPatch,
    BasicPatches.AppendPatch,
    BasicPatches.JsFunctionPatch,
  ])
);

// Set up demo network
(function () {
  const s1 = NETWORK_MANAGER.addPatch(BasicPatches.FloatPatch, { x: 100, y: 150 });
  const s2 = NETWORK_MANAGER.addPatch(BasicPatches.FloatPatch, { x: 120, y: 500 });
  const a1 = NETWORK_MANAGER.addPatch(BasicPatches.AddPatch, { x: 400, y: 300 });
  const l1 = NETWORK_MANAGER.addPatch(BasicPatches.LogPatch, { x: 600, y: 300 });
  NETWORK_MANAGER.addWire(s1.id, 'value', a1.id, 'in1');
  NETWORK_MANAGER.addWire(s2.id, 'value', a1.id, 'in2');
  NETWORK_MANAGER.addWire(a1.id, 'sum', l1.id, 'message');
})();

function App() {
  return (
    <div className="App">
      <h1 className="App-header">
        Ifig Editor
      </h1>
      <Workspace network={NETWORK_MANAGER} />
    </div>
  );
}

export default App;
