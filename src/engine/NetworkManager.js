import Network from './Network';

class NetworkManager {
  constructor(patchRegistry) {
    this.patchRegistry = patchRegistry;
    this.network = new Network();
    this.patchMeta = new Map();
  }

  addPatch(patchClass, position) {
    const patch = new patchClass();
    this.network.addPatch(patch);
    this.patchMeta.set(patch.id, { position });
    return patch;
  }

  // Only updates meta, other fields ignored
  updatePatch(id, fields) {
    const meta = this.patchMeta.get(id);
    if (fields.position) {
      meta.position = fields.position;
    }
  }

  deletePatch(id) {
    this.patchMeta.delete(id);
    this.network.deletePatch(id);
  }

  addWire(fromPatchId, fromPort, toPatchId, toPort) {
    this.network.wirePatches(fromPatchId, fromPort, toPatchId, toPort);
  }

  deleteWire(id) {
    this.network.deleteWire(id);
  }

  getModel() {
    const patches = [];
    for (let [ id, meta ] of this.patchMeta) {
      const patch = this.network.patches.get(id).patch;
      patches.push({
        id: id,
        name: patch.displayName,
        // TODO copy queues so they aren't mutated?
        // What if a Component accidentally mutates this?
        // More likely, what if the Patch adds another input to itself?
        inputs: patch.inputNames,
        outputs: patch.outputNames,
        position: meta.position
      });
    }

    const wires = this.network.patchConnections.map((c) => ({
      id: c.id,
      fromPatch: c.fromPatch,
      fromPort: c.fromPort,
      toPatch: c.toPatch,
      toPort: c.toPort
    }));

    return {
      patches,
      wires
    };
  }

  execute() {
    this.network.execute();
  }
}

export default NetworkManager;
