import React, { useState, useEffect } from 'react';

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
import LinearProgress from '@material-ui/core/LinearProgress';

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
    'Not Selected',
];

const genderMap = {
    'MALE': 'Male',
    'FEMALE': 'Female',
    'OTHER': 'Other',
}

const levelSelection = {
    'Level 1.5': 'You have limited experience and are working primarily on getting the ball in play.',
    'Level 2.0': 'You lack court experience and your strokes need developing.  You are familiar with the basic positions for singles and doubles play.',
    'Level 2.5': 'You are learning to judge where the ball is going, although your court coverage is limited.  You can sustain a short rally of slow pace with other players of the same ability.',
    'Level 3.0': 'You are fairly consistent when hitting medium-paced shots, but are not comfortable with all strokes and lack execution when trying for directional control, depth, or power. Your most common doubles formation is one-up, one-back.',
    'Level 3.5': 'You have achieved improved stroke dependability with directional control on moderate shots, but need to develop depth and variety. You exhibit more aggressive net play, have improved court coverage and are developing teamwork in doubles.',
    'Level 4.0': 'You have dependable strokes, including directional control and depth on both forehand and backhand sides on moderate-paced shots.  You can use lobs, overheads, approach shots and volleys with some success and occasionally force errors when serving. Rallies may be lost due to impatience. Teamwork in doubles is evident.',
    'Level 4.5': 'You have developed your use of power and spin and can handle pace. You have sound footwork, can control depth of shots, and attempt to vary game plan according to your opponents.  You can hit first serves with power and accuracy and place the second serve.  You tend to overhit on difficult shots. Aggressive net play is common in doubles.',
    'Level 5.0': 'You have good shot anticipation and frequently have an outstanding shot or attribute around which a game may be structured.  You can regularly hit winners or force errors off of short balls and can put away volleys.  You can successfully execute lobs, drop shots, half volleys, overhead smashes, and have good depth and spin on most second serves.',
    'Level 5.5': 'You have mastered power and/or consistency as a major weapon. You can vary strategies and styles of play in a competitive situation and hit dependable shots in a stress situation.',
    'Level 6.0 - 7.0': 'You have had intensive training for national tournament competition at the junior and collegiate levels and have obtained a sectional and/or national ranking.',
    'Level 7.0': 'You are a world-class player.',
};

const levelSelectionMap = {
    'Level 1.5': 'LEVEL_1_5',
    'Level 2.0': 'LEVEL_2_0',
    'Level 2.5': 'LEVEL_2_5',
    'Level 3.0': 'LEVEL_3_0',
    'Level 3.5': 'LEVEL_3_5',
    'Level 4.0': 'LEVEL_4_0',
    'Level 4.5': 'LEVEL_4_5',
    'Level 5.0': 'LEVEL_5_0',
    'Level 5.5': 'LEVEL_5_5',
    'Level 6.0 - 7.0': 'LEVEL_6_0_7_0',
    'Level 7.0': 'LEVEL_7_0',
};

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
    const [level, setLevel] = useState('');

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
        }

        if (data) {
            setLoadedUserData(data);
        }
    }, []);

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

    function getStyles(gender, selectedGender, theme) {
        return {
            fontWeight:
                selectedGender.indexOf(gender) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
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
                    city,
                    address,
                    phoneNumber,
                    email: localStorage.getItem('email'),
                    password,
                    newPassword,
                    newEmail,
                }),
            },
        });

        setIsLoading(false);
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
            <main className={classes.formContainer}>
                <div className={classes.centeredForms} />
                <Container className={classes.container}>
                    <Grid container spacing={3} alignItems="flex-end" justify="center">
                        <form className={classes.form} onSubmit={handleInformationSubmit}>
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
                                        <Grid item >
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
                                            defaultValue={user.phoneNumber}
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
                                            defaultValue={user.city}
                                            onInput={e => setCity(e.target.value)}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <Grid item>
                                        <StreetviewIcon />
                                    </Grid>
                                    <Grid item >
                                        <TextField
                                            style={{ width: 300 }}
                                            id="address"
                                            label="Address"
                                            name="address"
                                            defaultValue={user.address}
                                            onInput={e => setAddress(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid>
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
                            <Grid container>
                                <Grid container spacing={1} alignItems="flex-end" justify="center">
                                    <Grid item>
                                        <AlternateEmail />
                                    </Grid>
                                    <Grid item >
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
            </main>
        </div >
    );
}