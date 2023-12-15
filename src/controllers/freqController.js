const Turma = require('../models/TurmaModel')
const Matriculas = require('../models/MatriculaModel')
const Frequencia = require('../models/turmaFrequenciaModel')

exports.sjIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');
  const alunos = await Matriculas.buscaMatriculas();
  const turma = await Turma.buscaPorId(req.params.id);
  if(!turma) return res.render('404');

  res.render('segunda-janeiro', { user: req.session.user, turma, alunos });
};

exports.register = async function(req, res) {
  // Aqui, você precisa criar arrays com base nos valores dos selects
  const dia1 = [req.body.aluno11, req.body.aluno21, ];
  const dia2 =  [req.body.aluno12, req.body.aluno22, ];
  const dia3 =  [req.body.aluno13, req.body.aluno23, ];
  const dia4 =  [req.body.aluno14, req.body.aluno24, ];
  const dia5 =  [req.body.aluno15, req.body.aluno25, ];

  const frequenciaData = {
    cursoTurma: req.body.cursoTurma,
    codTurma: req.body.codTurma,
    mes: req.body.mes,
    dia1: dia1,
    dia2: dia2,
    dia3: dia3,
    dia4: dia4,
    dia5: dia5,
  };

  console.log('Frequencia Data:', frequenciaData);

  const frequencia = new Frequencia(frequenciaData);

  try {
    await frequencia.register();
    if (frequencia.errors.length > 0) {
      req.flash('errors', frequencia.errors);
      req.session.save(function () {
        return res.redirect('/');
      });
      return;
    }

    req.flash('success', 'Frquência atualizada com sucesso');
    req.session.save(function () {
      return res.redirect(`/turma/frequencia/update/${frequencia.frequencia.id}`);
    });
  } catch(e) {
    console.log(e)
    return res.render('404')
  }

};

exports.atualizar = async function (req, res) {

  if (!req.params.id) return res.render('404');
  const frequencia = await Frequencia.buscaPorId(req.params.id);
  const turmas = await Turma.buscaTurmas();
  const alunos = await Matriculas.buscaMatriculas();
  if (!frequencia) return res.render('404');
  res.render('segunda-janeiro', { user: req.session.user, turmas, alunos });
};


