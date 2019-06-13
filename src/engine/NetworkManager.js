import Network from './Network';

class NetworkManager {
  constructor(patchRegistry) {
    this.patchRegistry = patchRegistry;
    this.network = new Network();
    this.patchMeta = new Map();
  }

  addPatch(patchClass, position, properties = {}) {
    const patch = new patchClass(properties);
    this.network.addPatch(patch);
    this.patchMeta.set(patch.id, {});
    this.updatePatch(patch.id, { position });
    return patch;
  }

  // Only updates meta, other fields ignored
  updatePatch(id, fields) {
    const meta = this.patchMeta.get(id);
    if (fields.position) {
      meta.position = fields.position;
    }
  }

  toggleStickiness(patchId, inputPort) {
    this.network.toggleStickiness(patchId, inputPort);
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
      const entry = this.network.patches.get(id);
      const patch = entry.patch;
      patches.push({
        id: id,
        name: patch.displayName,
        // TODO copy queues so they aren't mutated?
        // What if a Component accidentally mutates this?
        // More likely, what if the Patch adds another input to itself?
        inputs: patch.inputNames,
        stickyInputs: entry.stickyInputs,
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
