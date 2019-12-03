import web3 from './web3';
import oneWinsAll from '../compiled/oneWinsAll.json';
import address from '../address.json';

const contract = new web3.eth.Contract(JSON.parse(oneWinsAll.interface), address);

export default contract;
