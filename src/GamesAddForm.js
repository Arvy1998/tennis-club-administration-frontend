import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory, useParams } from 'react-router-dom'
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';

import AlternateEmail from '@material-ui/icons/AlternateEmail';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import StreetviewIcon from '@material-ui/icons/Streetview';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import BorderHorizontalIcon from '@material-ui/icons/BorderHorizontal';
import InfoIcon from '@material-ui/icons/Info';
import StarIcon from '@material-ui/icons/Star';
import LanguageIcon from '@material-ui/icons/Language';
import PersonIcon from '@material-ui/icons/Person';

import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Rating from '@material-ui/lab/Rating';

import validateGameFields from '../utils/validateGameFields'

import Navigation from './Navigation';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';
import isEmpty from '../utils/isEmpty';

import MenuProps from '../utils/props/MenuProps';
import getDropdownStyles from '../utils/props/getDropdownStyles';

import { useMutation } from "@apollo/react-hooks";
import {
    CREATE_GAME,
} from './gql/mutations/mutations';

import { useQuery } from "@apollo/react-hooks";
import {
    ALL_USERS,
} from './gql/queries/queries';

const useStyles = makeStyles((theme) => ({
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
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
        padding: theme.spacing(2),
    },
    spacingBetweenFields: {
        padding: theme.spacing(0.5),
    },
    loadingBarContainer: {
        paddingBottom: theme.spacing(6),
    },
    centeredForms: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        display: 'none',
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    input: {
        display: 'none',
    },
    media: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    formHeaderH3: {
        color: 'grey',
        fontSize: 'medium',
        marginTop: theme.spacing(1),
    },
    formHeaderH3Spacing: {
        padding: theme.spacing(1),
    },
}));

export default function GamesAddForm() {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [hover, setHover] = useState(-1);

    const [addGame, { data: createGame }] = useMutation(CREATE_GAME);

    const [loadedUsersData, setLoadedUsersData] = useState(null);

    const [firstTeamFirstPlayerId, setFirstTeamFirstPlayerId] = useState('Not Selected');
    const [firstTeamSecondPlayerId, setFirstTeamSecondPlayerId] = useState('Not Selected');
    const [secondTeamFirstPlayerId, setSecondTeamFirstPlayerId] = useState('Not Selected');
    const [secondTeamSecondPlayerId, setSecondTeamSecondPlayerId] = useState('Not Selected');

    const [firstScore, setFirstScore] = useState('');
    const [secondScore, setSecondScore] = useState('');
    const [thirdScore, setThirdScore] = useState('');
    const [fourthScore, setFourthScore] = useState('');
    const [fifthScore, setFifthScore] = useState('');
    const [sixthScore, setSixthScore] = useState('');

    const { loading, error, data } = useQuery(ALL_USERS);

    useEffect(() => {
        if (loading) {
            setIsLoading(loading);
        }

        if (error) {
            setIsError(error);
            setIsLoading(false);
        }

        if (data) {
            setLoadedUsersData([...data.allUsers, { id: 'Not Selected' }]);
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

    function handleInformationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        addGame({
            variables: {
                gameInput: filterNotEnteredEntries({
                    firstTeamFirstPlayerId,
                    firstTeamSecondPlayerId,
                    secondTeamFirstPlayerId,
                    secondTeamSecondPlayerId,
                    matches: [
                        { firstTeamScore: firstScore, secondTeamScore: secondScore },
                        { firstTeamScore: thirdScore, secondTeamScore: fourthScore },
                        { firstTeamScore: fifthScore, secondTeamScore: sixthScore },
                    ]
                }),
            },
        });

        setIsLoading(false);

        history.push('/games');
        window.location.reload(true);
    }

    let users = loadedUsersData;

    function handleFirstTeamFirstPlayerSelect(event) {
        setFirstTeamFirstPlayerId(event.target.value);
    }
    function handleFirstTeamSecondPlayerSelect(event) {
        setFirstTeamSecondPlayerId(event.target.value);
    }
    function handleSecondTeamFirstPlayerSelect(event) {
        setSecondTeamFirstPlayerId(event.target.value);
    }
    function handleSecondTeamSecondPlayerSelect(event) {
        setSecondTeamSecondPlayerId(event.target.value);
    }

    if (!createGame && isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    console.log({
        firstTeamFirstPlayerId,
        firstTeamSecondPlayerId,
    });

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
                            Add New Game
                        </Typography>
                    </Grid>
                    <form className={classes.form} onSubmit={handleInformationSubmit}>
                        <Grid className={classes.spacingBetween}></Grid>
                        <Grid container spacing={1} justify="center">
                            <Typography
                                component="h1"
                                variant="h5"
                                className={classes.formHeaderH3}
                            >
                                First Team
                        </Typography>
                        </Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid className={classes.formHeaderH3Spacing}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <PersonIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="firstTeamFirstPlayer">First Team Player 1</InputLabel>
                                        <Select
                                            labelId="firstTeamFirstPlayer"
                                            id="firstTeamFirstPlayer-id"
                                            defaultValue={'Not Selected'}
                                            style={{ width: 300 }}
                                            onChange={handleFirstTeamFirstPlayerSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                            // error={isEmpty(firstTeamFirstPlayerId)}
                                            // helperText={isEmpty(secondTeamFirstPlayerId) ? 'Cannot be empty' : null}
                                        >
                                            {users.map((user) => (
                                                <MenuItem key={user.id} value={user.id} style={
                                                    getDropdownStyles(user.id, firstTeamFirstPlayerId, theme)
                                                }>
                                                    {`${user.firstName || 'Not Selected'} ${user.lastName || ''}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <PersonIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="firstTeamSecondPlayer">First Team Player 2</InputLabel>
                                        <Select
                                            labelId="firstTeamSecondPlayer"
                                            id="firstTeamSecondPlayer-id"
                                            defaultValue={'Not Selected'}
                                            style={{ width: 265 }}
                                            onChange={handleFirstTeamSecondPlayerSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                        >
                                            {users.map((user) => (
                                                <MenuItem key={user.id} value={user.id} style={
                                                    getDropdownStyles(user.id, firstTeamSecondPlayerId, theme)
                                                }>
                                                    {`${user.firstName || 'Not Selected'} ${user.lastName || ''}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="right"
                                        title="If only two players are playing, it is not required to enter second played of the team."
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className={classes.spacingBetween}></Grid>
                        <Grid container spacing={1} justify="center">
                            <Typography
                                component="h1"
                                variant="h5"
                                className={classes.formHeaderH3}
                            >
                                Second Team
                            </Typography>
                        </Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid className={classes.formHeaderH3Spacing}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <PersonIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="secondTeamFirstPlayer">Second Team Player 1</InputLabel>
                                        <Select
                                            labelId="secondTeamFirstPlayer"
                                            id="secondTeamFirstPlayer-id"
                                            defaultValue={'Not Selected'}
                                            style={{ width: 300 }}
                                            onChange={handleSecondTeamFirstPlayerSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                            // error={isEmpty(secondTeamFirstPlayerId)}
                                            // helperText={isEmpty(secondTeamFirstPlayerId) ? 'Cannot be empty' : null}
                                        >
                                            {users.map((user) => (
                                                <MenuItem key={user.id} value={user.id} style={
                                                    getDropdownStyles(user.id, secondTeamFirstPlayerId, theme)
                                                }>
                                                    {`${user.firstName || 'Not Selected'} ${user.lastName || ''}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <PersonIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="secondTeamSecondPlayer">Second Team Player 2</InputLabel>
                                        <Select
                                            labelId="secondTeamSecondPlayer"
                                            id="secondTeamSecondPlayer-id"
                                            defaultValue={'Not Selected'}
                                            style={{ width: 265 }}
                                            onChange={handleSecondTeamSecondPlayerSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                        >
                                            {users.map((user) => (
                                                <MenuItem key={user.id} value={user.id} style={
                                                    getDropdownStyles(user.id, secondTeamSecondPlayerId, theme)
                                                }>
                                                    {`${user.firstName || 'Not Selected'} ${user.lastName || ''}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="right"
                                        title="If only two players are playing, it is not required to enter second played of the team."
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Button
                                type="submit"
                                variant="outlined"
                                color="secondary"
                                className={classes.buttonBox}
                                disabled={!validateGameFields({

                                })}
                            >
                                Create
                                </Button>
                        </Grid>
                    </form>
                </Grid>
            </Container>
        </div >
    );
}