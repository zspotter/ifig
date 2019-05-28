import Patch from './Patch';

class AddPatch extends Patch {
  constructor() {
    super('Add', ['element1', 'element2'], ['sum']);
  }

  receive(inputs) {
    if (!inputs.get('element1').length || !inputs.get('element2').length) {
      return;
    }

    let elem1 = inputs.get('element1').shift();
    let elem2 = inputs.get('element2').shift();
    let sum = elem1 + elem2;

    return new Map([['sum', sum]]);
  }
}
AddPatch.patchName = 'Add';

class LogPatch extends Patch {
  constructor() {
    super('Log', ['message'], []);
  }

  receive(inputs) {
    if (inputs.get('message').length) {
      console.log(inputs.get('message').shift());
    }
  }
}
LogPatch.patchName = 'Log';

// Emits a preset value, a preset number of times
class SupplyPatch extends Patch {
  constructor(value = 'Hello World', times = 10) {
    super('Supply', [], ['value']);
    // TODO: Make properties editable in UI
    this.value = value;
    this.times = times;
  }

  receive(inputs) {
    if (this.times > 0) {
      this.times -= 1;
      return new Map([['value', this.value]]);
    }
  }
}
SupplyPatch.patchName = 'Supply';

export { AddPatch, LogPatch, SupplyPatch };
