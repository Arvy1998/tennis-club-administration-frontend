import React, { useState } from 'react';
import { useHistory } from 'react-router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import SportsTennis from '@material-ui/icons/SportsTennis';
import AlternateEmail from '@material-ui/icons/AlternateEmail';
import VpnKey from '@material-ui/icons/VpnKey';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import LinearProgress from '@material-ui/core/LinearProgress';

import { useMutation } from "@apollo/react-hooks";
import {
    LOGIN_USER,
} from './gql/mutations/mutations';

import { useAuthToken } from './hooks/useAuthToken';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';
import validateEmail from '../utils/validateEmail';

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
    buttonBox: {
        justifyContent: 'center',
        margin: theme.spacing(0, 0, 3),
    },
    welcomeText: {
        color: 'grey',
        marginTop: theme.spacing(1),
    },
    appName: {
        fontWeight: 'bold',
    },
    checkBoxPadding: {
        marginLeft: theme.spacing(2),
    },
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const Login = () => {
    const classes = useStyles();
    const history = useHistory();

    const [_, setAuthToken, setUser] = useAuthToken();

    const [loginUser, { data: loginData }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            setAuthToken(data.loginUser.token);
            setUser(data.loginUser);
        },
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginActionDone, setLoginActionDone] = useState(false);

    if (!loginData && loginActionDone) {
        return (
            <div className={classes.root}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    function handleSubmit(event) {
        event.preventDefault();

        setLoginActionDone(true);

        loginUser({
            variables: {
                userInput: filterNotEnteredEntries({
                    email,
                    password,
                }),
            },
        });
    }

    if (loginData && loginData.loginUser) {
        setAuthToken(loginData.loginUser.token);
        setUser(loginData.loginUser);
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
                    Welcome back! Please login to your account.
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} >
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
                    <Box p={1} />
                    <Grid container spacing={2} alignItems="flex-end">
                        <FormControlLabel
                            control={<Checkbox
                                className={classes.checkBoxMargin}
                                value="remember"
                                color="secondary"
                            />}
                            label="Remember me"
                        />
                    </Grid>
                    <Box />
                    <Grid container justify="center">
                        <Button
                            type="submit"
                            variant="outlined"
                            color="secondary"
                            className={classes.buttonBox}
                            disabled={!validateEmail(email)}
                        >
                            Sign In
                    </Button>
                    </Grid>
                    <Box>
                        <Grid container>
                            <Grid item>
                                <Link
                                    variant="body2"
                                    onClick={() => {
                                        history.push('/register');
                                    }}
                                >
                                    {"Don't have an account? Register!"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </div>
        </Container >
    );
};

export default Login;