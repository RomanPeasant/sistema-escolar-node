const Turma = require('../models/TurmaModel')
const Matriculas = require('../models/MatriculaModel')

exports.loadIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');
  const alunos = await Matriculas.buscaMatriculas();
  const turma = await Turma.buscaPorId(req.params.id);
  if(!turma) return res.render('404');

  res.render('turma', { user: req.session.user, turma, alunos });
};