import web3 from './web3';
import rightAway from '../compiled/rightAway.json';
import address from '../address.json';

const contract = new web3.eth.Contract(JSON.parse(rightAway.interface), address);

export default contract;
