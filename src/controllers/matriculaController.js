const Matricula = require('../models/MatriculaModel')
const Curso = require('../models/CursoModel')
const Turma = require('../models/TurmaModel')
const { PDFDocument } = require('pdf-lib');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const ejs = require('ejs');


exports.loadIndex = async (req, res) => {
  const cursos = await Curso.buscaCursos();
  const turmas = await Turma.buscaTurmas();
  res.render('matricula', { user: req.session.user, cursos, turmas, turmaSelect:['teste'] })
};


exports.register = async function (req, res) {
  try {
    const matricula = new Matricula(req.body);
    await matricula.register();

    if (matricula.errors.length > 0) {
      req.flash('errors', matricula.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Matricula registrada com sucesso.');
    req.session.save(() => res.redirect(`/matricula/consultar/${matricula.matricula.id}`));
    return;
  } catch (e) {
    console.log(e);

  }
};

exports.consultar = async function (req, res) {

  if (!req.params.id) return res.render('404');
  const aluno = await Matricula.buscaPorId(req.params.id);
  if (!aluno) return res.render('404');
  res.render('consultar', { user: req.session.user, aluno });
};

exports.pesquisar = async function (req, res) {
const pesquisa = req.query.pesquisa.toLowerCase();
  let aluno;

  // Verifica se a pesquisa é um número
  if (!isNaN(pesquisa)) {
    // Se for um número, busca por código de matrícula
    aluno = await Matricula.buscaPorCodigo(pesquisa);
  } else {
    // Se não for um número, busca por nome
    aluno = await Matricula.buscaPorNome(pesquisa);
  }

  if (!aluno) return res.render('404');
  res.render('consultar', { user: req.session.user, aluno });
};

exports.editIndex = async function(req, res) {
  if(!req.params.id) return res.render('404');
  const matricula = await Matricula.buscaPorId(req.params.id);
  const cursos = await Curso.buscaCursos();
  const turmas = await Turma.buscaTurmas();
  if(!matricula) return res.render('404');

  res.render('matricula-edit', { user: req.session.user,matricula, turmas, cursos });
};

exports.edit = async function(req, res) {
  try {
    if(!req.params.id) return res.render('404');
    console.log(req.body)
    const matricula = new Matricula(req.body);
    
    await matricula.edit(req.params.id);
    console.log(req.params.id)
    if(matricula.errors.length > 0) {
      req.flash('errors', matricula.errors);
      req.session.save(() => res.redirect('back'));
      return;
    }

    req.flash('success', 'Matricula editada com sucesso.');
    req.session.save(() => res.redirect(`/matricula/editar/${matricula.matricula._id}`));
    return;
  } catch(e) {
    console.log(e);
    res.render('404');
  }
};

exports.gerarPDF = async function(req, res) {
  const aluno = await Matricula.buscaPorId(req.params.id);
  const turmas = await Turma.buscaTurmas();

  // Renderize o novo arquivo EJS específico para o formato do PDF
  const html = await ejs.renderFile('./public/pdfFormat.ejs', { aluno,turmas });


  // Inicia o Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.waitForFunction('document.querySelector("body") !== null');
  // Gera o PDF a partir do HTML
  await page.setContent(html);
  const pdfPath = `./public/temp/${aluno.id}-matricula.pdf`;
  await page.pdf({ path: pdfPath, format: 'A4' });

  // Fecha o navegador Puppeteer
  await browser.close();

  // Envia o arquivo PDF como resposta
  res.download(pdfPath);

};

exports.teste = async function (req, res) {

  if (!req.params.id) return res.render('404');
  const aluno = await Matricula.buscaPorId(req.params.id);
  const turmas = await Turma.buscaTurmas();
  if (!aluno) return res.render('404');
  res.render('pdfFormat', { user: req.session.user, aluno, turmas });
};

exports.atualizarPagina = async function (req, res) {
  try {
    const cursoSelecionado = req.params.curso;
    let turmas = await Turma.buscaTurmasPorCurso(cursoSelecionado);

    // Adiciona a quantidade de alunos para cada turma
    turmas = await Promise.all(turmas.map(async (turma) => {
      const quantidadeAlunos = await Matricula.buscaPorTurmas(turma.codTurma);
      return { ...turma.toObject(), quantidadeAlunos };
    }));

    res.json(turmas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};
