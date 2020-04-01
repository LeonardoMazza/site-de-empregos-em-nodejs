const express    = require('express');
const app        = express();
const path       = require('path');
const exphbs     = require('express-handlebars');
const db         = require('./db/connection');
const bodyParser = require('body-parser');
const Job        = require('./models/Job');

const PORT = 3000;

app.listen(PORT, function(){
    console.log(`O express está rodando na porta ${PORT}`);
});

// body parser

app.use(bodyParser.urlencoded({extended:false}));

// handle bars //
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//static folder
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com o Banco de Dados
db
    .authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso");
    })
    .catch(err => {
        console.log("Ocorreu um erro ao conectar", err);
    });

// Rotas
app.get('/', (req, res) => {
    Job.findAll({order: [
        ['createdAt', 'DESC']
    ]})
    .then(jobs => {
        res.render('index', {
            jobs
        });
         
    });

});

// Rotas Jobs
app.use('/jobs', require('./routes/jobs'));