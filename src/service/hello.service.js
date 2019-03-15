module.exports.hello = async (name) => `hello ${name}`;

module.exports.helloError = async (name) => {
  throw new Error(`just error: ${name}`);
};
