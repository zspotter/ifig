import Network from './Network';

class NetworkManager {
  constructor(patchRegistry) {
    this.patchRegistry = patchRegistry;
    this.network = new Network();
    this.patchMeta = new Map();
  }

  addPatch(patchClass, properties) {
    const patch = new patchClass();
    this.network.addPatch(patch);
    this.patchMeta.set(patch.id, { patch: patch });
    this.updatePatch(patch.id, properties);
    return patch;
  }

  getPatch(id) {
    return this.patchMeta.get(id).patch;
  }

  // Updates meta and properties
  updatePatch(id, fields) {
    const meta = this.patchMeta.get(id);
    if (fields.properties) {
      meta.patch.updateProperties(fields.properties);
    }
    if (fields.position) {
      meta.position = fields.position;
    }
  }

  toggleStickiness(patchId, inputPort) {
    // NB: Not really happy with current modeling since each wire connected to a single inport
    // can technically have different stickiness, but users of this class see the inport itself
    // as having a stickiness quality
    const patch = this.patchMeta.get(patchId).patch;
    let isSticky = false;
    for (let wire of patch.inports.get(inputPort)) {
      if (wire.isSticky) {
        isSticky = true;
        break;
      }
    }
    patch.setInportStickiness(inputPort, !isSticky);
  }

  deletePatch(id) {
    const patch = this.patchMeta.get(id).patch;
    this.patchMeta.delete(id);
    this.network.deletePatch(patch);
  }

  addWire(fromPatchId, fromPort, toPatchId, toPort) {
    const fromPatch = this.patchMeta.get(fromPatchId).patch;
    const toPatch = this.patchMeta.get(toPatchId).patch;
    this.network.wirePatches(fromPatch, fromPort, toPatch, toPort);
  }

  deleteWire(id) {
    this.network.deleteWire(id);
  }

  getModel() {
    // TODO: Clean this junk up!!!
    const patches = [];
    for (let [ id, meta ] of this.patchMeta) {
      const patch = this.patchMeta.get(id).patch;
      const stickyInports = new Set();
      for (let [inport, wires] of patch.inports) {
        for (let wire of wires) {
          if (wire.isSticky) {
            stickyInports.add(inport);
            break;
          }
        }
      }
      patches.push({
        id: id,
        name: patch.displayName,
        inputs: [...patch.inports.keys()],
        stickyInputs: stickyInports,
        outputs: [...patch.outports.keys()],
        properties: patch.properties,
        position: meta.position
      });
    }

    const wires = [...this.network.wires.values()].map((c) => ({
      id: c.id,
      fromPatch: c.fromPatch.id,
      fromPort: c.fromOutport,
      toPatch: c.toPatch.id,
      toPort: c.toInport
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
