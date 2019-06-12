import Patch from './Patch';

class AddPatch extends Patch {
  constructor() {
    super('Add', ['in1', 'in2'], ['sum']);
  }

  receive({in1, in2}) {
    return {'sum': in1 + in2};
  }
}
AddPatch.patchName = 'Add';

class MultiplyPatch extends Patch {
  constructor() {
    super('Multiply', ['in1', 'in2'], ['product']);
  }

  receive({in1, in2}) {
    return {'product': in1 * in2};
  }
}
MultiplyPatch.patchName = 'Multiply';

class SignPatch extends Patch {
  constructor() {
    super('Sign', ['value'], ['positive', 'zero', 'negative']);
  }

  receive({value}) {
    if (value > 0) {
      return {'positive': value};
    } else if (value === 0) {
      return {'zero': value};
    } else if (value < 0) {
      return {'negative': value};
    }
    // Else, NaN
    // TODO trigger some error?
  }
}
SignPatch.patchName = 'Sign';

class GatePatch extends Patch {
  constructor() {
    super('Gate', ['trigger', 'value'], ['value']);
  }

  receive({trigger, value}) {
    return {'value': value};
  }
}
GatePatch.patchName = 'Gate';

class NoopPatch extends Patch {
  constructor() {
    super('Noop', ['value'], ['value']);
  }

  receive({value}) {
    return {'value': value};
  }
}
NoopPatch.patchName = 'Noop';

class LogPatch extends Patch {
  constructor() {
    super('Log', ['message'], []);
  }

  receive({message}) {
    console.log(message);
  }
}
LogPatch.patchName = 'Log';

// Emits a preset value once
class SupplyPatch extends Patch {
  constructor(value = 'Hello World') {
    super('Supply', [], ['value']);
    // TODO: Make properties editable in UI
    this.value = value;
  }

  receive() {
    return {'value': this.value};
  }
}
SupplyPatch.patchName = 'Supply';

export {
  AddPatch,
  MultiplyPatch,
  SignPatch,
  GatePatch,
  NoopPatch,
  LogPatch,
  SupplyPatch
};
