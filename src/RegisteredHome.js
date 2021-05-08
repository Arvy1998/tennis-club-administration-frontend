import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';

import { Table, TableCell, TableRow } from '@material-ui/core';

import moment from 'moment';
import _ from 'lodash';

import InfoIcon from '@material-ui/icons/Info';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';

import { Typography } from '@material-ui/core';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_USER,
    LIST_CLUBS,
    LIST_RESERVATIONS,
    LIST_NEWS,
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
    },
    large: {
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 500,
    },
    cardDescription: {
        fontSize: 14,
    },
    card: {
        minWidth: 275,
    },
}));

export default function RegisteredHome() {
    const classes = useStyles();
    const history = useHistory();

    const [loadedUsersData, setLoadedUsersData] = useState(null);
    const [loadedReservationsData, setLoadedReservationsData] = useState(null);
    const [loadedClubsData, setLoadedClubsData] = useState(null);
    const [loadedNewsData, setLoadedNewsData] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const { loading, error, data } = useQuery(LIST_NEWS);
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

    if (!loadedNewsData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <CircularProgress color="secondary" />
            </div>
        );
    }

    let clubs;
    if (loadedClubsData) {
        clubs = loadedClubsData.listClubs;
    }

    let user;
    let games;
    if (loadedUsersData) {
        user = loadedUsersData.getUser;

        clubs.map(club => {
            if (club.users.map(clubUser => clubUser.id).includes(user.id)) {
                user.clubTitle = club.title;
                user.clubLogo = club.clubLogo;
                user.teammates = club.users.map(user => ({
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                }))
            }
        });

        if (!user.teammates) {
            user.teammates = [];
        }

        _.remove(user.teammates, {
            id: localStorage.getItem('id'),
        })

        games = _.orderBy(loadedUsersData.getUser.games, 'date', 'asc').slice(0, 4);
    }

    let reservations;
    if (loadedReservationsData) {
        reservations = loadedReservationsData.listReservations.map(reservation => {
            if (reservation.user.id === localStorage.getItem('id')) {
                return reservation;
            }
        });
        reservations = _.orderBy(_.compact(reservations), 'startDateTime', 'desc').slice(0, 4);
    }

    let newsCards;
    if (loadedNewsData) {
        newsCards = _.orderBy(loadedNewsData.listNews, 'date', 'desc').slice(0, 2);
    }

    const handleOpenDetails = (event, id) => {
        history.push(`/players/${id}`);
    };

    const handleOpenGameDetails = (event, id) => {
        history.push(`/games/edit/${id}`);
    }

    const handleOpenReservationDetails = (event, reservationId, playFieldId) => {
        history.push(`/reservations/edit/${playFieldId}/${reservationId}`);
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
            <Grid container spacing={2} justify="center">
                <Grid item>
                    {
                        localStorage.getItem('role') === 'TRENNER' || localStorage.getItem('role') === 'ADMIN' ? '' : (
                            <div>
                                <Typography className={classes.title}>
                                    Club
                                </Typography>
                                <Card className={classes.card} variant="outlined">
                                    <CardContent>
                                        <Grid container spacing={2} justify="center" alignItems="center">
                                            <Grid item>
                                                <Tooltip title={user.clubTitle} placement="top">
                                                    <Avatar
                                                        id="avatar"
                                                        sizes="100px"
                                                        src={user.clubLogo || ''}
                                                        className={classes.large}
                                                    />
                                                </Tooltip>
                                            </Grid>
                                            <Grid item>
                                                <Typography className={classes.cardDescription} color="textSecondary">
                                                    {user.clubTitle}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} justify="center" alignItems="center">
                                            <Grid item>
                                                <Typography className={classes.cardDescription} color="textSecondary">
                                                    Teammates:
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} justify="center" alignItems="center">
                                            <Grid item>
                                                <Table size="small">
                                                    {user.teammates.map(teammate => (
                                                        <TableRow
                                                            hover
                                                            key={`${new Date()} ${teammate.id}`}
                                                            onClick={(event) => handleOpenDetails(event, teammate.id)}
                                                            selected={false}
                                                        >
                                                            <TableCell>{teammate.firstName} {teammate.lastName}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </Table>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    }
                    <Typography className={classes.title}>
                        Latest Reservations
                    </Typography>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>
                            <Grid container spacing={2} justify="center" alignItems="center">
                                <Grid item>
                                    <Table size="small">
                                        {reservations.length > 0 ? reservations.map(reservation => (
                                            <TableRow
                                                hover
                                                key={`${new Date()} ${reservation.id}`}
                                                onClick={(event) => handleOpenReservationDetails(event, reservation.id, reservation.playField.id)}
                                                selected={false}
                                                style={
                                                    Date.parse(reservation.endDateTime) < new Date() || reservation.status === 'Canceled' ?
                                                        { backgroundColor: '#ffcccc' } : {}
                                                }
                                            >
                                                <TableCell>Start: {moment(reservation.startDateTime).format('YYYY-MM-DD HH:mm')}</TableCell>
                                                <TableCell>At: {reservation.playField.title}</TableCell>
                                                <TableCell>{reservation.playField.city}, {reservation.playField.address}</TableCell>
                                                <TableCell>{parseFloat(reservation.totalCost).toFixed(2)} €</TableCell>
                                                <TableCell>
                                                    {
                                                        Date.parse(reservation.endDateTime) < new Date() ? (
                                                            <Tooltip
                                                                placement="top"
                                                                title="This reservation is past time by now."
                                                            >
                                                                <InfoIcon />
                                                            </Tooltip>
                                                        ) : ''
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )) : 'No Reservations'}
                                    </Table>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Typography className={classes.title}>
                        Latest Games
                    </Typography>
                    <Card className={classes.card} variant="outlined">
                        <CardContent>
                            <Grid container spacing={2} justify="center" alignItems="center">
                                <Grid item>
                                    <Table size="small">
                                        {games.length > 0 ? games.map(game => (
                                            <TableRow
                                                hover
                                                key={`${new Date()} ${game.id}`}
                                                onClick={(event) => handleOpenGameDetails(event, game.id)}
                                                selected={false}
                                            >
                                                <TableCell>{moment(game.date).format('YYYY-MM-DD HH:mm')}</TableCell>
                                                <TableCell>
                                                    {`${game.firstTeamFirstPlayer.firstName} ${game.firstTeamFirstPlayer.lastName}${game.firstTeamSecondPlayer ? ', ' : ' '}`}
                                                    {game.firstTeamSecondPlayer ? `${game.firstTeamSecondPlayer.firstName} ${game.firstTeamSecondPlayer.lastName}` : ''}
                                                    <br />
                                                    {`${game.secondTeamFirstPlayer.firstName} ${game.secondTeamFirstPlayer.lastName}${game.secondTeamSecondPlayer ? ', ' : ' '}`}
                                                    {game.secondTeamSecondPlayer ? `${game.secondTeamSecondPlayer.firstName} ${game.secondTeamSecondPlayer.lastName}` : ''}
                                                </TableCell>
                                                <TableCell>
                                                    {`${game.matches[0].firstTeamScore} ${game.matches[1].firstTeamScore} ${game.matches[2] ? game.matches[2].firstTeamScore : ''}`}
                                                    <br />
                                                    {`${game.matches[0].secondTeamScore} ${game.matches[1].secondTeamScore} ${game.matches[2] ? game.matches[2].secondTeamScore : ''}`}
                                                </TableCell>
                                            </TableRow>
                                        )) : 'No Games'}
                                    </Table>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item>
                    <Typography className={classes.title}>
                        Latest News
                    </Typography>
                    <Card className={classes.card} variant="outlined">
                        {newsCards.length > 0 ? newsCards.map(card => (
                            <CardContent
                                key={`${new Date()} ${card.id}`}
                            >
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
                        )) : 'No News To Display'}
                    </Card>
                </Grid>
            </Grid>
        </Grid>
    );
}