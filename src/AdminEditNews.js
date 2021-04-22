import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MarkunreadMailboxOutlinedIcon from '@material-ui/icons/MarkunreadMailboxOutlined';
import TextFieldsIcon from '@material-ui/icons/TextFields';

import InfoIcon from '@material-ui/icons/Info';
import PersonIcon from '@material-ui/icons/Person';
import EventIcon from '@material-ui/icons/Event';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';

import Navigation from './Navigation';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';

import MenuProps from '../utils/props/MenuProps';
import getDropdownStyles from '../utils/props/getDropdownStyles';

import { useMutation } from "@apollo/react-hooks";
import {
    UPDATE_NEWS,
    DELETE_NEWS,
} from './gql/mutations/mutations';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_PLAYFIELDS_SELECTION,
    LIST_CLUBS,
    GET_NEWS,
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
        padding: theme.spacing(1.5),
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

export default function AdminEditNews({ match }) {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

    const [updated, setUpdated] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [editNews, { data: updateNews }] = useMutation(UPDATE_NEWS);
    const [removeNews, { data: deleteNews }] = useMutation(DELETE_NEWS);

    const [loadedClubsData, setLoadedClubsData] = useState(null);
    const [loadedPlayFieldsData, setLoadedPlayFieldsData] = useState(null);
    const [loadedNewsData, setLoadedNewsData] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [firstClubPlayingId, setFirstClubPlayingId] = useState('Not Selected');
    const [secondClubPlayingId, setSecondClubPlayingId] = useState('Not Selected');
    const [date, setDate] = useState('');
    const [playFieldId, setPlayFieldId] = useState('Not Selected');

    const { loading, error, data } = useQuery(LIST_CLUBS);
    const { loading: playFieldsLoading, error: playFieldsError, data: playFieldsData } = useQuery(GET_PLAYFIELDS_SELECTION);
    const { loading: newsLoading, error: newsError, data: newsData } = useQuery(
        GET_NEWS, { variables: { id: match.params.id } },
    );

    useEffect(() => {
        if (loading) {
            setIsLoading(loading);
        }

        if (error) {
            setIsError(error);
            setIsLoading(false);
        }

        if (data) {
            setLoadedClubsData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    useEffect(() => {
        if (playFieldsLoading) {
            setIsLoading(playFieldsLoading);
        }

        if (playFieldsError) {
            setIsError(playFieldsError);
            setIsLoading(false);
        }

        if (playFieldsData) {
            setLoadedPlayFieldsData(playFieldsData);
            setIsLoading(false);
        }
    }, [playFieldsLoading, playFieldsError, playFieldsData]);


    useEffect(() => {
        if (newsLoading) {
            setIsLoading(newsLoading);
        }

        if (newsError) {
            setIsError(newsError);
            setIsLoading(false);
        }

        if (newsData) {
            setLoadedNewsData(newsData);
            setIsLoading(false);
        }
    }, [newsLoading, newsError, newsData]);

    if (!loadedClubsData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    if (!loadedPlayFieldsData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    if (!loadedNewsData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    function handleNewsSubmit(event) {
        event.preventDefault();

        setUpdated(true);
        setIsLoading(true);

        editNews({
            variables: {
                id: match.params.id,
                newsInput: filterNotEnteredEntries({
                    title,
                    description,
                    firstClubPlayingId,
                    secondClubPlayingId,
                    date,
                    playFieldId,
                }),
            },
        });

        setUpdated(false);
        setIsLoading(false);

        history.push('/admin/news');
        window.location.reload(true);
    }

    function handleDeleteAction(event) {
        event.preventDefault();

        removeNews({
            variables: {
                id: match.params.id,
            },
        });

        history.push('/admin/news');
        window.location.reload(true);
    }

    let clubs = [...loadedClubsData.listClubs, { id: 'Not Selected' }];
    let playFields = [...loadedPlayFieldsData.listPlayFields, { id: 'Not Selected' }];
    let news = loadedNewsData.getNews;

    function handleFirstClubPlayingSelect(event) {
        setFirstClubPlayingId(event.target.value);
    }

    function handleSecondClubPlayingSelect(event) {
        setSecondClubPlayingId(event.target.value);
    }

    function handlePlayFieldSelect(event) {
        setPlayFieldId(event.target.value);
    }

    if (!updateNews && isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
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
                            Update News
                        </Typography>
                    </Grid>
                    <form className={classes.form} onSubmit={handleNewsSubmit}>
                        <Grid className={classes.spacingBetween}></Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid className={classes.formHeaderH3Spacing}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <PersonIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="firstClub">First Club Playing</InputLabel>
                                        <Select
                                            labelId="firstClub"
                                            id="firstClub-id"
                                            defaultValue={news.firstClubPlaying.id || 'Not Selected'}
                                            style={{ width: 300 }}
                                            onChange={handleFirstClubPlayingSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                        >
                                            {clubs.map((club) => (
                                                <MenuItem key={club.id} value={club.id} style={
                                                    getDropdownStyles(club.id, firstClubPlayingId, theme)
                                                }>
                                                    {club.title || 'Not Selected'}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className={classes.spacingBetween}></Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid className={classes.formHeaderH3Spacing}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <PersonIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="secondClub">Second Club Playing</InputLabel>
                                        <Select
                                            labelId="secondClub"
                                            id="secondClub-id"
                                            defaultValue={news.secondClubPlaying.id || 'Not Selected'}
                                            style={{ width: 300 }}
                                            onChange={handleSecondClubPlayingSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                        >
                                            {clubs.map((club) => (
                                                <MenuItem key={club.id} value={club.id} style={
                                                    getDropdownStyles(club.id, secondClubPlayingId, theme)
                                                }>
                                                    {club.title || 'Not Selected'}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
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
                                Details
                            </Typography>
                        </Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid item>
                                <TextFieldsIcon />
                            </Grid>
                            <Grid item>
                                <TextField
                                    autoComplete="title"
                                    name="title"
                                    multiline
                                    required
                                    defaultValue={news.title}
                                    style={{ width: 300 }}
                                    id="title"
                                    label="Title"
                                    onInput={e => setTitle(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid item>
                                <InfoIcon />
                            </Grid>
                            <Grid item>
                                <TextField
                                    autoComplete="description"
                                    name="description"
                                    multiline
                                    required
                                    defaultValue={news.description}
                                    style={{ width: 300 }}
                                    id="description"
                                    label="Description"
                                    onInput={e => setDescription(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid className={classes.formHeaderH3Spacing}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <MarkunreadMailboxOutlinedIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="playField">Play Field</InputLabel>
                                        <Select
                                            labelId="playField"
                                            id="playField-id"
                                            defaultValue={news.playField.id || 'Not Selected'}
                                            style={{ width: 300 }}
                                            onChange={handlePlayFieldSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                        >
                                            {playFields.map((playField) => (
                                                <MenuItem key={playField.id} value={playField.id} style={
                                                    getDropdownStyles(playField.id, playFieldId, theme)
                                                }>
                                                    {playField.title || 'Not Selected'}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className={classes.spacingBetween}></Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid item>
                                <EventIcon />
                            </Grid>
                            <Grid item>
                                <TextField
                                    id="date"
                                    label="Event Date"
                                    type="datetime-local"
                                    defaultValue={news.date}
                                    style={{ width: 300 }}
                                    onInput={e => setDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} justify="center">
                            <Grid item>
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.buttonBox}
                                >
                                    Update
                            </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.buttonBox}
                                    onClick={handleDeleteAction}
                                >
                                    Delete
                            </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Container>
        </div >
    );
}