const Web3 = require('web3');
const ABI = require('human-standard-token-abi');  // 因为所有的 ERC20 token 遵循相同的接口规范，这里ABI可以使用相同的

const contractAddress = '0xE72194a48Fc478E3779cC339eb46D997865e29Ef'; // MIXIN 合约地址，在 Etherscan 上搜索能找到
const accountAddress = '0x2D47d231D8b46d0A0FB516294CD462364B4339B3'; // 用户钱包
const infuraUrl = 'https://rinkeby.infura.io/v3/13a50990b09e4e9db418f736416dcd93'; // 注意这里的环境

const web3 = new Web3(new Web3.providers.HttpProvider(infuraUrl));

(async () => {
  try {
    const token = await new web3.eth.Contract(ABI, contractAddress);

    const [name, symbol, totalSupply, balanceOf] = await Promise.all([
      token.methods.name().call(),
      token.methods.symbol().call(),
      token.methods.totalSupply().call(),
      token.methods.balanceOf(accountAddress).call(),
    ]);

    console.log({
      name,
      symbol,
      totalSupply: `${web3.utils.fromWei(totalSupply.toString())} ${symbol}`,
      balanceOf: `${web3.utils.fromWei(balanceOf.toString())} ${symbol}`,
    });
  } catch (err) {
    console.error(err);
  }
})();
