'use strict';

class Component {
  constructor(inputNames, outputNames) {
    this.inputNames = inputNames;
    this.outputNames = outputNames;
  }

  receive(inputs) {
    // Should be implemented in subclasses
  }
}

class AddComponent extends Component {
  constructor() {
    super(['element1', 'element2'], ['sum']);
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

class LogComponent extends Component {
  constructor() {
    super(['message'], []);
  }

  receive(inputs) {
    if (inputs.get('message').length) {
      console.log(inputs.get('message').shift());
    }
  }
}

// Emits a preset value, a preset number of times
class SupplierComponent extends Component {
  constructor(value, times) {
    super([], ['value']);
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

class Network {
  constructor() {
    // Array of all components in the network
    this.components = [];

    // 2D map of [component][inputName] to message queue
    this.inputQueues = new Map();
    // 2D map of [component][outputName] to an array of message queues
    this.outputQueues = new Map();
  }

  addComponent(component) {
    this.components.push(component);
    // Create an empty queue for each inport
    this.inputQueues.set(component, new Map());
    for (let inputName of component.inputNames) {
      // Create an empty queue
      this.inputQueues.get(component).set(inputName, []);
    }
    // init outputs
    this.outputQueues.set(component, new Map());
    for (let outputName of component.outputNames) {
      // Create an empty array of queues, not queues themselves
      this.outputQueues.get(component).set(outputName, []);
    }
  }

  wireComponents(fromComp, fromPort, toComp, toPort) {
    let inputQueue = this.inputQueues.get(toComp).get(toPort);
    this.outputQueues.get(fromComp).get(fromPort).push(inputQueue);
  }

  step() {
    for(let component of this.components) {
      let inputs = this.inputQueues.get(component);
      let outputs = component.receive(inputs);

      if (!outputs) {
        outputs = new Map();
      }

      console.log(`> ${component.constructor.name} received (${[...inputs]}), \
resulting in (${[...outputs]})`);

      for (let [ outputName, value ] of outputs) {
        let connections = this.outputQueues.get(component).get(outputName);
        for (let queue of connections) {
          queue.push(value);
        }
      }
    }
  }
}
