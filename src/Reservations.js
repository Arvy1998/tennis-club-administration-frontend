import React, { useState, useEffect } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';

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
import Modal from '@material-ui/core/Modal';

import clsx from 'clsx';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import InfoIcon from '@material-ui/icons/Info';
import FilterListIcon from '@material-ui/icons/FilterList';

import TextFieldsIcon from '@material-ui/icons/TextFields';
import HomeIcon from '@material-ui/icons/Home';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import EventIcon from '@material-ui/icons/Event';

import { Typography } from '@material-ui/core';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_RESERVATIONS_BY_USER_ID,
} from './gql/queries/queries';

import areFiltersSelected from '../utils/areFiltersSelected';

import MenuProps from '../utils/props/MenuProps';
import getDropdownStyles from '../utils/props/getDropdownStyles';
import getModalStyle from '../utils/props/getModalStyle';

import stableSort from '../utils/comparators/stableSort';
import getComparator from '../utils/comparators/getComparator';
import reservationsHeadCells from '../utils/cells/reservationsHeadCells';

import transformReservationsData from '../utils/transformations/transformReservationsData';

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
                {reservationsHeadCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        { headCell.id === "info" ? (
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

export default function Reservations() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const [loadedReservationsData, setLoadedReservationsData] = useState(null);
    const [filteredReservationsData, setFilteredReservationsData] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const { loading, error, data } = useQuery(GET_RESERVATIONS_BY_USER_ID, {
        variables: { userId: localStorage.getItem('id') }
    });

    /* Filtering state */
    const [title, setTitle] = useState('');
    const [city, setCity] = useState('Not Selected');
    const [cost, setCost] = useState(0);
    const [startDateTime, setStartDateTime] = useState('Not Selected');
    const [endDateTime, setEndDateTime] = useState('Not Selected');
    const [paid, setPaid] = useState('Not Selected');
    const [status, setStatus] = useState('Not Selected');

    useEffect(() => {
        if (loading) {
            setIsLoading(loading);
        }

        if (error) {
            setIsError(error);
            setIsLoading(false);
        }

        if (data) {
            setLoadedReservationsData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    if (!loadedReservationsData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let rows;
    if (loadedReservationsData) {
        rows = transformReservationsData(loadedReservationsData.getReservationsByUserId);
    }

    let availableCities = _.uniq(rows.map(row => row.playFieldCity));
    availableCities.push('Not Selected');

    let availableStatuses = [
        'Active',
        'Canceled',
        'Not Selected'
    ];

    let availablePaid = [
        'Paid',
        'Not Paid',
        'Not Selected',
    ];

    const handleRequestSort = (event, property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleEditDetails = (event, playFieldId, reservationId) => {
        history.push(`/reservations/edit/${playFieldId}/${reservationId}`);
    };

    function handleCitySelect(event) {
        setCity(event.target.value);
    };

    function handlePaidStatusSelect(event) {
        setPaid(event.target.value);
    }

    function handleStatusSelect(event) {
        setStatus(event.target.value);
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

    function handleFilterSubmit(event) {
        event.preventDefault();

        let filteredData = transformReservationsData(loadedReservationsData.getReservationsByUserId);
        if (title) {
            filteredData = filteredData.filter(
                data => data.playFieldTitle.includes(title),
            );
        }

        if (city !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.playFieldCity === city,
            );
        }

        if (cost !== 0) {
            filteredData = filteredData.filter(
                data => data.totalCost <= cost,
            );
        }

        if (startDateTime !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => Date.parse(data.startDateTime) >= Date.parse(startDateTime),
            );
        }

        if (endDateTime !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => Date.parse(data.endDateTime) <= Date.parse(endDateTime),
            );
        }

        if (paid !== 'Not Selected') {
            if (paid === 'Paid') {
                filteredData = filteredData.filter(
                    data => data.paid === true,
                );
            } else {
                filteredData = filteredData.filter(
                    data => data.paid === false,
                );
            }
        }

        if (status !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.status === status,
            );
        }

        setFilteredReservationsData(filteredData);
        setOpen(false);
    };

    function handleFilterClear(event) {
        event.preventDefault();

        setTitle('');
        setCity('Not Selected');
        setCost(0);
        setStartDateTime('Not Selected');
        setEndDateTime('Not Selected');
        setPaid('Not Selected');
        setStatus('Not Selected');

        setFilteredReservationsData(transformReservationsData(loadedReservationsData.getReservationsByUserId));
    }

    if (!rows) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
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
                            <TextFieldsIcon />
                        </Grid>
                        <Grid item>
                            <TextField
                                autoComplete="title"
                                defaultValue={title}
                                name="title"
                                style={{ width: 200 }}
                                id="title"
                                label="Title"
                                onInput={e => setTitle(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <HomeIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="city">City</InputLabel>
                                <Select
                                    labelId="city"
                                    id="city"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handleCitySelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availableCities.map((cityToSelect) => (
                                        <MenuItem key={cityToSelect} value={cityToSelect} style={
                                            getDropdownStyles(cityToSelect, city, theme)
                                        }>
                                            {cityToSelect}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <EuroSymbolIcon />
                        </Grid>
                        <Grid item>
                            <TextField
                                style={{ width: 175 }}
                                id="totalCost"
                                defaultValue={cost}
                                label="Total Reservation Cost"
                                name="totalCost"
                                autoComplete="totalCost"
                                onInput={e => setCost(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                placement="right"
                                title="Total reservation cost in euros. Filtered values are less or equal to the entered value."
                            >
                                <InfoIcon />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <EventIcon />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="startDateTime"
                                label="Reservation Start Time"
                                style={{ width: 250 }}
                                type="datetime-local"
                                onInput={e => setStartDateTime(e.target.value)}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                placement="right"
                                title="Filtered values are equal or past to the selected date."
                            >
                                <InfoIcon />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <EventIcon />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="endDateTime"
                                label="Reservation End Time"
                                style={{ width: 250 }}
                                type="datetime-local"
                                onInput={e => setEndDateTime(e.target.value)}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                placement="right"
                                title="Filtered values are equal or past to the selected date."
                            >
                                <InfoIcon />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <HomeIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="paid">Payment Status</InputLabel>
                                <Select
                                    labelId="paid"
                                    id="paid"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handlePaidStatusSelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availablePaid.map((isPaid) => (
                                        <MenuItem key={isPaid} value={isPaid} style={
                                            getDropdownStyles(isPaid, paid, theme)
                                        }>
                                            {isPaid}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <HomeIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="reservation-status">Reservation Status</InputLabel>
                                <Select
                                    labelId="reservation-status"
                                    id="reservation-status"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handleStatusSelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availableStatuses.map((check) => (
                                        <MenuItem key={check} value={check} style={
                                            getDropdownStyles(check, status, theme)
                                        }>
                                            {check}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
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
                                title, city, cost, startDateTime, endDateTime, paid, status,
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
                                title, city, cost, startDateTime, endDateTime, paid, status,
                            })}
                        >
                            Filter
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div >
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
                            Filter Reservations
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
                                {stableSort(filteredReservationsData || rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleEditDetails(event, row.playField.id, row.id)}
                                                tabIndex={-1}
                                                key={`${new Date()} ${row.startDateTime} ${row.endDateTime}`}
                                                selected={false}
                                                style={
                                                    Date.parse(row.endDateTime) < new Date() || row.status === 'Canceled' ? 
                                                    { backgroundColor: '#ffcccc', color: 'white' } : {}
                                                }
                                            >
                                                <TableCell>{row.playFieldTitle}</TableCell>
                                                <TableCell>{row.playFieldCity}</TableCell>
                                                <TableCell>{row.playFieldAddress}</TableCell>
                                                <TableCell>{row.totalCost ? row.totalCost.toFixed(2) : ''} €</TableCell>
                                                <TableCell>{moment(row.startDateTime).format('YYYY-MM-DD HH:mm')}</TableCell>
                                                <TableCell>{moment(row.endDateTime).format('YYYY-MM-DD HH:mm')}</TableCell>
                                                <TableCell>{row.paid ? 'Paid' : 'Not Paid'}</TableCell>
                                                <TableCell>{row.status}</TableCell>
                                                <TableCell>
                                                    {
                                                        Date.parse(row.endDateTime) < new Date() ? (
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