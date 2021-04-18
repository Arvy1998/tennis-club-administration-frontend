import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router';

import _ from 'lodash';
import moment from 'moment';

import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Button from '@material-ui/core/Button';

import Navigation from './Navigation';

import clsx from 'clsx';

import Grid from '@material-ui/core/Grid';

import Toolbar from '@material-ui/core/Toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_USER,
    LIST_GAMES,
} from './gql/queries/queries';

import stableSort from '../utils/comparators/stableSort';
import getComparator from '../utils/comparators/getComparator';
import gamesHeadCells from '../utils/cells/gamesHeadCells';
import isNotPlayer from '../utils/isNotPlayer';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    listContainer: {
        marginTop: theme.spacing(15),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignContent: 'center'
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    title: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    spacingBetweenFields: {
        padding: theme.spacing(1),
    },
    media: {
        width: theme.spacing(16),
        height: theme.spacing(9),
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    ratingGrid: {
        paddingRight: theme.spacing(6),
    },
    spacingBetweenRatingStars: {
        padding: theme.spacing(1),
    },
    spacingBetweenFields: {
        padding: theme.spacing(0.5),
    },
    buttonBox: {
        justifyContent: 'center',
        margin: theme.spacing(3, 0, 2),
    },
    spacingBetweenPagination: {
        padding: theme.spacing(1.5),
    }
}));

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {gamesHeadCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        { headCell.id === "players" || headCell.id === "matches" ? (
                            headCell.label
                        ) : (
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel>
                        )}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function Games() {
    const classes = useStyles();
    const history = useHistory();

    const [loadedGamesData, setLoadedGamesData] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const { loading, error, data } = isNotPlayer() ?
     useQuery(LIST_GAMES) : useQuery(GET_USER, { variables: { email: localStorage.getItem('email') } });

    useEffect(() => {
        if (loading) {
            setIsLoading(loading);
        }

        if (error) {
            setIsError(error);
            setIsLoading(false);
        }

        if (data) {
            setLoadedGamesData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    if (!loadedGamesData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let rows;
    if (loadedGamesData) {
        if (loadedGamesData && loadedGamesData.getUser && loadedGamesData.getUser.games) {
            rows = loadedGamesData.getUser.games;
        } else if (loadedGamesData.listGames) {
            rows = loadedGamesData.listGames;
        }
    }

    const handleRequestSort = (event, property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleEditDetails = (event, id) => {
        history.push(`/games/edit/${id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                <Grid container spacing={3} alignItems="center" justify="space-between">
                    {
                        isNotPlayer() ? (
                            <Button
                                variant="outlined"
                                color="secondary"
                                component="span"
                                onClick={() => { history.push('/games/add') }}
                            >
                                New Game
                            </Button>
                        ) : ''
                    }
                    <Toolbar
                        className={clsx(classes.root, {
                            [classes.highlight]: false,
                        })}
                    >
                    </Toolbar>
                </Grid>
                <Grid className={classes.spacingBetweenFields}></Grid>
                <Grid container spacing={3} alignItems="flex-end" justify="center">
                    <TableContainer>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            aria-label="enhanced table"
                        >
                            <EnhancedTableHead
                                classes={classes}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                            <TableBody>
                                {stableSort(rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleEditDetails(event, row.id)}
                                                tabIndex={-1}
                                                key={`${new Date()} ${row.date}`}
                                                selected={false}
                                            >
                                                <TableCell>{moment(row.date).format('YYYY-MM-DD HH:mm')}</TableCell>
                                                <TableCell>
                                                    {`${row.firstTeamFirstPlayer.firstName} ${row.firstTeamFirstPlayer.lastName}${row.firstTeamSecondPlayer ? ', ' : ' '}`}
                                                    {row.firstTeamSecondPlayer ? `${row.firstTeamSecondPlayer.firstName} ${row.firstTeamSecondPlayer.lastName}` : ''}
                                                    <br/>
                                                    {`${row.secondTeamFirstPlayer.firstName} ${row.secondTeamFirstPlayer.lastName}${row.secondTeamSecondPlayer ? ', ' : ' '}`}
                                                    {row.secondTeamSecondPlayer ? `${row.secondTeamSecondPlayer.firstName} ${row.secondTeamSecondPlayer.lastName}` : ''}
                                                </TableCell>
                                                <TableCell>
                                                    {`${row.matches[0].firstTeamScore} ${row.matches[1].firstTeamScore} ${row.matches[2] ? row.matches[2].firstTeamScore : ''}`}
                                                    <br/>
                                                    {`${row.matches[0].secondTeamScore} ${row.matches[1].secondTeamScore} ${row.matches[2] ? row.matches[2].secondTeamScore : ''}`}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid className={classes.spacingBetweenPagination}></Grid>
                <Grid container spacing={3} alignItems="center" justify="space-between">
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Grid>
            </Container>
        </div >
    );
}