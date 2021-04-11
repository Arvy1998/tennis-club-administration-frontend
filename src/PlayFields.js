import React, { useState, useEffect } from 'react';

import { lighten, makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router';
import Button from '@material-ui/core/Button';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
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

import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

import Navigation from './Navigation';
import Modal from '@material-ui/core/Modal';

import clsx from 'clsx';

import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import LinearProgress from '@material-ui/core/LinearProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import PhotoIcon from '@material-ui/icons/Photo';
import FilterListIcon from '@material-ui/icons/FilterList';

import { Typography } from '@material-ui/core';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_PLAYFIELDS,
} from './gql/queries/queries';

function descendingComparator(curr, next, orderBy) {
    if (next[orderBy] < curr[orderBy]) {
        return -1;
    }
    if (next[orderBy] > curr[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (curr, next) => descendingComparator(curr, next, orderBy)
        : (curr, next) => -descendingComparator(curr, next, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((element, index) => [element, index]);
    stabilizedThis.sort((next, curr) => {
        const order = comparator(next[0], curr[0]);
        if (order !== 0) return order;
        return next[1] - curr[1];
    });
    return stabilizedThis.map((element) => element[0]);
}

function getModalStyle() {
    const bottom = 60;

    return {
        bottom: `${bottom}%`,
        margin: 'auto',
    };
}

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
}));

const headCells = [
    { id: 'title', disablePadding: true, label: 'Title' },
    { id: 'city', disablePadding: false, label: 'City' },
    { id: 'cost', disablePadding: false, label: 'Cost' },
    { id: 'courtType', disablePadding: false, label: 'Court Type' },
    { id: 'courtFloorType', disablePadding: false, label: 'Floor Type' },
    { id: 'rating', disablePadding: false, label: 'Rating' },
    { id: 'playFieldPhoto', dissablePadding: false, label: 'Photo' },
];

const customIcons = {
    '0.5': {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: 'Very Dissatisfied',
    },
    1: {
        icon: <SentimentVeryDissatisfiedIcon />,
        label: 'Very Dissatisfied',
    },
    '1.5': {
        icon: <SentimentDissatisfiedIcon />,
        label: 'Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon />,
        label: 'Dissatisfied',
    },
    '2.5': {
        icon: <SentimentSatisfiedIcon />,
        label: 'Neutral',
    },
    3: {
        icon: <SentimentSatisfiedIcon />,
        label: 'Neutral',
    },
    '3.5': {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Satisfied',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon />,
        label: 'Satisfied',
    },
    '4.5': {
        icon: <SentimentVerySatisfiedIcon />,
        label: 'Very Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
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

    const history = useHistory();

    const [loadedPlayfieldsData, setLoadedPlayfieldsData] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('title');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);

    const initialQuery = [];

    const { loading, error, data } = useQuery(GET_PLAYFIELDS, {
        variables: { playFieldQueryInput: initialQuery },
    });

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

    const handleRequestSort = (event, property) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleEditDetails = (event, id) => {
        history.push(`/playfields/edit/${id}`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterModal = (event) => {
        event.preventDefault();

        console.log('CLICK!!')
        setOpen(true);
    }

    const handleClose = (value) => {
        setOpen(false);
        // setSelectedValue(value);
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <Typography className={classes.title}>
                Select Filters:
            </Typography>
        </div>
    );

    return (
        <div className={classes.root}>
            <Navigation />
            <Container className={classes.listContainer}>
                <Grid container spacing={3} alignItems="center" justify="space-between">
                    <Button
                        variant="outlined"
                        color="secondary"
                        component="span"
                        onClick={() => { history.push('/playfields/add') }}
                    >
                        New Play Field
                        </Button>
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
                                {stableSort(rows, getComparator(order, orderBy))
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
                                                <TableCell>{row.cost}</TableCell>
                                                <TableCell>{row.courtType}</TableCell>
                                                <TableCell>{row.courtFloorType}</TableCell>
                                                <TableCell>
                                                    <Rating
                                                        precision={0.5}
                                                        size="large"
                                                        name="playfield-rating-bar"
                                                        IconContainerComponent={IconContainer}
                                                        disabled={true}
                                                        value={row.rating}
                                                    />
                                                </TableCell>
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
                <Grid className={classes.spacingBetweenFields}></Grid>
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