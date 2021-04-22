import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';

import Navigation from './Navigation';

import { useQuery } from "@apollo/react-hooks";
import {
    LIST_NEWS,
} from './gql/queries/queries';

const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    welcomeText: {
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    buttonBox: {
        justifyContent: 'center',
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        display: 'flex',
    },
    formContainer: {
        marginTop: theme.spacing(15),
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignContent: 'center',
    },
    contactInformationText: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    spacingBetween: {
        padding: theme.spacing(3),
    },
    loadingBarContainer: {
        paddingBottom: theme.spacing(6),
    },
    centeredForms: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spacingBetweenDifferentFields: {
        padding: theme.spacing(0.2),
    },
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    title: {
        fontSize: 20,
        fontWeight: 500,
    },
    description: {
        fontSize: 14,
    },
    card: {
        minWidth: 275,
    },
}));

export default function News() {
    const classes = useStyles();

    const [loadedNewsData, setLoadedNewsData] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const { loading, error, data } = useQuery(LIST_NEWS);

    useEffect(() => {
        if (loading) {
            setIsLoading(loading);
        }

        if (error) {
            setIsError(error);
            setIsLoading(false);
        }

        if (data) {
            setLoadedNewsData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    if (!loadedNewsData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let newsCards;
    if (loadedNewsData) {
        newsCards = _.orderBy(loadedNewsData.listNews, 'date', 'desc');
    }

    return (
        <div className={classes.root}>
            <Navigation />
            <Container className={classes.formContainer}>
                <Grid container spacing={3} alignItems="flex-end" justify="center">
                    <Grid container spacing={1} justify="center">
                        <Typography
                            component="h1"
                            variant="h5"
                            className={classes.contactInformationText}
                        >
                            News
                        </Typography>
                    </Grid>
                    <Grid className={classes.spacingBetween}></Grid>
                    <Grid container spacing={2} justify="center" alignItems="flex-end" flexDirection="column">
                        {newsCards.map(card => {
                            return (
                                <Grid item>
                                    <Card className={classes.card} variant="outlined">
                                        <CardContent>
                                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                {card.title} {Date.parse(card.date) < new Date() ? ' / Game is over!' : ''}
                                            </Typography>
                                            <Typography className={classes.description} color="textSecondary">
                                                {card.description}
                                            </Typography>
                                            <Typography className={classes.description} color="textSecondary">
                                                <b>Event starting on:</b> {moment(card.date).format('YYYY-MM-DD HH:mm')} at {card.playField.title}, {card.playField.city} {card.playField.address}
                                            </Typography>
                                            <Grid className={classes.spacingBetween}></Grid>
                                            <Grid container justify="center" alignItems="center" direction="row">
                                                <Grid container spacing={1} justify="center" alignItems="center" direction="row">
                                                    <Grid item>
                                                        <Typography
                                                            className={classes.description}
                                                            color="textSecondary"
                                                            gutterBottom
                                                        >
                                                            <b>{card.firstClubPlaying.title}</b>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Avatar
                                                            id="avatar"
                                                            sizes="100px"
                                                            src={card.firstClubPlaying.clubLogo}
                                                            className={classes.large}
                                                        />
                                                    </Grid>
                                                    <Grid item className={classes.spacingBetweenDifferentFields}></Grid>
                                                    <Grid item>
                                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                                            <b>VS</b>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item className={classes.spacingBetweenDifferentFields}></Grid>
                                                    <Grid item>
                                                        <Avatar
                                                            id="avatar"
                                                            sizes="100px"
                                                            src={card.secondClubPlaying.clubLogo}
                                                            className={classes.large}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography
                                                            className={classes.description}
                                                            color="textSecondary"
                                                            gutterBottom
                                                        >
                                                            <b>{card.secondClubPlaying.title}</b>
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
            </Container>
        </div >
    );
}