
const fs = require('fs-extra');
const path = require('path');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

const provider = new HDWalletProvider(
    'fame certain example face name silent talent fix diet mom zoo acoustic',
    'https://rinkeby.infura.io/v3/c178420e48dd441e80593e34dae0bd5d'
);

const web3 = new Web3(provider);

const compiledFiles = fs.readdirSync(path.resolve(__dirname, '../compiled'))
compiledFiles.forEach(compiledFile=>{
    const { interface, bytecode } = require(path.resolve(__dirname, '../compiled', compiledFile));

    (async () => {
        // 获取钱包里面的账户
        const accounts = await web3.eth.getAccounts();
        console.log('部署合约的账户：', accounts[0]);

        // 创建合约实例并且部署
        const contract = new web3.eth.Contract(JSON.parse(interface));
        const transaction = contract.deploy({ data: bytecode });
        const result = await transaction.send({ from: accounts[0], gas: 5000000 });

        console.log('合约部署成功');
})();
});