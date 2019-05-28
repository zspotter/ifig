class Network {
  constructor() {
    // Map of all patches by ID
    this.patches = new Map();

    // 2D map of [patchId][inputName] to message queue
    this.inputQueues = new Map();
    // 2D map of [patchId][outputName] to an array of message queues
    this.outputQueues = new Map();
    this.patchConnections = [];
  }

  addPatch(patch) {
    this.patches.set(patch.id, patch);
    // Create an empty queue for each inport
    this.inputQueues.set(patch.id, new Map());
    for (let inputName of patch.inputNames) {
      // Create an empty queue
      this.inputQueues.get(patch.id).set(inputName, []);
    }
    // init outputs
    this.outputQueues.set(patch.id, new Map());
    for (let outputName of patch.outputNames) {
      // Create an empty array of queues, not queues themselves
      this.outputQueues.get(patch.id).set(outputName, []);
    }
  }

  deletePatch(id) {
    this.inputQueues.delete(id);
    this.outputQueues.delete(id);
    this.patches.delete(id);
    this.patchConnections = this.patchConnections.filter((wire) =>
      wire.fromPatch !== id && wire.toPatch !== id);
  }

  wirePatches(fromPatch, fromPort, toPatch, toPort) {
    let inputQueue = this.inputQueues.get(toPatch.id).get(toPort);
    this.outputQueues.get(fromPatch.id).get(fromPort).push(inputQueue);
    this.patchConnections.push({
      id: `${fromPatch}.${fromPort}:${toPatch}.${toPort}`,
      fromPatch: fromPatch.id,
      fromPort: fromPort,
      toPatch: toPatch.id,
      toPort: toPort
    });
  }

  deleteWire(id) {
    this.patchConnections = this.patchConnections.filter((wire) => wire.id !== id);
  }

  step() {
    for(let [ , patch ] of this.patches) {
      let inputs = this.inputQueues.get(patch.id);
      let outputs = patch.receive(inputs);

      if (!outputs) {
        outputs = new Map();
      }

      console.log(`> ${patch.constructor.name} received (${[...inputs]}), \
resulting in (${[...outputs]})`);

      for (let [ outputName, value ] of outputs) {
        let connections = this.outputQueues.get(patch.id).get(outputName);
        for (let queue of connections) {
          queue.push(value);
        }
      }
    }
  }
}

export default Network;
