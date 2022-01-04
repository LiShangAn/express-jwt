const test = (req, res, next) => {
  console.log('test');
  next();
};

module.exports = test
;