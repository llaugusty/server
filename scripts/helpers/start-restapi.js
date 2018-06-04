const contractDir = __dirname + '/../../contracts/build/contracts'
const fs = require('fs')

var express = require('express');

var app        = express();                
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 12345;  

var router = express.Router(); 

router.get('/', function(req, res) {
    var result = {};
    const files = fs.readdirSync(contractDir)
    files.forEach(file => {
        const filePath = `${contractDir}/${file}`
        const contractJSON = fs.readFileSync(filePath).toString()
        const { abi, bytecode, contractName, networks } = JSON.parse(contractJSON)
        const simplifiedJSON = { abi, bytecode, contractName, networks }
        fs.writeFileSync(filePath, JSON.stringify(simplifiedJSON, null, 4))
        result[file] = contractJSON;
    })
    res.json(result);   
});

router.get('/:id', function(req, res) {
    const contractJSON = fs.readFileSync(contractDir + '/' + req.params.id + '.json').toString();
    res.json(contractJSON);   
})

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);


