import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
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
import VpnKey from '@material-ui/icons/VpnKey';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import WcIcon from '@material-ui/icons/Wc';
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import StreetviewIcon from '@material-ui/icons/Streetview';
import EjectIcon from '@material-ui/icons/Eject';
import InfoIcon from '@material-ui/icons/Info';
import PanToolIcon from '@material-ui/icons/PanTool';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';

import Navigation from './Navigation';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';

import { useMutation } from "@apollo/react-hooks";
import {
    UPDATE_USER,
} from './gql/mutations/mutations';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_USER,
} from './gql/queries/queries';

import levelSelection from '../utils/levelSelection';
import levelSelectionMap from '../utils/levelSelectionMap';

import getDropdownStyles from '../utils/props/getDropdownStyles';

import MenuProps from '../utils/props/MenuProps';

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
    input: {
        display: 'none',
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

const genderSelection = [
    'Male',
    'Female',
    'Other',
    'Not Selected',
];

const handSelection = [
    'Left',
    'Right',
    'Not Selected',
];

const genderMap = {
    'MALE': 'Male',
    'FEMALE': 'Female',
    'OTHER': 'Other',
}

export default function Account() {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

    const [updated, setUpdated] = useState(null);

    const [loadedUserData, setLoadedUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [editUser, { data: updateUserData }] = useMutation(UPDATE_USER);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [mainHand, setMainHand] = useState('');
    const [details, setDetails] = useState('');

    const [selectedLevel, setSelectedLevel] = useState('');
    const [userProfilePhoto, setUserProfilePhoto] = useState('');
    const [fileName, setFileName] = useState('');

    const [selectedGender, setSelectedGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { email: localStorage.getItem('email') },
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
            setLoadedUserData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    if (!loadedUserData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let user;
    if (loadedUserData) {
        user = loadedUserData.getUser;
    }

    function handleGenderSelect(event) {
        setSelectedGender(event.target.value.toUpperCase());
    };

    function handleLevelSelect(event) {
        setSelectedLevel(levelSelectionMap[event.target.value] || null);
    };

    function handleHandSelect(event) {
        setMainHand(event.target.value);
    }

    function handleInformationSubmit(event) {
        event.preventDefault();

        setUpdated(true);
        setIsLoading(true);

        editUser({
            variables: {
                email: localStorage.getItem('email'),
                userInput: filterNotEnteredEntries({
                    firstName,
                    lastName,
                    sex: selectedGender !== 'NOT SELECTED' ? selectedGender : null,
                    level: selectedLevel !== 'NOT SELECTED' ? selectedLevel : null,
                    city,
                    address,
                    phoneNumber,
                    email: localStorage.getItem('email'),
                    password,
                    newPassword,
                    newEmail,
                    details,
                    mainHand,
                    userProfilePhoto,
                }),
            },
        });

        setUpdated(false);
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
            setUserProfilePhoto(base64String);
        };
    }

    if (!updateUserData && updated) {
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
                            Contact Information
                                </Typography>
                    </Grid>
                    <form className={classes.form} onSubmit={handleInformationSubmit}>
                        <Grid className={classes.spacingBetweenFields}></Grid>
                        <Grid container>
                            <Grid container spacing={1} alignItems="center" justify="center">
                                <Grid item>
                                    <Avatar
                                        id="avatar"
                                        sizes="100px"
                                        alt={`${firstName} ${lastName}`}
                                        src={userProfilePhoto || loadedUserData.getUser.userProfilePhoto}
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
                                            Select Photo
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
                                        autoComplete="fname"
                                        name="firstName"
                                        defaultValue={user.firstName}
                                        required
                                        style={{ width: 300 }}
                                        id="firstName"
                                        label="First Name"
                                        onInput={e => setFirstName(e.target.value)}
                                    />
                                </Grid>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <Grid item>
                                        <TextFieldsIcon />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            required
                                            style={{ width: 300 }}
                                            defaultValue={user.lastName}
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            autoComplete="lname"
                                            onInput={e => setLastName(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid className={classes.spacingBetweenFields}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <WcIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="genderSelect">Gender</InputLabel>
                                        <Select
                                            labelId="genderSelect"
                                            id="genderSelect-id"
                                            defaultValue={genderMap[user.sex] || 'Not Selected'}
                                            style={{ width: 300 }}
                                            onChange={handleGenderSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                        >
                                            {genderSelection.map((gender) => (
                                                <MenuItem key={gender} value={gender} style={
                                                    getDropdownStyles(gender, selectedGender, theme)
                                                }>
                                                    {gender}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid className={classes.spacingBetweenDifferentFields}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <PhoneIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        id="phoneNumber"
                                        label="Phone Number"
                                        name="phoneNumber"
                                        defaultValue={user.phoneNumber}
                                        onInput={e => setPhoneNumber(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <HomeIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        id="city"
                                        label="City"
                                        name="city"
                                        defaultValue={user.city}
                                        onInput={e => setCity(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <StreetviewIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        id="address"
                                        label="Address"
                                        name="address"
                                        defaultValue={user.address}
                                        onInput={e => setAddress(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid className={classes.spacingBetweenDifferentFields}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <EjectIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="levelSelect">Level</InputLabel>
                                        <Tooltip
                                            placement="right"
                                            title={levelSelection[_.invert(levelSelectionMap)[selectedLevel || user.level] || 'Not Selected']}
                                        >
                                            <Select
                                                labelId="levelSelect"
                                                id="levelSelect-id"
                                                defaultValue={_.invert(levelSelectionMap)[user.level] || 'Not Selected'}
                                                style={{ width: 265 }}
                                                onChange={handleLevelSelect}
                                                input={<Input />}
                                                MenuProps={MenuProps}
                                            >
                                                {Object.keys(levelSelection).map((key) => (
                                                    <MenuItem key={key} value={key} style={
                                                        getDropdownStyles(key, selectedLevel, theme)
                                                    }>
                                                        {key}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Tooltip>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="right"
                                        title="General Characteristics of NTRP Playing Levels."
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <PanToolIcon />
                                </Grid>
                                <Grid item>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="handSelect">Main Hand</InputLabel>
                                        <Select
                                            labelId="handSelect"
                                            id="handSelect-id"
                                            defaultValue={user.mainHand || 'Not Selected'}
                                            style={{ width: 300 }}
                                            onChange={handleHandSelect}
                                            input={<Input />}
                                            MenuProps={MenuProps}
                                        >
                                            {handSelection.map((hand) => (
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
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <InfoIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        id="details"
                                        label="Tell more about yourself"
                                        name="details"
                                        multiline
                                        defaultValue={user.details}
                                        onInput={e => setDetails(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container justify="center">
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.buttonBox}
                                >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid className={classes.spacingBetween}></Grid>
                    <form className={classes.form} onSubmit={handleInformationSubmit}>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Typography
                                component="h1"
                                variant="h5"
                                className={classes.contactInformationText}
                            >
                                Credential Information
                                </Typography>
                        </Grid>
                        <Grid className={classes.spacingBetweenFields}></Grid>
                        <Grid container>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <AlternateEmail />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        disabled={true}
                                        style={{ width: 300 }}
                                        id="email"
                                        label="Old Email Address"
                                        defaultValue={user.email}
                                        name="email"
                                        autoComplete="email"
                                        onInput={e => setEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid container spacing={1} alignItems="flex-end" justify="center"></Grid>
                                <Grid item>
                                    <AlternateEmail />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        id="newEmail"
                                        label="New Email Address"
                                        name="newEmail"
                                        autoComplete="email"
                                        onInput={e => setNewEmail(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid item>
                                <VpnKey />
                            </Grid>
                            <Grid item>
                                <TextField
                                    required
                                    style={{ width: 300 }}
                                    name="password"
                                    label="Old Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onInput={e => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <VpnKey />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        name="newPassword"
                                        label="New Password"
                                        type="password"
                                        id="newPassword"
                                        autoComplete="current-password"
                                        onInput={e => setNewPassword(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justify="center">
                            <Button
                                type="submit"
                                variant="outlined"
                                color="secondary"
                                className={classes.buttonBox}
                            >
                                Save
                                </Button>
                        </Grid>
                    </form>
                </Grid>
            </Container>
        </div >
    );
}