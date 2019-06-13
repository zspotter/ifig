class Network {
  constructor() {
    // Example map:
    // {
    //   'patch-id' : {
    //     patch: <Patch>, // object
    //     inputs: {
    //       input1: undefined,
    //       input2: 'Hello World'
    //     },
    //     outputs: {
    //       output1: [
    //         ['to-patch1-id', 'to-patch1-port'],
    //         ['to-patch2-id', 'to-patch2-port']
    //       ]
    //     }
    //   }
    // }
    this.patches = new Map();
    this.patchConnections = [];
  }

  addPatch(patch) {
    const inputs = {};
    for (let input of patch.inputNames) {
      inputs[input] = undefined;
    }

    const outputs = {};
    for (let output of patch.outputNames) {
      outputs[output] = [];
    }

    this.patches.set(patch.id, {
      patch,
      inputs,
      outputs
    });
  }

  deletePatch(id) {
    this.patches.delete(id);
    // TODO clean up all outputs from patches connected to this
    for (let [ , entry] of this.patches) {
      for (let port in entry.outputs) {
        entry.outputs[port] = entry.outputs[port]
          .filter(([toPatch, ]) => toPatch !== id);
      }
    }

    this.patchConnections = this.patchConnections.filter((wire) =>
      wire.fromPatch !== id && wire.toPatch !== id);
  }

  wirePatches(fromPatchId, fromPort, toPatchId, toPort) {
    const entry = this.patches.get(fromPatchId);
    entry.outputs[fromPort].push([toPatchId, toPort]);

    this.patchConnections.push({
      id: `${fromPatchId}.${fromPort}:${toPatchId}.${toPort}`,
      fromPatch: fromPatchId,
      fromPort: fromPort,
      toPatch: toPatchId,
      toPort: toPort
    });
  }

  deleteWire(id) {
    let i = this.patchConnections.findIndex((wire) => wire.id === id);
    const wire = this.patchConnections[i];
    this.patchConnections.splice(i, 1);

    const patchOutputs = this.patches.get(wire.fromPatch).outputs[wire.fromPort];
    patchOutputs.splice(
      patchOutputs.findIndex((output) => output === [wire.toPatch, wire.toPort]),
      1);
  }

  canReceive(patchId) {
    return Object.values(this.patches.get(patchId).inputs)
      .every((val) => val !== undefined);
  }

  execute() {
    // Patches without any inputs are executed first
    let executionQueue = [];
    for (let [id, entry] of this.patches) {
      if (Object.keys(entry.inputs).length === 0) {
        executionQueue.push(id);
      }
    }

    console.debug(`Beginning execution with ${executionQueue.length} patches`);
    const start = new Date();

    while (executionQueue.length > 0) {
      const patchId = executionQueue.shift();
      if (!this.canReceive(patchId)) {
        console.warn(`Patch ${patchId} was not ready to execute.`);
        continue;
      }

      const entry = this.patches.get(patchId);

      const results = entry.patch.receive(entry.inputs);

      console.debug(`Executed ${entry.patch.displayName} `
        + `with inputs ${JSON.stringify(entry.inputs)} `
        + `resulted in ${JSON.stringify(results)}`);

      // Clear consumed inputs
      for (let port in entry.inputs) {
        entry.inputs[port] = undefined;
      }

      // TODO end execution early if patch was an Output patch

      if (results === undefined) {
        // Nothing to propogate. Connected patches are not triggered
        continue;
      }

      for (let outputPort in entry.outputs) {
        const value = results[outputPort];
        if (value === undefined) {
          continue;
        }

        // Copy value to connected patchs' inputs
        const connections = entry.outputs[outputPort];
        for (let [toPatchId, toPort] of connections) {
          this.patches.get(toPatchId).inputs[toPort] = value;
          // Enqueue connected patch for execution, if it is now ready
          if (this.canReceive(toPatchId)) {
            // TODO seems like it might be possible for the same patch to be enqueued twice
            executionQueue.push(toPatchId);
          }
        }
      }
    }

    const elapsed = new Date() - start;
    console.debug(`Completed execution in ${elapsed} ms`);
  }
}

export default Network;
