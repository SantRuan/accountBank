// importando módulos externos
const inquirer = require('inquirer')

//importando módulo interno

const fs = require('fs')

console.log('Iniciamos o Account ')

operation()


function operation() {

    inquirer.prompt([
        {
            type: "list",
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: [
                'Criar conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Sair'],
        }]).then((answer) => {

            const action = answer['action'] // Baseado nos inputs do usuário eu poderei criar ações no sistema

            if (action === 'Criar conta') {
                createAccount()
            } else if (action === 'Consultar Saldo') { }


            else if (action === 'Depositar') {

                deposit()

            }

            else if (action === 'Sacar') {

            }

            else if (action === 'Sair') {
            console.log('Obrigado por utilizar o Account Bank')
            process.exit()
            }


        })
        .catch((err) => console.log(err))
}


// Criando conta
function createAccount() {
    console.log('Parabéns por escolher o Account Bank')
    console.log('Defina as opções de sua conta a seguir: ')

    buildAccount()


}

function buildAccount() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Digite um nome para a sua conta: '
    }]).then(answer => {

        const accountName = answer['accountName']

        console.info(answer['accountName'])

        // Como estamos construindo uma conta, devemos checar se um banco de dados com as informações dessa conta existe
        // e tratar caso exista ou não
        if (!fs.existsSync('accounts')) { //Se não existir, será criado um diretório
            fs.mkdirSync('accounts')
        }

        // Agora, deve-se fazer uma validação para verificar se o usuário existe
        // Caso exista o usuário não deve prosseguir, caso não exista será criado
        if (fs.existsSync(`accounts/${accountName}.json`)) { // Os arquivos serão salvos em json 

            console.log('Esta conta já existe, escolha outro nome')  // Se a conta existir

            buildAccount()

        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance" : 0}', function (err) { console.log(err) },)

        console.log('Conta criada com sucesso')

        operation()


    }).catch((err) => { console.log(err) })

}


// Função que coloca uma quantia de dinheiro na conta do usuário

function deposit(){

    inquirer.prompt([{
        name: 'accountName',
        message:'Qual o nome da sua conta?'
    }]).then((answer)=>{

        // Aqui irei veridicar se a conta do usuário está no banco de dados
        const accountName = answer['accountName']
        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Valor do depósito: '
        }]).then(((answer) =>{

            const amount = answer['amount']
            
            addAmount(accountName,amount)
            

            operation()


        })).catch((err)=>{console.log(err)})


    }).catch((err)=> {console.log(err)})
}



//funcao que verifica se a conta existe

function checkAccount(accountName){

    if(!fs.existsSync(`accounts/${accountName}.json`)){
        console.log('Esta conta nao existe, tente novamente')
        return false
    }

    return true
}

// função que coloca o montante do valor no nome de uma conta 
function addAmount(accountName,amount){

    const accountData = getAccount(accountName) // aqui temos a conta em objeto


    if(!amount){
        console.log('ocorreu um erro, tente novamente')
        return deposit()
    }

    // acesso o valor do balance  da conta caso o valor exista
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    // Agora preciso salvar isso no arquivo

    fs.writeFileSync(`accounts/${accountName}.json`,
    JSON.stringify(accountData), //transformo o JSON em texto,
    function (err){console.log(err)},  // função callback para caso exista um erro
    )

    console.log(`Foi depositado o valor de ${amount}R$`)
}

// funcao que pega a conta

function getAccount(accountName){
    //Aqui pegamos a função em JSON



    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,{ 
        encoding:'utf8', // o tipo de enconding utilizando no brasil
        flag:'r' //essa flag nos diz ao programa que só queremos ler o arquivo

    })
    return JSON.parse(accountJSON) // aqui transformamos o texto em arquivo JSON
}

