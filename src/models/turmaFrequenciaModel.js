const mongoose = require('mongoose');
const validator = require('validator');
const Login = require('../models/LoginModel')

const FrequenciaSchema = new mongoose.Schema({
  cursoTurma: { type: String, required: true },
  codTurma : { type: String, required: true},
  mes: { type: String, required: true},
  dia1: { type: Array, required: true},
  dia2: { type: Array, required: true},
  dia3: { type: Array, required: true},
  dia4: { type: Array, required: true},
  dia5: { type: Array, required: true},

  
});

const FrequenciaModel = mongoose.model('Frequencia', FrequenciaSchema);

//Constructor, essa função cria o objeto que vai ser inserido no BD
function Frequencia(body){
  this.body = body;
  this.errors = [];
  this.frequencia = null;
}

Frequencia.prototype.register = async function(){
  this.valida();
  if(this.errors.length > 0) return;
  this.frequencia = await FrequenciaModel.create(this.body);
}




Frequencia.prototype.valida = function() {
  this.cleanUp()


  if(!this.body.dia1)this.errors.push('Dia 1 é um campo obrigatório');
  if(!this.body.dia2) this.errors.push('Dia 2 é um campo obrigatório.');
  if(!this.body.dia3) this.errors.push('Dia 3 é um campo obrigatório.');
  if(!this.body.dia4) this.errors.push('Dia 4 é um campo obrigatório.');
  if(!this.body.dia5) this.errors.push('Dia 5 é um campo obrigatório.');
  
}

Frequencia.prototype.cleanUp = function() {
  for (const key in this.body) {
    if (typeof this.body[key] !== 'string' && !Array.isArray(this.body[key])) {
      this.body[key] = '';
    }
  }

  this.body = {
    cursoTurma: this.body.cursoTurma,
    codTurma: this.body.codTurma,
    mes: this.body.mes,
    dia1: this.body.dia1,
    dia2: this.body.dia2,
    dia3: this.body.dia3,
    dia4: this.body.dia4,
    dia5: this.body.dia5,
  };
};

Frequencia.prototype.edit = async function(id) {
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.frequencia = await FrequenciaModel.findByIdAndUpdate(id, this.body, { new: true });
};

// Métodos estáticos
Frequencia.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const frequencia = await FrequenciaModel.findById(id);
  return frequencia;
};

Frequencia.busca = async function() {
  const frequencia = await FrequenciaModel.find()
  return frequencia;
};



Frequencia.delete = async function(id) {
  if(typeof id !== 'string') return;
  const frequencia = await FrequenciaModel.findOneAndDelete({_id: id});
  return frequencia;
};



module.exports = Frequencia;
