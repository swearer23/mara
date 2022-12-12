const Mara = require("../dist/mara.node.umd.js");
const mara = new Mara('mara', 'e1cd416bc6d0a5c1b99de7c0f6bb1cc2', {
  env: 'uat',
  appVersion: '1.0.0'
});

mara.setUser('demoUser')

mara.probe('test', {hello: 'world'})
throw Error('env 必传')

