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