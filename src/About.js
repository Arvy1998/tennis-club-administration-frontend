import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Navigation from './Navigation';

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
    welcomeText: {
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    title: {
        fontSize: 20,
    },
    description: {
        fontSize: 14,
    },
    card: {
        minWidth: 275,
    },
}));

export default function About() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Navigation />
            <Container>
                <Grid container className={classes.container} spacing={1} alignItems="center" justify="center">
                    <Grid item>
                        <Typography
                            component="h1"
                            variant="h5"
                            className={classes.welcomeText}
                        >
                            Information
                    </Typography>
                    </Grid>
                    <Grid item spacing={2}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    How do I find a player?
                                </Typography>
                                <Typography className={classes.description} color="textSecondary">
                                    It's easy! Go to <b>Players Search</b>, here you will see all players, if you want to filter them, click <b>Filter Players</b> above the table and select any filter you desire!
                                    <br />
                                    And even more, you can check yours status with the player you have selected from the table, have fun!
                            </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item spacing={2}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    How do I make reservation?
                                </Typography>
                                <Typography className={classes.description} color="textSecondary">
                                    Go to <b>Play Fields</b> list, select any playfield you want to reservate, then at the bottom of the page you will find a
                                    <br />
                                    button <b>Make Reservation</b>, press it, select time that is not busy, press <b>Create</b> and you are done!
                            </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item spacing={2}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    How do I earn rank and badges?
                                </Typography>
                                <Typography className={classes.description} color="textSecondary">
                                    The ranking of any registered user inside the system is calculated depending on how much games you have won during the period you are registered here.
                                    <br />
                                    Badges are earned depending on how many games you have won, how many types of matches you have won, have you ever been in the TOP players list,
                                    <br />
                                    your some first awesome actions like making reservations also will make system proud of you! ;)
                            </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item spacing={2}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    It is possible to enrol to the club myself?
                                </Typography>
                                <Typography className={classes.description} color="textSecondary">
                                    Not really, you have to know the personal trenner and prove yourself.
                            </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item spacing={2}>
                        <Card className={classes.card} variant="outlined">
                            <CardContent>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Who are the creator of this information system?
                                </Typography>
                                <Typography className={classes.description} color="textSecondary">
                                    The creator is <b>Arvydas Baranauskas</b>, <b>VGTU</b> 4th grade student from <b>PRIf-17/2</b>.
                            </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}