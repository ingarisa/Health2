const _pipe =
  (a, b) =>
  (...arg) =>
    b(a(...arg));

const pipe = (...ops) => ops.reduce(_pipe);

module.exports = pipe;