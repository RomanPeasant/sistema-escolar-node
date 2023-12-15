const Curso = require('../models/CursoModel')
const Turma = require('../models/TurmaModel')

exports.loadIndex = async(req, res) => {
  const cursos = await Curso.buscaCursos();
  res.render('admin', { user: req.session.user, cursos });
};

exports.registerCurso = async function (req, res) {
  try {
    const curso = new Curso(req.body);
    await curso.register();

    if(curso.errors.length > 0) {
      req.flash('errors', curso.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Curso registrado com sucesso.');
    req.session.save(() => res.redirect(`/admin/index/`));
    return;
  } catch(e) {
    console.log(e);

  }
};

exports.registerTurma = async function (req, res) {
  try {
    const turma = new Turma(req.body);
    await turma.register();

    if(turma.errors.length > 0) {
      req.flash('errors', turma.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Turma registrado com sucesso.');
    req.session.save(() => res.redirect(`/admin/index/`));
    return;
  } catch(e) {
    console.log(e);

  }
};

exports.editTurmaIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');
  const cursos = await Curso.buscaCursos();
  const turma = await Turma.buscaPorId(req.params.id);
  if(!turma) return res.render('404');

  res.render('turma-edit', { user: req.session.user, turma, cursos });
};

exports.editCursoIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const curso = await Curso.buscaPorId(req.params.id);
  if(!curso) return res.render('404');

  res.render('curso-edit', { user: req.session.user, curso });
};

exports.editTurma = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');
    console.log(req.body)
    const turma = new Turma(req.body);
    await turma.edit(req.params.id);

    if(turma.errors.length > 0) {
      req.flash('errors', turma.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Turma editada com sucesso.');
    req.session.save(() => res.redirect(`/admin/edit/turma/${turma.turma._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.editCurso = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');
    const curso = new Curso(req.body);
    await curso.edit(req.params.id);

    if(curso.errors.length > 0) {
      req.flash('errors', curso.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Curso editado com sucesso.');
    req.session.save(() => res.redirect(`/admin/edit/curso/index/${contato.contato._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.delete = async function(req, res) {
  if(!req.params.id) return res.render('404');

  const contato = await Contato.delete(req.params.id);
  if(!contato) return res.render('404');

  req.flash('success', 'Contato apagado com sucesso.');
  req.session.save(() => res.redirect('back'));
  return;
};