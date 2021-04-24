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
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

const { Radar } = require("react-chartjs-2")

import { Table, TableCell, TableRow } from '@material-ui/core';

import Navigation from './Navigation';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_USER,
    GET_USER_BY_ID,
    LIST_CLUBS,
    LIST_BADGES,
} from './gql/queries/queries';

import badgesIconMap from '../utils/badges/badgesIconMap';
import levelSelectionMap from '../utils/levelSelectionMap';

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
        width: theme.spacing(8),
        height: theme.spacing(8),
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

export default function PlayerDetails({ match }) {
    const classes = useStyles();

    const [loadedUsersData, setLoadedUsersData] = useState(null);
    const [loadedYourData, setLoadedYourData] = useState(null);
    const [loadedClubsData, setLoadedClubsData] = useState(null);
    const [loadedBadgesData, setLoadedBadgesData] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const { loading, error, data } = useQuery(GET_USER_BY_ID, { variables: { id: match.params.id } });
    const { loading: yourUserLoading, error: yourUserError, data: yourUserData } = useQuery(
        GET_USER, { variables: { email: localStorage.getItem('email') } }
    );
    const { loading: clubsLoading, error: clubsError, data: clubsData } = useQuery(LIST_CLUBS);
    const { loading: badgesLoading, error: badgesError, data: badgesData } = useQuery(LIST_BADGES);

    useEffect(() => {
        if (loading) {
            setIsLoading(loading);
        }

        if (error) {
            setIsError(error);
            setIsLoading(false);
        }

        if (data) {
            setLoadedUsersData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    useEffect(() => {
        if (yourUserLoading) {
            setIsLoading(yourUserLoading);
        }

        if (yourUserError) {
            setIsError(yourUserError);
            setIsLoading(false);
        }

        if (clubsData) {
            setLoadedClubsData(clubsData);
            setIsLoading(false);
        }
    }, [yourUserLoading, yourUserError, clubsData]);

    useEffect(() => {
        if (clubsLoading) {
            setIsLoading(clubsLoading);
        }

        if (clubsError) {
            setIsError(clubsError);
            setIsLoading(false);
        }

        if (yourUserData) {
            setLoadedYourData(yourUserData);
            setIsLoading(false);
        }
    }, [clubsLoading, clubsError, yourUserData]);

    useEffect(() => {
        if (badgesLoading) {
            setIsLoading(badgesLoading);
        }

        if (badgesError) {
            setIsError(badgesError);
            setIsLoading(false);
        }

        if (badgesData) {
            setLoadedBadgesData(badgesData);
            setIsLoading(false);
        }
    }, [badgesLoading, badgesError, badgesData]);

    if (!loadedUsersData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    if (!loadedYourData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    if (!loadedClubsData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    if (!loadedBadgesData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let clubs;
    if (loadedClubsData) {
        clubs = loadedClubsData.listClubs;
    }

    let yourUser;
    if (loadedYourData) {
        yourUser = loadedYourData.getUser;

        clubs.map(club => {
            if (club.users.map(user => user.id).includes(yourUser.id)) {
                yourUser.clubTitle = club.title;
                yourUser.clubLogo = club.clubLogo;
                yourUser.badgeIds = yourUser.badges.map(badge => badge.id);
            }
        });
    }

    let opponentUser;
    if (loadedUsersData) {
        opponentUser = loadedUsersData.getUserById;

        clubs.map(club => {
            if (club.users.map(user => user.id).includes(opponentUser.id)) {
                opponentUser.clubTitle = club.title;
                opponentUser.clubLogo = club.clubLogo;
                opponentUser.badgeIds = opponentUser.badges.map(badge => badge.id);
            }
        });
    }

    let systemBadges;
    if (loadedBadgesData) {
        systemBadges = loadedBadgesData.listBadges;
    }

    const sexMap = {
        'MALE': 'Male',
        'FEMALE': 'Female',
        'OTHER': 'Other',
    }

    const levelMap = _.invert(levelSelectionMap);

    const yourGamesSeries = yourUser.games.map(game => {
        let matchWeight = 0;
        let userFromTeam = game.firstTeamFirstPlayer.id === yourUser.id || (game.firstTeamSecondPlayer && game.firstTeamSecondPlayer.id === yourUser.id) ? 1 : 2;

        game.matches.map(match => {
            if (match.firstTeamScore > match.secondTeamScore && userFromTeam === 1) {
                matchWeight++;
            }
            if (match.firstTeamScore > match.secondTeamScore && userFromTeam === 2) {
                matchWeight--;
            }
            if (match.firstTeamScore < match.secondTeamScore && userFromTeam === 1) {
                matchWeight--;
            }
            if (match.firstTeamScore < match.secondTeamScore && userFromTeam === 2) {
                matchWeight++;
            }
        });

        return {
            month: moment(game.date).format('MMMM'),
            value: matchWeight > 0 ? 1 : 0,
        }
    });

    const opponentGamesSeries = opponentUser.games.map(game => {
        let matchWeight = 0;
        let userFromTeam = game.firstTeamFirstPlayer.id === opponentUser.id || (game.firstTeamSecondPlayer && game.firstTeamSecondPlayer.id === opponentUser.id) ? 1 : 2;

        game.matches.map(match => {
            if (match.firstTeamScore > match.secondTeamScore && userFromTeam === 1) {
                matchWeight++;
            }
            if (match.firstTeamScore > match.secondTeamScore && userFromTeam === 2) {
                matchWeight--;
            }
            if (match.firstTeamScore < match.secondTeamScore && userFromTeam === 1) {
                matchWeight--;
            }
            if (match.firstTeamScore < match.secondTeamScore && userFromTeam === 2) {
                matchWeight++;
            }
        });

        return {
            month: moment(game.date).format('MMMM'),
            value: matchWeight > 0 ? 1 : 0,
        }
    });

    const monthLabels = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const yourWonGames = monthLabels.map(month => {
        const monthlyWonGames = yourGamesSeries.filter(series => series.month === month);
        let wonGames = 0;

        if (!monthlyWonGames) return 0;
        monthlyWonGames.map(game => {
            if (game.value > 0) {
                wonGames++;
            }
        })
        return wonGames;
    });

    const yourLostGames = monthLabels.map(month => {
        const monthlyLostGames = yourGamesSeries.filter(series => series.month === month);
        let lostGames = 0;

        if (!monthlyLostGames) return 0;
        monthlyLostGames.map(game => {
            if (game.value === 0) {
                lostGames++;
            }
        })
        return lostGames;
    });

    const opponentWonGames = monthLabels.map(month => {
        const monthlyWonGames = opponentGamesSeries.filter(series => series.month === month);
        let wonGames = 0;

        if (!monthlyWonGames) return 0;
        monthlyWonGames.map(game => {
            if (game.value > 0) {
                wonGames++;
            }
        })
        return wonGames;
    });

    const opponentLostGames = monthLabels.map(month => {
        const monthlyLostGames = opponentGamesSeries.filter(series => series.month === month);
        let lostGames = 0;

        if (!monthlyLostGames) return 0;
        monthlyLostGames.map(game => {
            if (game.value === 0) {
                lostGames++;
            }
        })
        return lostGames;
    });

    const yourGamesData = {
        labels: monthLabels,
        datasets: [{
            label: 'Games Lost',
            data: yourLostGames,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }, {
            label: 'Games Won',
            data: yourWonGames,
            fill: true,
            backgroundColor: 'rgba(54, 235, 162, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    };

    const opponentsGamesData = {
        labels: monthLabels,
        datasets: [{
            label: 'Games Lost',
            data: opponentLostGames,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }, {
            label: 'Games Won',
            data: opponentWonGames,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
    };

    const configYourRadar = {
        type: 'radar',
        data: yourGamesData,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        },
    };

    const configOpponentsRadar = {
        type: 'radar',
        data: opponentsGamesData,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        },
    };

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
                            You vs. {opponentUser.firstName} {opponentUser.lastName}
                        </Typography>
                    </Grid>
                    <Grid className={classes.spacingBetween}></Grid>
                    <Grid container spacing={2} justify="center">
                        <Grid item>
                            <Card className={classes.card} variant="outlined">
                                <CardContent>
                                    <Table>
                                        <TableRow>
                                            <TableCell variant="head"><b>Photo</b></TableCell>
                                            <TableCell>
                                                <Avatar
                                                    id="avatar"
                                                    sizes="100px"
                                                    src={yourUser.userProfilePhoto || ''}
                                                    className={classes.large}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Club</b></TableCell>
                                            <TableCell>
                                                <Tooltip title={yourUser.clubTitle} placement="top">
                                                    <Avatar
                                                        id="avatar"
                                                        sizes="100px"
                                                        src={yourUser.clubLogo || ''}
                                                        className={classes.large}
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>City</b></TableCell>
                                            <TableCell>{yourUser.city || 'Not Entered'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Address</b></TableCell>
                                            <TableCell>{yourUser.address || 'Not Entered'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Phone Number</b></TableCell>
                                            <TableCell>{yourUser.phoneNumber || 'Not Entered'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Sex</b></TableCell>
                                            <TableCell>{sexMap[yourUser.sex] || 'Not Selected'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Level</b></TableCell>
                                            <TableCell>{levelMap[yourUser.level] || 'Not Selected'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Main Hand</b></TableCell>
                                            <TableCell>{yourUser.mainHand || 'Not Selected'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Rating</b></TableCell>
                                            <TableCell>{yourUser.rating || 0}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Badges</b></TableCell>
                                            <TableCell>{systemBadges.map(badge => {
                                                return (
                                                    <Tooltip
                                                        placement="top"
                                                        title={badge.description}
                                                    >
                                                        <Grid item spacing={1}>
                                                            {yourUser.badgeIds.includes(badge.id) ? (
                                                                <Chip
                                                                    icon={badgesIconMap[badge.id]}
                                                                    label={badge.title}
                                                                    color="secondary"
                                                                />
                                                            ) : ''}
                                                        </Grid>
                                                    </Tooltip>
                                                );
                                            })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Games</b></TableCell>
                                            <TableCell>{
                                                <Radar data={yourGamesData} options={configYourRadar} />
                                            }</TableCell>
                                        </TableRow>
                                    </Table>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={classes.card} variant="outlined">
                                <CardContent>
                                    <Table>
                                        <TableRow>
                                            <TableCell variant="head"><b>Photo</b></TableCell>
                                            <TableCell>
                                                <Avatar
                                                    id="avatar"
                                                    sizes="100px"
                                                    src={opponentUser.userProfilePhoto || ''}
                                                    className={classes.large}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Club</b></TableCell>
                                            <TableCell>
                                                <Tooltip title={opponentUser.clubTitle} placement="top">
                                                    <Avatar
                                                        id="avatar"
                                                        sizes="100px"
                                                        src={opponentUser.clubLogo || ''}
                                                        className={classes.large}
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>City</b></TableCell>
                                            <TableCell>{opponentUser.city || 'Not Entered'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Address</b></TableCell>
                                            <TableCell>{opponentUser.address || 'Not Entered'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Phone Number</b></TableCell>
                                            <TableCell>{opponentUser.phoneNumber || 'Not Entered'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Sex</b></TableCell>
                                            <TableCell>{sexMap[opponentUser.sex] || 'Not Selected'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Level</b></TableCell>
                                            <TableCell>{levelMap[opponentUser.level] || 'Not Selected'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Main Hand</b></TableCell>
                                            <TableCell>{opponentUser.mainHand || 'Not Selected'}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Rating</b></TableCell>
                                            <TableCell>{opponentUser.rating || 0}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Badges</b></TableCell>
                                            <TableCell>{systemBadges.map(badge => {
                                                return (
                                                    <Tooltip
                                                        placement="top"
                                                        title={badge.description}
                                                    >
                                                        <Grid item spacing={1}>
                                                            {opponentUser.badgeIds.includes(badge.id) ? (
                                                                <Chip
                                                                    icon={badgesIconMap[badge.id]}
                                                                    label={badge.title}
                                                                    color="secondary"
                                                                />
                                                            ) : ''}
                                                        </Grid>
                                                    </Tooltip>
                                                );
                                            })}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="head"><b>Games</b></TableCell>
                                            <TableCell>{
                                                <Radar data={opponentsGamesData} options={configOpponentsRadar} />
                                            }</TableCell>
                                        </TableRow>
                                    </Table>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div >
    );
}