import web3 from './web3';
import probLottery from '../compiled/probLottery.json';
import address from '../address.json';

const contract = new web3.eth.Contract(JSON.parse(probLottery.interface), address);

export default contract;
