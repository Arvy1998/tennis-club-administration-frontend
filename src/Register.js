import React, { useState } from 'react';
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

import SportsTennis from '@material-ui/icons/SportsTennis';
import AlternateEmail from '@material-ui/icons/AlternateEmail';
import VpnKey from '@material-ui/icons/VpnKey';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import WcIcon from '@material-ui/icons/Wc';
import PhoneIcon from '@material-ui/icons/Phone';
import GroupWorkIcon from '@material-ui/icons/GroupWork';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import LinearProgress from '@material-ui/core/LinearProgress';

import { useMutation } from "@apollo/react-hooks";
import {
    REGISTER_USER,
} from './gql/mutations/mutations';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import { useAuthToken } from './hooks/useAuthToken';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';
import validateEmail from '../utils/validateEmail';

import MenuProps from '../utils/props/MenuProps';
import getDropdownStyles from '../utils/props/getDropdownStyles';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
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
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const genderSelection = [
    'Male',
    'Female',
    'Other',
    'Not Selected',
];

const roleSelection = [
    'Player',
    'Trenner',
];

const Register = () => {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

    const [_, setAuthToken, setUser] = useAuthToken();

    const [registerUser, { data: registerData }] = useMutation(REGISTER_USER, {
        onCompleted: (data) => {
            setAuthToken(data.registerUser.token);
            setUser(data.registerUser);
        },
    });

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
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

    function handleRoleSelect(event) {
        setSelectedRole(event.target.value.toUpperCase());
    }

    function handleSubmit(event) {
        event.preventDefault();

        setRegisterActionDone(true);

        registerUser({
            variables: {
                userInput: filterNotEnteredEntries({
                    firstName,
                    lastName,
                    sex: selectedGender !== 'NOT SELECTED' ? selectedGender : '',
                    phoneNumber,
                    email,
                    password,
                    role: selectedRole,
                }),
            },
        });
    }

    if (registerData && registerData.registerUser) {
        setAuthToken(registerData.registerUser.token);
        setUser(registerData.registerUser);
        history.push('/home');
        window.location.reload(true);
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                    justify="center"
                >
                    <Avatar className={classes.avatar}>
                        <SportsTennis />
                    </Avatar>
                    <Typography component="h1" variant="h5" className={classes.appName}>
                        LawnTennisClubIS
                    </Typography>
                </Grid>
                <Typography component="h1" variant="h5" className={classes.welcomeText}>
                    Welcome! Please register here.
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
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
                        </Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
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
                                                getDropdownStyles(gender, selectedGender, theme)
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
                                <GroupWorkIcon />
                            </Grid>
                            <Grid item>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="roleSelect">Register As:</InputLabel>
                                    <Select
                                        labelId="roleSelect"
                                        id="roleSelect-id"
                                        defaultValue={'Player'}
                                        style={{ width: 300 }}
                                        onChange={handleRoleSelect}
                                        input={<Input />}
                                        MenuProps={MenuProps}
                                        required
                                    >
                                        {roleSelection.map((role) => (
                                            <MenuItem key={role} value={role} style={
                                                getDropdownStyles(role, selectedRole, theme)
                                            }>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid item>
                                <AlternateEmail />
                            </Grid>
                            <Grid item >
                                <TextField
                                    required
                                    style={{ width: 300 }}
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    error={email ? !validateEmail(email) : false}
                                    helperText={email && !validateEmail(email) ? 'Invalid email address' : null}
                                    autoComplete="email"
                                    onInput={e => setEmail(e.target.value)}
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
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onInput={e => setPassword(e.target.value)}
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
                            disabled={!validateEmail(email)}
                        >
                            Register
                    </Button>
                    </Grid>
                    <Box>
                        <Grid container>
                            <Grid item>
                                <Link
                                    variant="body2"
                                    onClick={() => {
                                        history.push('/login');
                                    }}
                                >
                                    {'Already have an account? Sign in!'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </div>
        </Container>
    );
}

export default Register;