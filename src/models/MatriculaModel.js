const mongoose = require('mongoose');
const validator = require('validator')

const MatriculaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  RG: { type: String, required: false, default: ''},
  CPF: { type: String, required: false, default: ''},
  //RG: { type: String, required: true},
  //CPF: { type: String, required: true},
  nascimento: { type: Date, required: true},
  sexo: { type: String, required: true},
  endereco: { type: String, required: true},
  endereco_numero: { type: String, required: true},
  endereco_complemento: { type: String, required:  false, default: '' },
  CEP: { type: String, required: true},
  cidade: { type: String, required: true},
  bairro: { type: String, required: true},
  moradia: { type: String, required: true},
  nomePai: { type: String, required: false, default: ''  },
  nomeMae: { type: String, required: false, default: '' },
  nomeResponsavel: { type: String, required: false, default: '' },
  telefone1: { type: String, required: true},
  telefone2: { type: String, required: false, default: '' },
  escola:{ type: String, required: true, default: '' },
  periodo:{ type: String, required: true, default: '' },
  religiao: { type: String, required: true},
  escolaridade: { type: String, required: true},
  curso1: { type: String, required: true},
  turma1: { type: String, required: true},
  curso2: { type: String, required: false, default: ''},
  turma2: { type: String, required: false, default: ''},
  codMatricula: { type: String, required: false, default: ''},
  curso1Freq: { type: Number, default: '0'},
  curso2Freq: { type: Number, default: '0'},
  criadoEm: { type: Date, default: Date.now },
});

//MatriculaSchema.pre('save', function (next) {
//  if (this.isModified('name')) {
//    this.name = this.name.toLowerCase();
//  }
//  next();
//});

const MatriculaModel = mongoose.model('Matricula', MatriculaSchema);

//Constructor, essa função cria o objeto que vai ser inserido no BD
function Matricula(body){
  this.body = body;
  this.errors = [];
  this.matricula = null;
}

Matricula.prototype.register = async function(){
  this.valida();
  this.body.name = this.body.name.toLowerCase();
  this.body.codMatricula = (await Matricula.buscaMatriculas()).length+1;
  if(this.errors.length > 0) return;
  this.matricula = await MatriculaModel.create(this.body);
 }




Matricula.prototype.valida = function() {
  this.cleanUp()

  if(!this.body.name) this.errors.push('Nome é um campo obrigatório.');
  //if(!this.body.RG) this.errors.push('RG é um campo obrigatório.');
  //if(!this.body.CPF) this.errors.push('CPF é um campo obrigatório.');
  if(!this.body.nascimento) this.errors.push('Data de nascimento é um campo obrigatório.');
  if(!this.body.sexo) this.errors.push('Sexo é um campo obrigatório.');
  if(!this.body.endereco) this.errors.push('Endereço é um campo obrigatório.');
  if(!this.body.endereco_numero) this.errors.push('O número do endereço é um campo obrigatório.');
  if(!this.body.CEP) this.errors.push('CEP é um campo obrigatório.');
  if(!this.body.cidade) this.errors.push('Cidade é um campo obrigatório.');
  if(!this.body.bairro) this.errors.push('Bairro é um campo obrigatório.');
  if(!this.body.moradia) this.errors.push('Tipo de moradia é um campo obrigatório.');
  if(!this.body.telefone1) this.errors.push('Pelo menos um telefone deve ser registrado.');
  if(!this.body.escola) this.errors.push('Escola é um campo obrigatório.');
  if(!this.body.periodo) this.errors.push('Periodo é um campo obrigatório.');
  if(!this.body.religiao) this.errors.push('Religião é um campo obrigatório.');
  if(!this.body.escolaridade) this.errors.push('Escolaridade é um campo obrigatório.');
  if(!this.body.curso1) this.errors.push('O primeiro campo de curso é obrigatório.');
  if(!this.body.turma1) this.errors.push('Turma é um campo obrigatório.');
  if(this.body.curso2 === !this.body.turma2 ) {
    this.errors.push('Turma é obrigatório.');
  }
  if(!this.body.nomePai && !this.body.nomeMae && !this.nomeResponsavel) {
    this.errors.push('Pelo menos o nome de um pai, mãe ou responsável deve ser inserido.');
  }
}

Matricula.prototype.validaEdit = function() {
  
  if(!this.body.name) this.errors.push('Nome é um campo obrigatório.');
  //if(!this.body.RG) this.errors.push('RG é um campo obrigatório.');
  //if(!this.body.CPF) this.errors.push('CPF é um campo obrigatório.');
  if(!this.body.nascimento) this.errors.push('Data de nascimento é um campo obrigatório.');
  if(!this.body.sexo) this.errors.push('Sexo é um campo obrigatório.');
  if(!this.body.endereco) this.errors.push('Endereço é um campo obrigatório.');
  if(!this.body.endereco_numero) this.errors.push('O número do endereço é um campo obrigatório.');
  if(!this.body.CEP) this.errors.push('CEP é um campo obrigatório.');
  if(!this.body.cidade) this.errors.push('Cidade é um campo obrigatório.');
  if(!this.body.bairro) this.errors.push('Bairro é um campo obrigatório.');
  if(!this.body.moradia) this.errors.push('Tipo de moradia é um campo obrigatório.');
  if(!this.body.telefone1) this.errors.push('Pelo menos um telefone deve ser registrado.');
  if(!this.body.escola) this.errors.push('Escola é um campo obrigatório.');
  if(!this.body.periodo) this.errors.push('Periodo é um campo obrigatório.');
  if(!this.body.religiao) this.errors.push('Religião é um campo obrigatório.');
  if(!this.body.escolaridade) this.errors.push('Escolaridade é um campo obrigatório.');
  if(!this.body.curso1) this.errors.push('O primeiro campo de curso é obrigatório.');
  if(!this.body.turma1) this.errors.push('Turma é um campo obrigatório.');
  if(!this.body.nomePai && !this.body.nomeMae && !this.nomeResponsavel) {
    this.errors.push('Pelo menos o nome de um pai, mãe ou responsável deve ser inserido.');
  }
}


Matricula.prototype.cleanUp = function() {
  const fields = [
    'name', 'RG', 'CPF', 'nascimento', 'sexo', 'endereco', 'endereco_numero',
    'endereco_complemento', 'CEP', 'cidade', 'bairro', 'moradia', 'nomePai',
    'nomeMae', 'nomeResponsavel', 'telefone1', 'telefone2', 'periodo', 'escola',
    'religiao', 'escolaridade', 'curso1', 'turma1', 'curso2', 'turma2'
  ];

  let cleanBody = {};

  for (const field of fields) {
    if (this.body[field]) {
      cleanBody[field] = this.body[field];
    }
  }

  this.body = cleanBody;
}

Matricula.prototype.edit = async function(id) {
  console.log(id);
  this.body.name = this.body.name.toLowerCase();
  if(typeof id !== 'string') return;  
  this.matricula = await MatriculaModel.findByIdAndUpdate(id, this.body, { new: true, runValidators: true });
};

// Métodos estáticos
Matricula.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const matricula = await MatriculaModel.findById(id);
  return matricula;
};


Matricula.buscaPorNome = async function(name) {
  if(typeof name !== 'string') return;
  const matricula = await MatriculaModel.findOne({ name: new RegExp('^' + name + '$', 'i') });
  return matricula;
};
 
 Matricula.buscaPorCodigo = async function(codigo) {
  if(typeof codigo !== 'string') return;
  const matricula = await MatriculaModel.findOne({ codMatricula: codigo });
  return matricula;
 };

Matricula.buscaMatriculas = async function() {
  const matriculas = await MatriculaModel.find()
    .sort({ criadoEm: -1 });
  return matriculas;
};

Matricula.buscaPorTurmas = async function(codTurma) {
  try {
    const matriculas = await MatriculaModel.find({
      $or: [{ turma1: codTurma }, { turma2: codTurma }]
    });

    // Retorna a contagem de matrículas
    //console.log("alunos:", matriculas.length);
    return matriculas.length; 
  } catch (err) {
    console.error(err);
    throw err;
  }
};




//Matricula.delete = async function(id) {
//  if(typeof id !== 'string') return;
//  const matricula = await MatriculaModel.findOneAndDelete({_id: id});
//  return matricula;
//};



module.exports = Matricula;
