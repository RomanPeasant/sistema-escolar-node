const Login = require('../models/LoginModel')
const Turmas = require('../models/TurmaModel')

exports.loadIndex = async(req, res) => {
  const turmas = await Turmas.buscaTurmas();
  res.render('index', {user: req.session.user, turmas})
};


