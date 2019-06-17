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
  constructor(properties) {
    super('Supply', [], ['value']);
    this.value = properties.value !== undefined ? properties.value : 123;
    this.displayName = `Supply(${this.value})`;

  }

  receive() {
    return {'value': this.value};
  }
}
SupplyPatch.patchName = 'Supply';

class PopPatch extends Patch {
  constructor() {
    super('Pop', ['array'], ['head', 'tail']);
  }

  receive({array}) {
    if (array.length === 0) {
      // No head, no tail
      return;
    }
    return {
      head: array[0],
      tail: array.slice(1)
    };
  }
}
PopPatch.patchName = 'Pop';

class AppendPatch extends Patch {
  constructor() {
    super('Append', ['array', 'elem'], ['array']);
  }

  receive({array, elem}) {
    return {
      array: array.concat([elem])
    };
  }
}
AppendPatch.patchName = 'Append';

// Executes arbitrary JS in the global context. Potentially dangerous.
class JsFunctionPatch extends Patch {
  constructor(properties) {
    super('js/Function', [], ['result']);
    this.fncBody = properties.body || 'new Date()';
  }

  receive() {
    const fnc = new Function(`"use strict"; return (${this.fncBody});`);
    return { result: fnc() };
  }
}
JsFunctionPatch.patchName = 'js/Function';

export {
  AddPatch,
  MultiplyPatch,
  SignPatch,
  GatePatch,
  NoopPatch,
  LogPatch,
  SupplyPatch,
  PopPatch,
  AppendPatch,
  JsFunctionPatch,
};
