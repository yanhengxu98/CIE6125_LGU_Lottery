import React from 'react';
import { Grid, Button, Typography, Card, CardContent, CardActions, LinearProgress } from '@material-ui/core';

import { Link } from '../routes';
import web3 from '../libs/web3';
import Project from '../libs/project';
import ProjectList from '../libs/projectList';
import withRoot from '../libs/withRoot';
import Layout from '../components/Layout';
import InfoBlock from '../components/InfoBlock';

class Index extends React.Component {
  static async getInitialProps({ req }) {
    const addressList = await ProjectList.methods.getProjects().call();
    const summaryList = await Promise.all(
      addressList.map(address =>
        Project(address)
          .methods.getSummary()
          .call()
      )
    );
    console.log({ summaryList });
    const projects = addressList.map((address, i) => {
      const [description, minInvest, maxInvest, goal, balance, investorCount, paymentCount, owner] = Object.values(
        summaryList[i]
      );

      return {
        address,
        description,
        minInvest,
        maxInvest,
        goal,
        balance,
        investorCount,
        paymentCount,
        owner,
      };
    });

    console.log(projects);

    return { projects };
  }

  render() {
    const { projects } = this.props;

    return (
      <Layout>
        <Grid container spacing={16}>
          {projects.length === 0 && <p>Try to start up your first lottery!</p>}
          {projects.length > 0 && projects.map(this.renderProject)}
        </Grid>
      </Layout>
    );
  }

  renderProject(project) {
    const progress = project.balance / project.goal * 100;

    return (
      <Grid item md={6} key={project.address}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
              {project.description}
            </Typography>
            <LinearProgress style={{ margin: '10px 0' }} color="primary" variant="determinate" value={progress} />
            <Grid container spacing={16}>
              <InfoBlock title={`${web3.utils.fromWei(project.goal, 'ether')} ETH`} description="Bet Limit" />
              <InfoBlock title={`${web3.utils.fromWei(project.minInvest, 'ether')} ETH`} description="Min Bet" />
              <InfoBlock title={`${web3.utils.fromWei(project.maxInvest, 'ether')} ETH`} description="Max Bet" />
              <InfoBlock title={`${project.investorCount}人`} description="Participants" />
              <InfoBlock title={`${web3.utils.fromWei(project.balance, 'ether')} ETH`} description="Prize Pool" />
            </Grid>
          </CardContent>
          <CardActions>
            <Link route={`/projects/${project.address}`}>
              <Button size="small" color="primary">
                BUY NOW!
              </Button>
            </Link>
            <Link route={`/projects/${project.address}`}>
              <Button size="small" color="secondary">
                Information
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  }
}

export default withRoot(Index);
