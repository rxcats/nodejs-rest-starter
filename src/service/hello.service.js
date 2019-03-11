exports.hello = async (name) => `hello ${name}`;

exports.helloError = async (name) => {
  throw new Error(`just error: ${name}`);
};
