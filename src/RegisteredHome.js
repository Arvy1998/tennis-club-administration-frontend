import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { Table, TableCell, TableRow } from '@material-ui/core';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import Navigation from './Navigation';
import { Typography } from '@material-ui/core';

import isRegisteredUser from '../utils/isRegisteredUser';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_USER,
    LIST_CLUBS,
    LIST_RESERVATIONS,
} from './gql/queries/queries';

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
    welcomeText: {
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        color: 'grey',
        marginTop: theme.spacing(1),
        fontSize: 20,
        fontWeight: 500,
    },
    loadingCircleContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
    }
}));

export default function RegisteredHome() {
    const classes = useStyles();

    const [loadedUsersData, setLoadedUsersData] = useState(null);
    const [loadedReservationsData, setLoadedReservationsData] = useState(null);
    const [loadedClubsData, setLoadedClubsData] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const { loading: usersLoading, error: usersError, data: usersData } = useQuery(
        GET_USER, { variables: { email: localStorage.getItem('email') } }
    );
    const { loading: clubsLoading, error: clubsError, data: clubsData } = useQuery(LIST_CLUBS);
    const { loading: reservationsLoading, error: reservationsError, data: reservationsData } = useQuery(LIST_RESERVATIONS);

    useEffect(() => {
        if (usersLoading) {
            setIsLoading(usersLoading);
        }

        if (usersError) {
            setIsError(usersError);
            setIsLoading(false);
        }

        if (usersData) {
            setLoadedUsersData(usersData);
            setIsLoading(false);
        }
    }, [usersLoading, usersError, usersData]);

    useEffect(() => {
        if (clubsLoading) {
            setIsLoading(clubsLoading);
        }

        if (clubsError) {
            setIsError(clubsError);
            setIsLoading(false);
        }

        if (clubsData) {
            setLoadedClubsData(clubsData);
            setIsLoading(false);
        }
    }, [clubsLoading, clubsError, clubsData]);

    useEffect(() => {
        if (reservationsLoading) {
            setIsLoading(reservationsLoading);
        }

        if (reservationsError) {
            setIsError(reservationsError);
            setIsLoading(false);
        }

        if (reservationsData) {
            setLoadedReservationsData(reservationsData);
            setIsLoading(false);
        }
    }, [reservationsLoading, reservationsError, reservationsData]);

    if (!loadedUsersData || isLoading) {
        return (
            <div className={classes.loadingCircleContainer}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

    if (!loadedReservationsData || isLoading) {
        return (
            <div className={classes.loadingCircleContainer}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

    if (!loadedClubsData || isLoading) {
        return (
            <div className={classes.loadingCircleContainer}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

    return (
        <Grid container alignItems="center" justify="center">
            <Typography
                component="h1"
                variant="h5"
                className={classes.welcomeText}
            >
                Home
            </Typography>
            <Grid container spacing={2} justify="center" alignItems="top">
                <Grid item>
                    <Typography className={classes.title}>
                        Club
                  </Typography>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>

                        </CardContent>
                    </Card>
                    <Typography className={classes.title}>
                        Latest Games
                  </Typography>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>

                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Typography className={classes.title}>
                        Latest News
                  </Typography>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>

                        </CardContent>
                    </Card>
                    <Typography className={classes.title}>
                        Latest Reservations
                  </Typography>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}