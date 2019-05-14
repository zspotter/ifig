// TEST
let net = new Network();
let adder = new AddComponent();
let logger = new LogComponent();
net.addComponent(adder);
net.addComponent(logger);
net.wireComponents(adder, 'sum', logger, 'message');

net.inputQueues.get(adder).get('element1').push(10);
net.inputQueues.get(adder).get('element2').push(7);

net.step();
