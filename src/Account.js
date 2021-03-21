import React, { useState } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

import AlternateEmail from '@material-ui/icons/AlternateEmail';
import VpnKey from '@material-ui/icons/VpnKey';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import WcIcon from '@material-ui/icons/Wc';
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import StreetviewIcon from '@material-ui/icons/Streetview';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Navigation from './Navigation';

import { useAuthToken } from './hooks/useAuthToken';
import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';

import { useMutation } from "@apollo/react-hooks";
import {
    REGISTER_USER,
} from './gql/mutations/mutations';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

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
        marginTop: theme.spacing(10),
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
    contactInformationText: {
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    spacingBetween: {
        padding: theme.spacing(5),
    },
}));

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const genderSelection = [
    'Male',
    'Female',
    'Other',
];

const levelSelection = [

];

export default function Account() {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

    const [_, setAuthToken] = useAuthToken();

    const [registerUser, { data: registerData }] = useMutation(REGISTER_USER, {
        onCompleted: (data) => {
            setAuthToken(data.registerUser);
        },
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [level, setLevel] = useState('');

    const [selectedGender, setSelectedGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [registerActionDone, setRegisterActionDone] = useState(false);

    if (!registerData && registerActionDone) {
        return (
            <div className={classes.root}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    function handleGenderSelect(event) {
        setSelectedGender(event.target.value.toUpperCase());
    };

    function getStyles(gender, selectedGender, theme) {
        return {
            fontWeight:
                selectedGender.indexOf(gender) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    function handleContactInformationSubmit(event) {
        event.preventDefault();

        setRegisterActionDone(true);

        registerUser({
            variables: {
                userInput: filterNotEnteredEntries({
                    firstName,
                    lastName,
                    sex: selectedGender,
                    city,
                    address,
                    phoneNumber,
                    email,
                    password,
                    newPassword,
                    newEmail,
                }),
            },
        });
    }

    function handleCredentialInformationSubmit(event) {
        event.preventDefault();

        setRegisterActionDone(true);

        registerUser({
            variables: {
                userInput: filterNotEnteredEntries({
                    firstName,
                    lastName,
                    sex: selectedGender,
                    phoneNumber,
                    email,
                    password,
                }),
            },
        });
    }

    if (registerData && registerData.registerUser) {
        history.push('/home');
    }

    return (
        <div className={classes.root}>
            <Navigation />
            <main className={classes.formContainer}>
                <div className={classes.appBarSpacer} />
                <Container className={classes.container}>
                    <Grid container spacing={3}>
                        <form className={classes.form} onSubmit={handleContactInformationSubmit}>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Typography
                                    component="h1"
                                    variant="h5"
                                    className={classes.contactInformationText}
                                >
                                    Contact Information
                                </Typography>
                            </Grid>
                            <Grid container>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <Grid item>
                                        <TextFieldsIcon />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            autoComplete="fname"
                                            name="firstName"
                                            required
                                            style={{ width: 300 }}
                                            id="firstName"
                                            label="First Name"
                                            onInput={e => setFirstName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <TextFieldsIcon />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            required
                                            style={{ width: 300 }}
                                            id="lastName"
                                            label="Last Name"
                                            name="lastName"
                                            autoComplete="lname"
                                            onInput={e => setLastName(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
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
                                                style={{ width: 300 }}
                                                onChange={handleGenderSelect}
                                                input={<Input />}
                                                MenuProps={MenuProps}
                                            >
                                                {genderSelection.map((gender) => (
                                                    <MenuItem key={gender} value={gender} style={
                                                        getStyles(gender, selectedGender, theme)
                                                    }>
                                                        {gender}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <Grid item>
                                        <PhoneIcon />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            style={{ width: 300 }}
                                            id="phoneNumber"
                                            label="Phone Number"
                                            name="phoneNumber"
                                            onInput={e => setPhoneNumber(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <Grid item>
                                        <HomeIcon />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            style={{ width: 300 }}
                                            id="city"
                                            label="City"
                                            name="city"
                                            onInput={e => setCity(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <StreetviewIcon />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            style={{ width: 300 }}
                                            id="address"
                                            label="Address"
                                            name="address"
                                            onInput={e => setAddress(e.target.value)}
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
                        <Grid className={classes.spacingBetween}></Grid>
                        <form className={classes.form} onSubmit={handleCredentialInformationSubmit}>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Typography
                                    component="h1"
                                    variant="h5"
                                    className={classes.contactInformationText}
                                >
                                    Credential Information
                                </Typography>
                            </Grid>
                            <Grid container>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <Grid item>
                                        <AlternateEmail />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            style={{ width: 300 }}
                                            id="email"
                                            label="Old Email Address"
                                            name="email"
                                            autoComplete="email"
                                            onInput={e => setEmail(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <AlternateEmail />
                                    </Grid>
                                    <Grid item >
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
                                    <Grid item>
                                        <VpnKey />
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            style={{ width: 300 }}
                                            name="newPassword"
                                            label="New Password"
                                            type="newPassword"
                                            id="password"
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
            </main>
        </div>
    );
}