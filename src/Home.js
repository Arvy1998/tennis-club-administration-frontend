import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import WarningIcon from '@material-ui/icons/Warning';

import Navigation from './Navigation';
import { Typography } from '@material-ui/core';

import isRegisteredUser from '../utils/isRegisteredUser';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  container: {
    marginTop: theme.spacing(15),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },

}));

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Navigation />
      <Container >
        <Grid container className={classes.container} spacing={1} alignItems="center" justify="center">
          {
            !isRegisteredUser() ? (
              <Grid item>
                <Card className={classes.card} variant="outlined">
                  <CardContent>
                    <Grid container spacing={1} alignItems="center" justify="center">
                      <Grid item>
                        <WarningIcon />
                      </Grid>
                      <Grid item>
                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                          You have restricted access to the data inside this information system, consider authentificate yourself!
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ) : ''
          }
          {
            isRegisteredUser() ? (
              <Grid item>
                <Typography variant="h1" component="h2" >TEST</Typography>
              </Grid>
            ) : ''
          }

        </Grid>
      </Container>
    </div >
  );
}