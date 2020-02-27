import Network from '../Network';
import * as NetworkPatches from './NetworkPatches';
import * as BasicPatches from './BasicPatches';

function makeNetwork() {
    const n = new Network(),
        f = new BasicPatches.FloatPatch(),
        i = new NetworkPatches.InputPatch(),
        a = new BasicPatches.AddPatch(),
        m = new BasicPatches.MultiplyPatch(),
        s = new BasicPatches.SignPatch(),
        g = new BasicPatches.GatePatch(),
        o = new NetworkPatches.OutputPatch();

    [f, i, a, m, s, g, o].forEach(p => n.addPatch(p));

    f.updateProperties({ value: -1 });
    i.updateProperties({ portNames: 'n' });
    o.updateProperties({ portNames: 'factorial' });

    n.wirePatches(f, 'value', a, 'in1');
    n.wirePatches(i, 'n', a, 'in2');
    n.wirePatches(a, 'sum', s, 'value');
    n.wirePatches(i, 'n', m, 'in2');
    n.wirePatches(s, 'positive', a, 'in2');
    n.wirePatches(s, 'positive', m, 'in1');
    n.wirePatches(s, 'zero', g, 'trigger');
    n.wirePatches(m, 'product', m, 'in2');
    n.wirePatches(m, 'product', g, 'value');
    n.wirePatches(g, 'value', o, 'factorial');

    a.setInportStickiness('in1', true);

    return n;
}

class FactorialPatch extends NetworkPatches.NetworkPatch {
    constructor() {
        super('Factorial', makeNetwork());
    }
}
FactorialPatch.patchName = 'Factorial';

export { FactorialPatch };
