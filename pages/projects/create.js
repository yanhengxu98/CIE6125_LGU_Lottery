import React from 'react';
import { Grid, Button, Typography, TextField, Paper, CircularProgress, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '../../routes';
import web3 from '../../libs/web3';
import ProbLottery from '../../libs/probLottery';
import withRoot from '../../libs/withRoot';
import Layout from '../../components/Layout';

class LotteryInitialization extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      description: '',
      minInvest: 0,
      maxInvest: 0,
      goal: 0,
      type: 0,
      errmsg: '',
      loading: false,
    };

    this.onSubmit = this.createLottery.bind(this);
  }

  getInputHandler(key) {
    return e => {
      console.log(e.target.value);
      this.setState({ [key]: e.target.value });
    };
  }

  async createLottery() {
    const { description, minInvest, maxInvest, goal } = this.state;
    console.log(this.state);

    // 字段合规检查
    if (!description) {
      return this.setState({ errmsg: 'You must enter a vaild Lottery Name!' });
    }
    if (minInvest <= 0) {
      return this.setState({ errmsg: 'Min investment value should be larger than 0.' });
    }
    if (maxInvest <= 0) {
      return this.setState({ errmsg: 'Max investment value should be larger than 0.' });
    }
    if (maxInvest < minInvest) {
      return this.setState({ errmsg: 'Min < Max' });
    }
    if (goal <= 0) {
      return this.setState({ errmsg: 'Limit must be larger than 0' });
    }

    const minInvestInWei = web3.utils.toWei(minInvest, 'ether');
    const maxInvestInWei = web3.utils.toWei(maxInvest, 'ether');
    const goalInWei = web3.utils.toWei(goal, 'ether');

    try {
      this.setState({ loading: true, errmsg: '' });

      // 获取账户
      const accounts = await web3.eth.getAccounts();
      const owner = accounts[0];

      // 创建项目
      const result = await ProbLottery.methods
        .createLottery( description, minInvest, maxInvest, goal )
        .send({ from: owner, gas: '5000000' });

      this.setState({ errmsg: '项目创建成功' });
      console.log(result);

      setTimeout(() => {
        location.href = '/projects';
      }, 1000);
    } catch (err) {
      console.error(err);
      this.setState({ errmsg: err.message || err.toString });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Layout>
        <Typography variant="title" color="inherit">
          START UP
        </Typography>
        <Paper style={{ width: '60%', padding: '15px', marginTop: '15px' }}>
          <form noValidate autoComplete="off" style={{ marginBottom: '15px' }}>
            <TextField
              fullWidth
              required
              id="description"
              label="Lottery Name"
              value={this.state.description}
              onChange={this.getInputHandler('description')}
              margin="normal"
            />
            <TextField
              fullWidth
              required
              id="minInvest"
              label="Min Bet Value"
              value={this.state.minInvest}
              onChange={this.getInputHandler('minInvest')}
              margin="normal"
              InputProps={{ endAdornment: 'ETH' }}
            />
            <TextField
              fullWidth
              required
              id="maxInvest"
              label="Max Bet Value"
              value={this.state.maxInvest}
              onChange={this.getInputHandler('maxInvest')}
              margin="normal"
              InputProps={{ endAdornment: 'ETH' }}
            />
            <TextField
              fullWidth
              required
              id="goal"
              label="Bet Limit"
              value={this.state.goal}
              onChange={this.getInputHandler('goal')}
              margin="normal"
              InputProps={{ endAdornment: 'ETH' }}
            />
            <InputLabel id="demo-controlled-open-select-label">Lottery Style: </InputLabel>
            <select 
              style={{ width: '60%',padding: '15px', marginTop: '15px',marginBottom: '25px'}}
              id='type'
              onchange={this.state.type}
            >
              <option value="0">OneWinsAll</option>
              <option value="1">RightAway</option>
              <option value="2">RollThree</option>
            </select>
          </form>
          
          <Button variant="raised" size="large" color="primary" onClick={this.onSubmit}>
            {this.state.loading ? <CircularProgress color="secondary" size={24} /> : 'START UP YOUR Lottery!'}
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

export default withRoot(LotteryInitialization);
