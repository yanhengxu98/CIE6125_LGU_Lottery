import React from 'react';
import { Grid, Button, Typography, TextField, Paper, CircularProgress } from '@material-ui/core';

import { Router } from '../../../routes';
import web3 from '../../../libs/web3';
import ProbLottery from '../../../libs/probLottery';
import withRoot from '../../../libs/withRoot';
import Layout from '../../../components/Layout';

class PaymentCreate extends React.Component {
  static async getInitialProps({ query }) {
    const contract = ProbLottery(query.address);
    
    const description = ProbLottery.methods.description().call();
    const balance = ProbLottery.methods.balance().call();
    const owner = ProbLottery.methods.owner().call();

    return { project: { address: query.address, description, owner, balance } };
  }

  constructor(props) {
    super(props);

    this.state = {
      description: '',
      amount: '', // web3.utils.fromWei(project.balance, 'ether')
      receiver: '', // 
      errmsg: '',
      loading: false,
    };

    this.onSubmit = this.createPayment.bind(this);
  }

  getInputHandler(key) {
    return e => {
      console.log(e.target.value);
      this.setState({ [key]: e.target.value });
    };
  }

  async createPayment() {
    const { description } = this.state;
    const amount = ProbLottery.methods.multiplier().call() * ProbLottery.methods.single().call();
    const receiver = ProbLottery.methods.sendrwrd().call();
    console.log(this.state);

    // 字段合规检查
    if (!description) {
      return this.setState({ errmsg: 'You must entey the reason for early draw!' });
    }
    if (amount <= 0) {
      return this.setState({ errmsg: 'Invalid amount to be sent!' });
    }
    if (!web3.utils.isAddress(receiver)) {
      return this.setState({ errmsg: 'Invalid address of the receiver!' });
    }

    const amountInWei = web3.utils.toWei(amount, 'ether');

    try {
      this.setState({ loading: true, errmsg: '' });

      // 获取账户
      const accounts = await web3.eth.getAccounts();
      const sender = accounts[0];

      // 检查账户
      if (sender !== this.props.project.owner) {
        return window.alert('This can only be done by users');
      }

      // 创建项目
      const contract = ProbLottery(this.props.project.address);
      const result = await contract.methods
        .createPayment(description, amountInWei, receiver)
        .send({ from: sender, gas: '5000000' });

      this.setState({ errmsg: 'Success!' });
      console.log(result);

      setTimeout(() => {
        Router.pushRoute(`/projects/${this.props.project.address}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      this.setState({ errmsg: err.message || err.toString });
    } finally {
      this.setState({ loading: false });
    }
  }

  //TODO: 这边下面的html要改，只需要写Reason就可以了，不需要支出金额和收款方，但是要给这个两个key一个值，不然在detail页面会出错。
  //TODO: payment.amount, payment.receiver 固定赋值即可。
  render() {
    return (
      <Layout>
        <Typography variant="title" color="inherit" style={{ marginTop: '15px' }}>
          Early Draw Request：{this.props.project.description}
        </Typography>
        <Paper style={{ width: '60%', padding: '15px', marginTop: '15px' }}>
          <form noValidate autoComplete="off" style={{ marginBottom: '15px' }}>
            <TextField
              fullWidth
              required
              id="description"
              label="Reason for Early Draw"
              value={this.state.description}
              onChange={this.getInputHandler('description')}
              margin="normal"
            />
            {/*<TextField*/}
            {/*  fullWidth*/}
            {/*  required*/}
            {/*  id="amount"*/}
            {/*  label="支出金额"*/}
            {/*  value={this.state.amount}*/}
            {/*  onChange={this.getInputHandler('amount')}*/}
            {/*  margin="normal"*/}
            {/*  InputProps={{*/}
            {/*    endAdornment: `Total Avaliable ${web3.utils.fromWei(this.props.project.balance.toString(), 'ether')} ETH`,*/}
            {/*  }}*/}
            {/*/>*/}
            {/*<TextField*/}
            {/*  fullWidth*/}
            {/*  required*/}
            {/*  id="receiver"*/}
            {/*  label="收款方"*/}
            {/*  value={this.state.maxInvest}*/}
            {/*  onChange={this.getInputHandler('receiver')}*/}
            {/*  margin="normal"*/}
            {/*/>*/}
          </form>
          <Button variant="raised" size="large" color="primary" onClick={this.onSubmit}>
            {this.state.loading ? <CircularProgress color="secondary" size={24} /> : '保存'}
          </Button>
          {!!this.state.errmsg && (
            <Typography component="p" style={{ color: 'red' }}>
              {this.state.errmsg}
            </Typography>
          )}
        </Paper>
      </Layout>
    );
  }
}

export default withRoot(PaymentCreate);
