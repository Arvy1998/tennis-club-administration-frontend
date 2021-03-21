import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Navigation from './Navigation';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

export default function Account() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <Navigation/>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container className={classes.container}>
            <Grid container spacing={3}>
              <Typography variant="h1" component="h2" >ACCOUNT</Typography>
            </Grid>
          </Container>
        </main>
    </div>
  );
}