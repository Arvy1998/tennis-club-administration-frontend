import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import _ from 'lodash';

import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';

import Navigation from './Navigation';
import Grid from '@material-ui/core/Grid';

import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import Looks3Icon from '@material-ui/icons/Looks3';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_PLAYERS,
    LIST_CLUBS,
} from './gql/queries/queries';

import transformUsersData from '../utils/transformations/transformUsersData';
import topPlayersHeadCells from '../utils/cells/topPlayersHeadCells';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    listContainer: {
        marginTop: theme.spacing(10),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignContent: 'center'
    },
    table: {
        minWidth: 750,
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    media: {
        width: theme.spacing(16),
        height: theme.spacing(9),
    },
    spacingBetweenRatingStars: {
        padding: theme.spacing(1),
    },
    spacingBetweenFields: {
        padding: theme.spacing(0.5),
    },
    welcomeText: {
        color: 'grey',
    },
    numberSpacing: {
        margin: theme.spacing(0.5),
    }
}));

function EnhancedTableHead() {
    return (
        <TableHead>
            <TableRow>
                {topPlayersHeadCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function Players() {
    const classes = useStyles();

    const [loadedPlayersData, setLoadedPlayersData] = useState(null);

    const [loadedClubsData, setLoadedClubsData] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const { loading: playersLoading, error: playersError, data: playersData } = useQuery(GET_PLAYERS);
    const { loading: clubsLoading, error: clubsError, data: clubsData } = useQuery(LIST_CLUBS);

    useEffect(() => {
        if (playersLoading) {
            setIsLoading(playersLoading);
        }

        if (playersError) {
            setIsError(playersError);
            setIsLoading(false);
        }

        if (playersData) {
            setLoadedPlayersData(playersData);
            setIsLoading(false);
        }
    }, [playersLoading, playersError, playersData]);

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

    if (!loadedPlayersData || isLoading) {
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

    let rows;
    if (loadedPlayersData) {
        rows = transformUsersData(loadedPlayersData.getPlayers, loadedClubsData.listClubs);
        rows = _.orderBy(rows, 'rating', 'desc');

        rows = rows.filter(user => user.rating > 0);
        rows = rows.slice(0, 10);
    }

    if (!rows) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <Navigation />
            <Container className={classes.listContainer}>
                <Grid className={classes.spacingBetweenFields}></Grid>
                <Grid container spacing={3} alignItems="flex-end" justify="center">
                    <Grid item>
                        <Typography
                            component="h1"
                            variant="h5"
                            className={classes.welcomeText}
                        >
                            TOP Players
                        </Typography>
                    </Grid>
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {rows.map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            tabIndex={-1}
                                            key={`${new Date()} ${row.id}`}
                                            selected={false}
                                        >
                                            <TableCell>
                                                {
                                                    index === 0 ? (
                                                        <LooksOneIcon />
                                                    ) : ''
                                                }
                                                {
                                                    index === 1 ? (
                                                        <LooksTwoIcon />
                                                    ) : ''
                                                }
                                                {
                                                    index === 2 ? (
                                                        <Looks3Icon />
                                                    ) : ''
                                                }
                                                {
                                                    index > 2 ? (
                                                        <div>
                                                            <div className={classes.numberSpacing}/>
                                                            { index + 1 }
                                                        </div>
                                                    ) : ''
                                                }
                                            </TableCell>
                                            <TableCell>{row.firstName}</TableCell>
                                            <TableCell>{row.lastName}</TableCell>
                                            <TableCell>{row.rating}</TableCell>
                                            <TableCell>
                                                {row.clubTitle !== '' ? (
                                                    <Grid container spacing={1} alignItems="center">
                                                        <Grid item>
                                                            <Avatar
                                                                id="avatar"
                                                                sizes="100px"
                                                                alt={`${row.id}`}
                                                                src={row.clubLogo}
                                                                className={classes.large}
                                                            />
                                                        </Grid>
                                                        <Grid item>
                                                            {row.clubTitle}
                                                        </Grid>
                                                    </Grid>
                                                ) : ''}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Container>
        </div >
    );
}