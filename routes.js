    const express = require('express');
    const route = express.Router();
    const homeController = require('./src/controllers/homeController');
    const loginControler = require('./src/controllers/loginControler');
    const contatoController = require('./src/controllers/contatoController');
    const matriculaController = require('./src/controllers/matriculaController');
    const AdminController = require('./src/controllers/AdminController');
    const turmaController = require('./src/controllers/turmaController');
    const freqController = require('./src/controllers/freqController');

    const { loginRequired } = require('./src/middlewares/middleware')

    // Rotas da home
    route.get('/', loginRequired, homeController.loadIndex);


    // Rotas de login
    route.get('/login/index',  loginControler.loadIndex);
    route.post('/login/register', loginControler.register);
    route.post('/login/login', loginControler.login);
    route.get('/login/logout', loginControler.logout);

    // Rotas de contatos
    route.get('/contato/index', loginRequired, contatoController.loadIndex);
    route.post('/contato/register', loginRequired, contatoController.register);
    route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
    route.post('/contato/edit/:id', loginRequired, contatoController.edit);
    route.get('/contato/delete/:id', loginRequired, contatoController.delete);

    // Rotas de matriculas
    route.get('/matricula/index', loginRequired, matriculaController.loadIndex);
    route.post('/matricula/register', loginRequired, matriculaController.register);
    route.get('/matricula/consultar/:id', loginRequired, matriculaController.consultar);
    route.get('/matricula/pesquisar', loginRequired, matriculaController.pesquisar);
    route.get('/matricula/editar/:id', loginRequired, matriculaController.editIndex);
    route.post('/matricula/editar/:id', loginRequired, matriculaController.edit);
    route.get('/matricula/print/:id', loginRequired, matriculaController.gerarPDF);
    route.get('/teste/:id', loginRequired, matriculaController.teste);
    route.get('/getTurmas/:curso', loginRequired, matriculaController.atualizarPagina);


    // Rotas de Admin
    //Talvez eu desmembre os controles de turma e de curso
    route.get('/admin/index', loginRequired, AdminController.loadIndex);
    route.post('/admin/register/curso', loginRequired, AdminController.registerCurso);
    route.post('/admin/register/turma', loginRequired, AdminController.registerTurma);
    route.get('/admin/edit/curso/:id', loginRequired, AdminController.editCursoIndex);
    route.get('/admin/edit/turma/:id', loginRequired, AdminController.editTurmaIndex);
    route.post('/admin/edit/curso/:id', loginRequired, AdminController.editCurso);
    route.post('/admin/edit/turma/:id', loginRequired, AdminController.editTurma);

    //Frequência
    route.get('/turma/frequencia/:id', loginRequired, freqController.sjIndex);
    route.get('/turma/frequencia/update/:id', loginRequired, freqController.atualizar);
    route.post('/turma/frequencia/', loginRequired, freqController.register);

    //Rotas de Turma
    route.get('/turma/index/:id', loginRequired, turmaController.loadIndex);


    



    module.exports = route;
