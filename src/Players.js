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
import FilterListIcon from '@material-ui/icons/FilterList';

import TextFieldsIcon from '@material-ui/icons/TextFields';
import HomeIcon from '@material-ui/icons/Home';
import WcIcon from '@material-ui/icons/Wc';
import EjectIcon from '@material-ui/icons/Eject';
import PanToolIcon from '@material-ui/icons/PanTool';
import StarIcon from '@material-ui/icons/Star';
import InfoIcon from '@material-ui/icons/Info';
import Chip from '@material-ui/core/Chip';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import SportsTennisTwoToneIcon from '@material-ui/icons/SportsTennisTwoTone';

import { Typography } from '@material-ui/core';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_PLAYERS,
    LIST_BADGES,
    LIST_CLUBS,
} from './gql/queries/queries';

import areFiltersSelected from '../utils/areFiltersSelected';

import MenuProps from '../utils/props/MenuProps';
import getDropdownStyles from '../utils/props/getDropdownStyles';
import getModalStyle from '../utils/props/getModalStyle';

import stableSort from '../utils/comparators/stableSort';
import getComparator from '../utils/comparators/getComparator';
import playersHeadCells from '../utils/cells/playersHeadCells';

import transformUsersData from '../utils/transformations/transformUsersData';

import badgesIconMap from '../utils/badges/badgesIconMap';

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
        minWidth: 900,
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
    const [loadedBadgesData, setLoadedBadgesData] = useState(null);
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
    const { loading: clubsLoading, error: clubsError, data: clubsData } = useQuery(LIST_CLUBS);
    const { loading: badgesLoading, error: badgesError, data: badgesData } = useQuery(LIST_BADGES);

    /* Filtering state */
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [sex, setSex] = useState('Not Selected');
    const [level, setLevel] = useState('Not Selected');
    const [city, setCity] = useState('Not Selected');
    const [mainHand, setMainHand] = useState('Not Selected');
    const [clubTitle, setClubTitle] = useState('Not Selected');
    const [rating, setRating] = useState(0);
    const [badges, setBadges] = useState({
        badgeIds: [],
    });

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

    if (!loadedBadgesData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let rows;
    if (loadedPlayersData) {
        rows = transformUsersData(loadedPlayersData.getPlayers, loadedClubsData.listClubs);
    }

    let systemBadges;
    if (loadedBadgesData) {
        systemBadges = loadedBadgesData.listBadges;
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

    let availableCities = _.compact(_.uniq(rows.map(row => row.city)));
    availableCities.push('Not Selected');

    let availableClubs = _.compact(_.uniq(loadedClubsData.listClubs.map(club => club.title)));
    availableClubs.push('Not Selected');

    const handleRequestSort = (event, property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleOpenDetails = (event, id) => {
        history.push(`/players/${id}`);
    };

    function handleLevelSelect(event) {
        setLevel(event.target.value);
    }

    function handleGenderSelect(event) {
        setSex(event.target.value);
    }

    function handleCitySelect(event) {
        setCity(event.target.value);
    };

    function handleMainHandSelect(event) {
        setMainHand(event.target.value);
    };

    function handleClubSelect(event) {
        setClubTitle(event.target.value);
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

        let filteredData = transformUsersData(loadedPlayersData.getPlayers, loadedClubsData.listClubs);

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

        if (level !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.level === level,
            );
        }

        if (sex !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.sex === sex,
            );
        }

        if (city !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.city === city,
            );
        }

        if (mainHand !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.mainHand === mainHand,
            );
        }

        if (clubTitle !== 'Not Selected') {
            filteredData = filteredData.filter(
                data => data.clubTitle === clubTitle,
            );
        }

        if (rating !== 0) {
            filteredData = filteredData.filter(
                data => data.rating <= parseInt(rating),
            );
        }

        if (badges.badgeIds.length > 0) {
            filteredData = filteredData.filter(
                data => _.intersection(badges.badgeIds, data.badgeIds).length > 0,
            );
        }

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
        setClubTitle('Not Selected');
        setRating(0);
        setBadges({ badgeIds: [] });

        setFilteredPlayersData(transformUsersData(loadedPlayersData.getPlayers, loadedClubsData.listClubs));
    }

    function handleBadgeIdsChange(event) {
        event.persist();
        setBadges(badges => ({
            ...badges,
            'badgeIds':
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value
        }));
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
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <EjectIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="level">Level</InputLabel>
                                <Select
                                    labelId="level"
                                    id="level"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handleLevelSelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availableLevels.map((levelToSelect) => (
                                        <MenuItem key={levelToSelect} value={levelToSelect} style={
                                            getDropdownStyles(levelToSelect, level, theme)
                                        }>
                                            {levelToSelect}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <WcIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="sex">Gender</InputLabel>
                                <Select
                                    labelId="sex"
                                    id="sex"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handleGenderSelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availableSex.map((gender) => (
                                        <MenuItem key={gender} value={gender} style={
                                            getDropdownStyles(gender, sex, theme)
                                        }>
                                            {gender}
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
                            <PanToolIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="mainHand">Main Hand</InputLabel>
                                <Select
                                    labelId="mainHand"
                                    id="mainHand"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handleMainHandSelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availableHands.map((hand) => (
                                        <MenuItem key={hand} value={hand} style={
                                            getDropdownStyles(hand, mainHand, theme)
                                        }>
                                            {hand}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <SportsTennisTwoToneIcon />
                        </Grid>
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <InputLabel id="club">Club</InputLabel>
                                <Select
                                    labelId="club"
                                    id="club"
                                    defaultValue='Not Selected'
                                    style={{ width: 200 }}
                                    onChange={handleClubSelect}
                                    input={<Input />}
                                    MenuProps={MenuProps}
                                >
                                    {availableClubs.map((club) => (
                                        <MenuItem key={club} value={club} style={
                                            getDropdownStyles(club, clubTitle, theme)
                                        }>
                                            {club}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <StarIcon />
                        </Grid>
                        <Grid item>
                            <TextField
                                style={{ width: 175 }}
                                id="rating"
                                defaultValue={rating}
                                label="Rating"
                                name="rating"
                                autoComplete="rating"
                                onInput={e => setRating(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                placement="right"
                                title="The higher ranking, the more games has been won by certain user. Filtered ranking values are equal or lower."
                            >
                                <InfoIcon />
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid className={classes.spacingBetweenFields}></Grid>
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                        <Grid item>
                            <LoyaltyIcon />
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <InputLabel id="mutiple-chip-label">Badges</InputLabel>
                                <Select
                                    labelId="mutiple-chip-label"
                                    id="badgeIds"
                                    style={{ width: 300 }}
                                    multiple
                                    value={badges.badgeIds}
                                    onChange={handleBadgeIdsChange}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={() => (
                                        systemBadges.map((badge) => (
                                            badges.badgeIds.includes(badge.id) ? (
                                                <Chip
                                                    icon={badgesIconMap[badge.id]}
                                                    label={badge.title}
                                                    color="secondary"
                                                />
                                            ) : ''
                                        ))
                                    )}
                                >
                                    {systemBadges.map((badge) => (
                                        <MenuItem key={badge.id} value={badge.id}>
                                            <Chip
                                                icon={badgesIconMap[badge.id]}
                                                label={badge.title}
                                                color="secondary"
                                            />
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
                                                <TableCell>{row.rating}</TableCell>
                                                <TableCell>{systemBadges.map(badge => {
                                                    return (
                                                        row.badgeIds.includes(badge.id) ? (
                                                            <Grid container spacing={1}>
                                                                <Chip
                                                                    icon={badgesIconMap[badge.id]}
                                                                    label={badge.title}
                                                                    color="secondary"
                                                                />
                                                            </Grid>
                                                        ) : ''
                                                    )
                                                })}</TableCell>
                                                <TableCell>
                                                    {row.clubTitle !== '' ? (
                                                        <Tooltip placement="top" title={row.clubTitle}>
                                                            <Avatar
                                                                id="avatar"
                                                                sizes="100px"
                                                                alt={`${row.id}`}
                                                                src={row.clubLogo}
                                                                className={classes.large}
                                                            />
                                                        </Tooltip>
                                                    ) : ''}

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