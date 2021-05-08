import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import InfoIcon from '@material-ui/icons/Info';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Navigation from './Navigation';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';

import { useMutation } from "@apollo/react-hooks";
import {
    UPDATE_CLUB,
} from './gql/mutations/mutations';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_PLAYERS,
    GET_CLUB,
    LIST_CLUBS,
} from './gql/queries/queries';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    snack: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
}));

export default function ClubsAddForm({ clubId }) {
    const classes = useStyles();
    const history = useHistory();

    const [updated, setUpdated] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);
    const [open, setOpen] = React.useState(false);

    const [loadedClubsData, setLoadedClubsData] = useState(null);
    const [loadedUsersData, setLoadedUsersData] = useState(null);
    const [loadedListData, setLoadedListData] = useState(null);

    const { loading: listLoading, error: listError, data: listData } = useQuery(LIST_CLUBS);

    const [editClub, { data: updateClub }] = useMutation(UPDATE_CLUB);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [clubLogo, setClubLogo] = useState('');
    const [formState, setFormState] = useState({
        userIds: []
    });

    const [fileName, setFileName] = useState('');

    const { loading: clubsLoading, error: clubsError, data: clubsData } = useQuery(
        GET_CLUB, { variables: { id: clubId } }
    );
    const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_PLAYERS);

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
        if (listLoading) {
            setIsLoading(listLoading);
        }

        if (listError) {
            setIsError(listError);
            setIsLoading(false);
        }

        if (listData) {
            setLoadedListData(listData);
            setIsLoading(false);
        }
    }, [listLoading, listError, listData]);

    useEffect(() => {
        if (usersLoading) {
            setIsLoading(usersLoading);
        }

        if (usersError) {
            setIsError(usersError);
            setIsLoading(false);
        }

        if (usersData && listData && clubsData) {
            let users = _.sortBy(usersData.getPlayers, ['firstName', 'lastName']);

            /* firstly exclude selected to edit club */
            let clubs = listData.listClubs;
            _.remove(clubs, {
                id: clubsData.getClub.id,
            });

            /* we dont want to see users, which are part of the other club,
               so we filter them */
            let userIds = _.flattenDeep(clubs.map(club => {
                return club.users.map(user => {
                    return user.id;
                });
            }));

            /* copying reference will end up with bug where users array
               dinamically changes during its iteration */
            let filteredUsers = _.clone(users);

            users.map(user => {
                if (userIds.includes(user.id)) {
                    _.remove(filteredUsers, {
                        id: user.id,
                    });
                }
            });

            setLoadedUsersData(filteredUsers);
            setIsLoading(false);
        }
    }, [usersLoading, usersError, usersData, listData, clubsData]);

    if (!loadedUsersData || isLoading) {
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

    if (!loadedListData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let club;
    if (loadedClubsData) {
        club = loadedClubsData.getClub;
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    function handleInformationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);
        setUpdated(true);

        editClub({
            variables: {
                id: clubId,
                clubInput: filterNotEnteredEntries({
                    title,
                    description,
                    clubLogo,
                    userIds: formState.userIds.length > 0 ? formState.userIds : club.users.map(user => user.id),
                }),
            },
        });

        setUpdated(false);
        setIsLoading(false);

        setOpen(true);
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

    function handleUserIdsChange(event) {
        event.persist();
        setFormState(formState => ({
            ...formState,
            [event.target.name]:
                event.target.type === "checkbox"
                    ? event.target.checked
                    : event.target.value
        }));
    }

    if (!updateClub && updated) {
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
                            Edit Club Details
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
                                        src={club.clubLogo || clubLogo}
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
                                        defaultValue={club.title}
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
                                        defaultValue={club.description}
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
                            <Grid className={classes.spacingBetweenFields}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <GroupAddIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        select
                                        name="userIds"
                                        id="userIds"
                                        style={{ width: 300 }}
                                        label="Club Members"
                                        SelectProps={{
                                            multiple: true,
                                            value: formState.userIds.length > 0 ? formState.userIds : club.users.map(user => user.id),
                                            onChange: handleUserIdsChange
                                        }}
                                    >
                                        {loadedUsersData.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                {`${user.firstName} ${user.lastName}`}
                                            </MenuItem>
                                        ))}
                                    </TextField>
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
                                UPDATE
                            </Button>
                        </Grid>
                    </form>
                </Grid>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        Information updated successfuly!
                    </Alert>
                </Snackbar>
            </Container>
        </div >
    );
}