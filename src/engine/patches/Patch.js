import uuid from 'uuid/v4';

class Patch {
  constructor(name, inputs, outputs) {
    this.id = `${uuid()}(${name})`;
    this.displayName = name;

    this.inports = new Map();
    inputs.forEach(name => this.inports.set(name, new Set()));

    this.outports = new Map();
    outputs.forEach(name => this.outports.set(name, new Set()));
  }

  receive() {
    throw new Error('Not implemented');
  }

  execute() {
    if (!this.canReceive()) {
      throw new Error("Cannot receive");
    }
    let values = {};
    for (let [key, wires] of this.inports) {
      for (let wire of wires) {
        if (wire.canGive()) {
          values[key] = wire.give();
          break;
        }
      }
    }

    let results = this.receive(values);

    console.debug(`Executed ${this.displayName} `
      + `with inports ${JSON.stringify(values)} `
      + `resulted in ${JSON.stringify(results)}`);

    // Send all results to all connected outport wires
    for (let outport in results) {
      const value = results[outport];
      if (value === undefined) {
        continue;
      }

      for (let wire of this.outports.get(outport).values()) {
        wire.hold(value);
      }
    }
  }

  canReceive() {
    // At least 1 wire from each inport must be able to give
    for (let wires of this.inports.values()) {
      let canGive = false;
      for (let wire of wires) {
        if (wire.canGive()) {
          canGive = true;
          break;
        }
      }
      if (!canGive) {
        return false;
      }
    }
    return true;
  }

  // Sets stickiness of all wires connected to an inport
  setInportStickiness(inport, isSticky) {
    for (let wire of this.inports.get(inport)) {
      wire.isSticky = isSticky;
    }
  }

  addWireTo(inport, wire) {
    if (!this.inports.has(inport)) {
      throw new Error(`No known inport ${inport}`);
    }
    this.inports.get(inport).add(wire);
  }

  removeWireTo(inport, wire) {
    if (!this.inports.has(inport)) {
      throw new Error(`No known inport ${inport}`);
    }
    this.inports.get(inport).delete(wire);
  }

  addWireFrom(outport, wire) {
    if (!this.outports.has(outport)) {
      throw new Error(`No known outport ${outport}`);
    }
    this.outports.get(outport).add(wire);
  }

  removeWireFrom(outport, wire) {
    if (!this.outports.has(outport)) {
      throw new Error(`No known outport ${outport}`);
    }
    this.outports.get(outport).delete(wire);
  }

  clearInports() {
    for (let wireBunch of this.inports.values()) {
      for (let wire of wireBunch) {
        if (wire.canGive()) {
          wire.give();
        }
      }
    }
  }
}

export default Patch;
