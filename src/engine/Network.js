import Wire from "./patches/Wire";

class Network {
  constructor() {
    this.patches = [];
    this.wires = new Map();
  }

  addPatch(patch) {
    this.patches.push(patch);
  }

  deletePatch(patch) {
    for (let wires of patch.inports.values()) {
      for (let wire of wires) {
        this.deleteWire(wire.id);
      }
    }
    for (let wires of patch.outports.values()) {
      for (let wire of wires) {
        this.deleteWire(wire.id);
      }
    }
    const i = this.patches.indexOf(patch);
    this.patches.splice(i, 1);
  }

  wirePatches(fromPatch, outport, toPatch, inport) {
    let wire = new Wire(fromPatch, outport, toPatch, inport);
    fromPatch.addWireFrom(outport, wire);
    toPatch.addWireTo(inport, wire);
    this.wires.set(wire.id, wire);
  }

  deleteWire(id) {
    const wire = this.wires.get(id);
    this.wires.delete(id);
    wire.fromPatch.removeWireFrom(wire.fromOutport, wire);
    wire.toPatch.removeWireTo(wire.toInport, wire);
  }

  execute() {
    // Patches without any inputs are executed first
    let executionQueue = [];
    for (let patch of this.patches) {
      // Ensure clean state
      patch.clearInports();
      if (patch.canReceive()) {
        executionQueue.push(patch);
      }
    }

    console.debug(`Beginning execution with ${executionQueue.length} patches`);
    const start = new Date();

    while (executionQueue.length > 0) {
      const elapsed = new Date() - start;
      if (elapsed > 10 * 1000) {
        console.warn('Execution taking longer than 10s. Halting prematurely.');
        break;
      }

      const patch = executionQueue.shift();
      if (!patch.canReceive()) {
        console.warn(`Patch ${patch.id} was not ready to execute.`);
        continue;
      }

      patch.execute();

      // TODO end execution early if patch was an Output patch

      for (let wires of patch.outports.values()) {
        for (let wire of wires) {
          let nextPatch = wire.toPatch;
          // TODO don't enqueue same nextPatch twice per execution
          if (nextPatch.canReceive()) {
            executionQueue.push(nextPatch);
          }
        }
      }
    }

    const elapsed = new Date() - start;
    console.debug(`Completed execution in ${elapsed} ms`);
  }
}

export default Network;
