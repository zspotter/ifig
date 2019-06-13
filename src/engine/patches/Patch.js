import uuid from 'uuid/v4';

class Patch {
  constructor(name, inputs, outputs) {
    this.id = `${uuid()}(${name})`;
    this.displayName = name;
    this.inputNames = inputs;
    this.outputNames = outputs;
  }

  receive() {
    throw new Error('Not implemented');
  }
}

export default Patch;
