import React, { useState, useEffect } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useHistory } from 'react-router';

import _ from 'lodash';

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
import Modal from '@material-ui/core/Modal';

import clsx from 'clsx';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import FilterListIcon from '@material-ui/icons/FilterList';

import TextFieldsIcon from '@material-ui/icons/TextFields';
import WebIcon from '@material-ui/icons/Web';

import { Typography } from '@material-ui/core';

import { useMutation } from "@apollo/react-hooks";
import {
    UPDATE_USER_BY_ID,
} from './gql/mutations/mutations';

import { useQuery } from "@apollo/react-hooks";
import {
    ALL_USERS,
} from './gql/queries/queries';

import areFiltersSelected from '../utils/areFiltersSelected';

import getModalStyle from '../utils/props/getModalStyle';

import stableSort from '../utils/comparators/stableSort';
import getComparator from '../utils/comparators/getComparator';
import adminUserManagementHeadCells from '../utils/cells/adminUserManagementHeadCells';
import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';

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
                {adminUserManagementHeadCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
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
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function AdminAccounts() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const [updated, setUpdated] = useState(null);

    const [loadedUsersData, setLoadedUsersData] = useState(null);
    const [filteredUsersData, setFilteredUsersData] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [editUser, { data: editUserById }] = useMutation(UPDATE_USER_BY_ID);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const { loading, error, data } = useQuery(ALL_USERS);

    /* Filtering state */
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [ID, setID] = useState('');

    useEffect(() => {
        if (loading) {
            setIsLoading(loading);
        }

        if (error) {
            setIsError(error);
            setIsLoading(false);
        }

        if (data) {
            /* also remove yourself from seach results */
            let alteredUsers = data;
            _.remove(alteredUsers.allUsers, {
                id: localStorage.getItem('id'),
            })

            setLoadedUsersData(alteredUsers);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    if (!loadedUsersData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let rows;
    if (loadedUsersData) {
        rows = loadedUsersData.allUsers;
    }

    const handleRequestSort = (event, property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function handleFilterModal(event) {
        event.preventDefault();
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    function handleUserEdit(id, status) {

        setUpdated(true);
        setIsLoading(true);

        editUser({
            variables: {
                id,
                userInput: filterNotEnteredEntries({
                    status: status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE',
                }),
            },
        });

        setUpdated(false);
        setIsLoading(false);
    }

    function handleFilterSubmit(event) {
        event.preventDefault();

        let filteredData = loadedUsersData.allUsers;

        if (firstName !== '') {
            filteredData = filteredData.filter(
                data => data.firstName.includes(firstName),
            );
        }

        if (lastName !== '') {
            filteredData = filteredData.filter(
                data => data.lastName.includes(lastName),
            );
        }

        if (ID !== '') {
            filteredData = filteredData.filter(
                data => data.id.includes(ID),
            );
        }

        setFilteredUsersData(filteredData);
        setOpen(false);
    };

    function handleFilterClear(event) {
        event.preventDefault();

        setFirstName('');
        setLastName('');
        setID('');

        setFilteredUsersData(loadedUsersData.allUsers);
    }

    if (!rows) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    if (!editUserById && updated) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    if (editUserById) {
        history.push('/accounts');
        window.location.reload(true);
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <Typography className={classes.title}>
                Select Filters:
            </Typography>
            <form className={classes.form} onSubmit={handleFilterSubmit}>
                <Grid container>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <WebIcon />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoComplete="id"
                                defaultValue={ID}
                                name="id"
                                style={{ width: 200 }}
                                id="id"
                                label="Row ID"
                                onInput={e => setID(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <TextFieldsIcon />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoComplete="firstName"
                                defaultValue={firstName}
                                name="firstName"
                                style={{ width: 200 }}
                                id="firstName"
                                label="First Name"
                                onInput={e => setFirstName(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <TextFieldsIcon />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoComplete="lastName"
                                defaultValue={lastName}
                                name="lastName"
                                style={{ width: 200 }}
                                id="lastName"
                                label="Last Name"
                                onInput={e => setLastName(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container alignItems="center" justify="space-between">
                        <Button
                            onClick={handleFilterClear}
                            variant="outlined"
                            color="secondary"
                            className={classes.buttonBox}
                            disabled={!areFiltersSelected({
                                firstName, lastName, ID,
                            })}
                        >
                            Clear Filters
                        </Button>
                        <Button
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            className={classes.buttonBox}
                            disabled={!areFiltersSelected({
                                firstName, lastName, ID,
                            })}
                        >
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );

    return (
        <div className={classes.root}>
            <Navigation />
            <Container className={classes.listContainer}>
                <Grid container spacing={3} alignItems="center" justify="space-between">
                    <Toolbar
                        className={clsx(classes.root, {
                            [classes.highlight]: false,
                        })}
                    >
                        <Typography className={classes.title}>
                            Filter Users
                        </Typography>
                        <Tooltip title="Filter list">
                            <IconButton
                                aria-label="filter list"
                                onClick={handleFilterModal}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {body}
                        </Modal>
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
                                {stableSort(filteredUsersData || rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                tabIndex={-1}
                                                key={`${new Date()} ${row.id}`}
                                                selected={false}
                                            >
                                                <TableCell>{row.id}</TableCell>
                                                <TableCell>{row.firstName}</TableCell>
                                                <TableCell>{row.lastName}</TableCell>
                                                <TableCell>
                                                    <Grid container spacing={1} alignItems="center">
                                                        <Grid item>
                                                            <Button
                                                                id="activate-reactivate"
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={() => {
                                                                    handleUserEdit(row.id, row.status)
                                                                }}
                                                            >
                                                                {
                                                                    row.status === 'ACTIVE' ? 'Block' : 'Unblock'
                                                                }
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
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