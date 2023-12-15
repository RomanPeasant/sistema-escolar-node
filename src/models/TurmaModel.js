const mongoose = require('mongoose');
const validator = require('validator');
const Login = require('../models/LoginModel')
const Matricula = require('../models/MatriculaModel')

const TurmaSchema = new mongoose.Schema({
  cursoTurma: { type: String, required: true },
  diaTurma: { type: String, required: true},
  horarioInicio: { type: String, required: true},
  horarioFim: { type: String, required: true},
  codTurma : { type: String, required: true},
  turmaEmail: { type: String, required: true},
  maxAlunos: { type: Number, required: true},
  criadoEm: { type: Date, default: Date.now },
  
});

const TurmaModel = mongoose.model('Turma', TurmaSchema);

//Constructor, essa função cria o objeto que vai ser inserido no BD
function Turma(body){
  this.body = body;
  this.errors = [];
  this.turma = null;
}

Turma.prototype.register = async function(){
  this.valida();
  if(this.errors.length > 0) return;
  this.turma = await TurmaModel.create(this.body);
}




Turma.prototype.valida = function() {
  this.cleanUp()


  if(!this.body.cursoTurma)this.errors.push('Curso é obrigatório');
  if(!this.body.diaTurma) this.errors.push('Dia é um campo obrigatório.');
  if(!this.body.horarioInicio) this.errors.push('Horário é um campo obrigatório.');
  if(!this.body.horarioFim) this.errors.push('Horário é um campo obrigatório.');
  if(!this.body.codTurma) this.errors.push('O código da turma é obrigatório.');
  if(!this.body.turmaEmail) this.errors.push('O e-mail do professor é obrigatório.');
  if(!this.body.maxAlunos) this.errors.push('A quantidade máxima de alunos deve ser inserida.');
  
}

Turma.prototype.cleanUp = function() {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }
  this.body = {
    cursoTurma: this.body.cursoTurma,
    diaTurma: this.body.diaTurma,
    horarioInicio: this.body.horarioInicio,
    horarioFim: this.body.horarioFim,
    codTurma: this.body.codTurma,
    turmaEmail: this.body.turmaEmail,
    maxAlunos: this.body.maxAlunos,
  }
}

Turma.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.turma = await TurmaModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Turma.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const turma = await TurmaModel.findById(id);
  return turma;
};


Turma.buscaTurmasPorCurso = async function (cursoNome) {
  //console.log('Searching turmas for Cursonome:', cursoNome);
  const turmas = await TurmaModel.find({ cursoTurma: cursoNome });
  //console.log('Found turmas:', turmas);
  return turmas;
};


Turma.buscaPorCod = async function(codTurma) {
  if(typeof codTurma !== 'string') return;
  const turma = await TurmaModel.findOne({ codTurma: codTurma });
  return turma;
 };

Turma.buscaTurmas = async function() {
  const turma = await TurmaModel.find()
    .sort({ criadoEm: -1 });
  return turma;
};


Turma.delete = async function(id) {
  if(typeof id !== 'string') return;
  const turma = await TurmaModel.findOneAndDelete({_id: id});
  return turma;
};



module.exports = Turma;
