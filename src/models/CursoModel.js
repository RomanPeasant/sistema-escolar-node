const mongoose = require('mongoose');
const validator = require('validator');
const Login = require('../models/LoginModel')

const CursoSchema = new mongoose.Schema({
  nomeCurso: { type: String, required: true },
  pNome: { type: String, required: true},
  pEmail: { type: String, required: true},
  criadoEm: { type: Date, default: Date.now },
});

const CursoModel = mongoose.model('Curso', CursoSchema);

//Constructor, essa função cria o objeto que vai ser inserido no BD
function Curso(body){
  this.body = body;
  this.errors = [];
  this.curso = null;
}

Curso.prototype.register = async function(){
  this.valida();
  if(this.errors.length > 0) return;
  this.curso = await CursoModel.create(this.body);
}




Curso.prototype.valida = function() {
  this.cleanUp()


  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.nomeCurso) this.errors.push('Nome é um campo obrigatório.');
  if(!this.body.pNome) this.errors.push('Nome é um campo obrigatório.');
  if(!this.body.pEmail) this.errors.push('Nome é um campo obrigatório.');
  
}

Curso.prototype.cleanUp = function() {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }
  this.body = {
    nomeCurso: this.body.nomeCurso,
    pNome: this.body.pNome,
    pEmail: this.body.pEmail,
  }
}

Curso.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.curso = await CursoModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Curso.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const curso = await CursoModel.findById(id);
  return curso;
};

Curso.buscaCursos = async function() {
  const cursos = await CursoModel.find()
    .sort({ criadoEm: -1 });
  return cursos;
};

Curso.delete = async function(id) {
  if(typeof id !== 'string') return;
  const curso = await CursoModel.findOneAndDelete({_id: id});
  return curso;
};




module.exports = Curso;
