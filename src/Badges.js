import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import ClearTwoToneIcon from '@material-ui/icons/ClearTwoTone';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

import Navigation from './Navigation';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_USER,
    LIST_BADGES,
} from './gql/queries/queries';
import badgesIconMap from '../utils/badges/badgesIconMap';

const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    welcomeText: {
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    appName: {
        fontWeight: 'bold',
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
    input: {
        display: 'none',
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

export default function Account() {
    const classes = useStyles();

    const [loadedBadgesData, setLoadedBadgesData] = useState(null);
    const [loadedUserData, setLoadedUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { email: localStorage.getItem('email') },
    });

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
            setLoadedUserData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

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

    if (!loadedUserData || isLoading) {
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

    let userBadges;
    if (loadedUserData) {
        userBadges = loadedUserData.getUser.badges.map(badge => badge.id);
    }

    let systemBadges;
    if (loadedBadgesData) {
        systemBadges = _.sortBy(loadedBadgesData.listBadges, 'id');
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
                            Your Badges
                        </Typography>
                    </Grid>
                    <Grid className={classes.spacingBetween}></Grid>
                    <Grid container spacing={2} justify="center" alignItems="flex-end">
                        {systemBadges.map(badge => {
                            return (
                                <Tooltip
                                    placement="top"
                                    title={badge.description}
                                >
                                    <Grid item>
                                        <Chip
                                            icon={badgesIconMap[badge.id]}
                                            label={badge.title}
                                            color={userBadges.includes(badge.id) ? "secondary" : ""}
                                            deleteIcon={userBadges.includes(badge.id) ? <DoneIcon /> : <ClearTwoToneIcon />}
                                            disabled={userBadges.includes(badge.id) ? false : true}
                                        />
                                    </Grid>
                                </Tooltip>
                            );
                        })}
                    </Grid>
                </Grid>
            </Container>
        </div >
    );
}