// TEST
let net = new Network();
let supplier1 = new SupplierComponent(10, 1);
let supplier2 = new SupplierComponent(7, 1);
let adder = new AddComponent();
let logger = new LogComponent();

net.addComponent(supplier1);
net.addComponent(supplier2);
net.addComponent(adder);
net.addComponent(logger);

net.wireComponents(supplier1, 'value', adder, 'element1');
net.wireComponents(supplier2, 'value', adder, 'element2');
net.wireComponents(adder, 'sum', logger, 'message');

net.step();
