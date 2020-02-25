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
  const
    n = NETWORK_MANAGER,
    f1 = n.addPatch(BasicPatches.FloatPatch, { position: { x: 65, y: 181 }, properties: { value: -1 } }),
    f2 = n.addPatch(BasicPatches.FloatPatch, { position: { x: 68, y: 386 }, properties: { value: 5 } }),
    a = n.addPatch(BasicPatches.AddPatch, { position: { x: 266, y: 207 } }),
    m = n.addPatch(BasicPatches.MultiplyPatch, { position: { x: 306, y: 395 } }),
    s = n.addPatch(BasicPatches.SignPatch, { position: { x: 459, y: 224 } }),
    g = n.addPatch(BasicPatches.GatePatch, { position: { x: 613, y: 413 } }),
    l = n.addPatch(BasicPatches.LogPatch, { position: { x: 818, y: 434 } });
  n.addWire(f1.id, 'value', a.id, 'in1');
  n.addWire(f2.id, 'value', a.id, 'in2');
  n.addWire(a.id, 'sum', s.id, 'value');
  n.addWire(f2.id, 'value', m.id, 'in2');
  n.addWire(s.id, 'positive', a.id, 'in2');
  n.addWire(s.id, 'positive', m.id, 'in1');
  n.addWire(s.id, 'zero', g.id, 'trigger');
  n.addWire(m.id, 'product', m.id, 'in2');
  n.addWire(m.id, 'product', g.id, 'value');
  n.addWire(g.id, 'value', l.id, 'message');
  n.toggleStickiness(a.id, 'in1');
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
