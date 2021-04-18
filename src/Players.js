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
import Rating from '@material-ui/lab/Rating';
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

import { Typography } from '@material-ui/core';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_PLAYERS,
    LIST_CLUBS,
} from './gql/queries/queries';

import areFiltersSelected from '../utils/areFiltersSelected';

import MenuProps from '../utils/props/MenuProps';
import getDropdownStyles from '../utils/props/getDropdownStyles';
import getModalStyle from '../utils/props/getModalStyle';

import stableSort from '../utils/comparators/stableSort';
import getComparator from '../utils/comparators/getComparator';
import playersHeadCells from '../utils/cells/playersHeadCells';
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
                {playersHeadCells.map((headCell) => (
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

export default function Players() {
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory();

    const [loadedPlayersData, setLoadedPlayersData] = useState(null);
    const [filteredPlayersData, setFilteredPlayersData] = useState(null);

    const [loadedClubsData, setLoadedClubsData] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(false);

    const { loading: playersLoading, error: playersError, data: playersData } = useQuery(GET_PLAYERS);
    const { loading: clubsLoading, error: clubsError, data: clubsData } = useQuery(LIST_CLUBS)

    /* Filtering state */
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sex, setSex] = useState('Not Selected');
    const [level, setLevel] = useState('Not Selected');
    const [city, setCity] = useState('Not Selected');
    const [mainHand, setMainHand] = useState('Not Selected');
    const [clubTitle, setClubTitle] = useState('');

    useEffect(() => {
        if (playersLoading) {
            setIsLoading(playersLoading);
        }

        if (playersError) {
            setIsError(playersError);
            setIsLoading(false);
        }

        if (playersData) {
            /* also remove yourself from seach results */
            let alteredPlayers = playersData;
            _.remove(alteredPlayers.getPlayers, {
                id: localStorage.getItem('id'),
            })

            setLoadedPlayersData(alteredPlayers);
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

    let rows;
    if (loadedPlayersData) {
        rows = loadedPlayersData.getPlayers;
    }

    const availableHands = [
        'Left',
        'Right',
        'Not Selected'
    ];

    const availableSex = [
        'Male',
        'Female',
        'Other',
        'Not Selected',
    ];

    const availableLevels = [
        'Level 1.5',
        'Level 2.0',
        'Level 2.5',
        'Level 3.0',
        'Level 3.5',
        'Level 4.0',
        'Level 4.5',
        'Level 5.0',
        'Level 5.5',
        'Level 6.0 - 7.0',
        'Level 7.0',
        'Not Selected',
    ];

    let availableCities = _.uniq(rows.map(row => row.city));
    availableCities.push('Not Selected');

    const handleRequestSort = (event, property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleOpenDetails = (event, id) => {
        history.push(`/players/${id}`);
    };

    // function handleCitySelect(event) {
    //     setCity(event.target.value);
    // };

    // function handleCourtTypeSelect(event) {
    //     setCourtType(event.target.value);
    // };

    // function handleCourtFloorTypeSelect(event) {
    //     setCourtFloorType(event.target.value);
    // };

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

        let filteredData = loadedPlayersData.getPlayers;

        // if (title) {
        //     filteredData = filteredData.filter(
        //         data => data.title.includes(title),
        //     );
        // }

        // if (city !== 'Not Selected') {
        //     filteredData = filteredData.filter(
        //         data => data.city === city,
        //     );
        // }

        // if (cost !== 0) {
        //     filteredData = filteredData.filter(
        //         data => data.cost <= cost,
        //     );
        // }

        // if (rating !== 0) {
        //     filteredData = filteredData.filter(
        //         data => data.rating >= rating,
        //     );
        // }

        // if (courtType !== 'Not Selected') {
        //     filteredData = filteredData.filter(
        //         data => data.courtType === courtType,
        //     );
        // }

        // if (courtFloorType !== 'Not Selected') {
        //     filteredData = filteredData.filter(
        //         data => data.courtFloorType === courtFloorType,
        //     );
        // }

        setFilteredPlayersData(filteredData);
        setOpen(false);
    };

    function handleFilterClear(event) {
        event.preventDefault();

        setFirstName('');
        setLastName('');
        setSex('Not Selected');
        setLevel('Not Selected');
        setCity('Not Selected');
        setMainHand('Not Selected');
        setClubTitle('');

        setFilteredPlayersData(loadedPlayersData.getPlayers);
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

                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container alignItems="center" justify="space-between">
                        <Button
                            onClick={handleFilterClear}
                            variant="outlined"
                            color="secondary"
                            className={classes.buttonBox}
                            disabled={!areFiltersSelected({
                                firstName, lastName, sex, level, city, mainHand, clubTitle,
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
                                firstName, lastName, sex, level, city, mainHand, clubTitle,
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
                            Filter Players
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
                                {stableSort(filteredPlayersData || rows, getComparator(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                onClick={(event) => handleOpenDetails(event, row.id)}
                                                tabIndex={-1}
                                                key={`${new Date()} ${row.id}`}
                                                selected={false}
                                            >
                                                <TableCell>{row.firstName}</TableCell>
                                                <TableCell>{row.lastName}</TableCell>
                                                <TableCell>{row.sex}</TableCell>
                                                <TableCell>{row.level}</TableCell>
                                                <TableCell>{row.city}</TableCell>
                                                <TableCell>{row.mainHand}</TableCell>
                                                <TableCell>{row.clubTitle}</TableCell>
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