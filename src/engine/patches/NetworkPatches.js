import Patch from './Patch';

class InputPatch extends Patch {
  constructor() {
    super('Input', [], []);
    this.properties = { portNames: '' };
  }

  updateProperties(updated) {
    const names = updated.portNames
      .split(',')
      .map(field => field.trim())
      .filter(field => field.length > 0);

    if (names.length > 0) {
      this.properties.portNames = names.join(',');
      this.outports.clear();
      names.forEach(name => this.outports.set(name, new Set()));
    }
  }

  receive() {
    if (!this.values) {
      throw new Error('Input values not ready');
    }
    return this.values;
  }
}
InputPatch.patchName = 'Input';

class OutputPatch extends Patch {
  constructor() {
    super('Output', [], []);
    this.properties = { portNames: '' };
  }

  updateProperties(updated) {
    const names = updated.portNames
      .split(',')
      .map(field => field.trim())
      .filter(field => field.length > 0);

    if (names.length > 0) {
      this.properties.portNames = names.join(',');
      this.inports.clear();
      names.forEach(name => this.inports.set(name, new Set()));
    }
  }

  receive(values) {
    this.values = values;
  }
}
OutputPatch.patchName = 'Output';

class NetworkPatch extends Patch {
  constructor(name, network) {
    let inkeys = [];
    let outkeys = []; 
    if (network.inputPatch) {
      inkeys = [...network.inputPatch.outports.keys()];
    }
    if (network.outputPatch) {
      outkeys = [...network.outputPatch.inports.keys()];
    }

    super(name, inkeys, outkeys);
    this.network = network;
  }

  receive(inputs) {
    this.network.loadInports(inputs);
    this.network.execute();
    return this.network.exportOutports();
  }
}

export {
  InputPatch,
  OutputPatch,
  NetworkPatch
};

