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
import Avatar from '@material-ui/core/Avatar';
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
import PhotoIcon from '@material-ui/icons/Photo';
import InfoIcon from '@material-ui/icons/Info';
import FilterListIcon from '@material-ui/icons/FilterList';

import TextFieldsIcon from '@material-ui/icons/TextFields';
import HomeIcon from '@material-ui/icons/Home';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';

import { Typography } from '@material-ui/core';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_PLAYFIELDS,
} from './gql/queries/queries';

import areFiltersSelected from '../utils/areFiltersSelected';

import MenuProps from '../utils/props/MenuProps';
import getDropdownStyles from '../utils/props/getDropdownStyles';
import getModalStyle from '../utils/props/getModalStyle';

import stableSort from '../utils/comparators/stableSort';
import getComparator from '../utils/comparators/getComparator';
import playFieldsHeadCells from '../utils/cells/playFieldsHeadCells';
import isAdmin from '../utils/isAdmin';

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
                {playFieldsHeadCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        { headCell.id === "playFieldPhoto" ? (
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

export default function PlayFields() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const [loadedPlayfieldsData, setLoadedPlayfieldsData] = useState(null);
    const [filteredPlayFieldsData, setFilteredPlayFieldsData] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const { loading, error, data } = useQuery(GET_PLAYFIELDS);

    /* Filtering state */
    const [title, setTitle] = useState('');
    const [city, setCity] = useState('Not Selected');
    const [cost, setCost] = useState(0);
    const [courtType, setCourtType] = useState('Not Selected');
    const [courtFloorType, setCourtFloorType] = useState('Not Selected');

    useEffect(() => {
        if (loading) {
            setIsLoading(loading);
        }

        if (error) {
            setIsError(error);
            setIsLoading(false);
        }

        if (data) {
            setLoadedPlayfieldsData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    if (!loadedPlayfieldsData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let rows;
    if (loadedPlayfieldsData) {
        rows = loadedPlayfieldsData.listPlayFields;
    }

    let availableCities = _.uniq(rows.map(row => row.city));
    availableCities.push('Not Selected');

    let availableCourtTypes = _.uniq(rows.map(row => row.courtType));
    availableCourtTypes.push('Not Selected');

    let availableCourtFloorTypes = _.uniq(rows.map(row => row.courtFloorType));
    availableCourtFloorTypes.push('Not Selected');

    const handleRequestSort = (event, property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleEditDetails = (event, id) => {
        history.push(`/playfields/edit/${id}`);
    };

    function handleCitySelect(event) {
        setCity(event.target.value);
    };

    function handleCourtTypeSelect(event) {
        setCourtType(event.target.value);
    };

    function handleCourtFloorTypeSelect(event) {
        setCourtFloorType(event.target.value);
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

        let filteredData = loadedPlayfieldsData.listPlayFields;

        if (title) {
            filteredData = filteredData.filter(
                data => data.title.includes(title),
            );
        }

        if (city !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.city === city,
            );
        }

        if (cost !== 0) {
            filteredData = filteredData.filter(
                data => data.cost <= cost,
            );
        }

        if (courtType !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.courtType === courtType,
            );
        }

        if (courtFloorType !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.courtFloorType === courtFloorType,
            );
        }

        setFilteredPlayFieldsData(filteredData);
        setOpen(false);
    };

    function handleFilterClear(event) {
        event.preventDefault();

        setTitle('');
        setCity('Not Selected');
        setCost(0);
        setCourtType('Not Selected');
        setCourtFloorType('Not Selected');

        setFilteredPlayFieldsData(loadedPlayfieldsData.listPlayFields);
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
                                id="cost"
                                defaultValue={cost}
                                label="Reservation Cost"
                                name="cost"
                                autoComplete="cost"
                                onInput={e => setCost(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                placement="right"
                                title="Approximate reservation cost per hour in euros. Filtered values are less or equal to the entered value."
                            >
                                <InfoIcon />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <TextFieldsIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="courtType">Court Type</InputLabel>
                                <Select
                                    labelId="courtType"
                                    id="courtType"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handleCourtTypeSelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availableCourtTypes.map((courtTypeToSelect) => (
                                        <MenuItem key={courtTypeToSelect} value={courtTypeToSelect} style={
                                            getDropdownStyles(courtTypeToSelect, courtType, theme)
                                        }>
                                            {courtTypeToSelect}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <TextFieldsIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="courtFloorType">Court Floor Type</InputLabel>
                                <Select
                                    labelId="courtFloorType"
                                    id="courtFloorType"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handleCourtFloorTypeSelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availableCourtFloorTypes.map((courtFloorTypeToSelect) => (
                                        <MenuItem key={courtFloorTypeToSelect} value={courtFloorTypeToSelect} style={
                                            getDropdownStyles(courtFloorTypeToSelect, courtFloorType, theme)
                                        }>
                                            {courtFloorTypeToSelect}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container alignItems="center" justify="space-between">
                        <Button
                            onClick={handleFilterClear}
                            variant="outlined"
                            color="secondary"
                            className={classes.buttonBox}
                            disabled={!areFiltersSelected({
                                title, city, cost, courtType, courtFloorType,
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
                                title, city, cost, courtType, courtFloorType,
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
                    {
                        isAdmin() ? (
                            <Button
                                variant="outlined"
                                color="secondary"
                                component="span"
                                onClick={() => { history.push('/playfields/add') }}
                            >
                                New Play Field
                            </Button>
                        ) : ''
                    }
                    <Toolbar
                        className={clsx(classes.root, {
                            [classes.highlight]: false,
                        })}
                    >
                        <Typography className={classes.title}>
                            Filter Play Fields
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
                                {stableSort(filteredPlayFieldsData || rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleEditDetails(event, row.id)}
                                                tabIndex={-1}
                                                key={`${new Date()} ${row.title}`}
                                                selected={false}
                                            >
                                                <TableCell>{row.title}</TableCell>
                                                <TableCell>{row.city}</TableCell>
                                                <TableCell>{row.cost} €</TableCell>
                                                <TableCell>{row.courtType}</TableCell>
                                                <TableCell>{row.courtFloorType}</TableCell>
                                                <TableCell>
                                                    <Avatar
                                                        id="avatar-tennis"
                                                        sizes="100px"
                                                        alt="tennis-court"
                                                        src={row.playFieldPhoto}
                                                        variant="square"
                                                        className={classes.media}
                                                    >
                                                        <PhotoIcon />
                                                    </Avatar>
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