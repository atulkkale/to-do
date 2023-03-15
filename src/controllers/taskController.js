exports.createTask = (req, res, next) => {
  res.send('create');
};

exports.updateTask = (req, res, next) => {
  res.send('update');
};

exports.getTasks = (req, res, next) => {
  res.send('get');
};

exports.rearrangeTasks = (req, res, next) => {
  res.send('rearrange');
};
