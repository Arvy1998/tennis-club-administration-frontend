import React, { useState } from 'react';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import HomeIcon from '@material-ui/icons/Home';
import InfoIcon from '@material-ui/icons/Info';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';

import Navigation from './Navigation';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';

import { useMutation } from "@apollo/react-hooks";
import {
    CREATE_CLUB,
} from './gql/mutations/mutations';

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
    spacingBetweenDifferentFields: {
        padding: theme.spacing(0.2),
    },
    spacingBetweenRatingStars: {
        padding: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    ratingGrid: {
        paddingRight: theme.spacing(18),
    },
    input: {
        display: 'none',
    },
    media: {
        width: theme.spacing(16 * 3),
        height: theme.spacing(9 * 3),
    },
}));

export default function ClubsAddForm() {
    const classes = useStyles();
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(null);

    const [addClub, { data: createClub }] = useMutation(CREATE_CLUB);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [clubLogo, setClubLogo] = useState('');

    const [fileName, setFileName] = useState('');

    function handleInformationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        addClub({
            variables: {
                clubInput: filterNotEnteredEntries({
                    title,
                    description,
                    clubLogo,
                    userIds: [localStorage.getItem('id')]
                }),
            },
        });

        setIsLoading(false);

        history.push('/home');
        window.location.reload(true);
    }

    function fileToBase64(fileUploadEvent) {
        fileUploadEvent.preventDefault();

        const selectedFile = fileUploadEvent.target.files[0];
        setFileName(selectedFile.name);

        const blob = new Blob([selectedFile], { type: selectedFile.type });

        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            let base64String = reader.result;
            setClubLogo(base64String);
        };
    }

    if (!createClub && isLoading) {
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
                            Create Your Club
                        </Typography>
                    </Grid>
                    <form className={classes.form} onSubmit={handleInformationSubmit}>
                        <Grid container>
                            <Grid className={classes.spacingBetweenFields}></Grid>
                            <Grid container spacing={1} alignItems="center" justify="center">
                                <Grid item>
                                    <Avatar
                                        id="avatar"
                                        sizes="100px"
                                        src={clubLogo}
                                        className={classes.large}
                                    />
                                </Grid>
                                <Grid item>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        onChange={fileToBase64}
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                    />
                                    <label htmlFor="contained-button-file">
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            component="span"
                                        >
                                            Select Logotipe
                                            </Button>
                                    </label>
                                </Grid>
                                <Grid item>
                                    <div>{fileName || ''}</div>
                                </Grid>
                            </Grid>
                            <Grid className={classes.spacingBetweenFields}></Grid>
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
                                        style={{ width: 300 }}
                                        id="title"
                                        label="Title"
                                        onInput={e => setTitle(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid className={classes.spacingBetweenFields}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <InfoIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        multiline
                                        id="description"
                                        label="Description"
                                        name="description"
                                        autoComplete="description"
                                        onInput={e => setDescription(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className={classes.spacingBetweenFields}></Grid>
                        <Grid container justify="center">
                            <Button
                                type="submit"
                                variant="outlined"
                                color="secondary"
                                className={classes.buttonBox}
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