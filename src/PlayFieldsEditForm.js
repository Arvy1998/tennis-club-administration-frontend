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
import Paper from '@material-ui/core/Paper';

import AlternateEmail from '@material-ui/icons/AlternateEmail';
import VpnKey from '@material-ui/icons/VpnKey';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import WcIcon from '@material-ui/icons/Wc';
import PhoneIcon from '@material-ui/icons/Phone';
import HomeIcon from '@material-ui/icons/Home';
import StreetviewIcon from '@material-ui/icons/Streetview';
import EjectIcon from '@material-ui/icons/Eject';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';
import BorderHorizontalIcon from '@material-ui/icons/BorderHorizontal';
import InfoIcon from '@material-ui/icons/Info';
import StarIcon from '@material-ui/icons/Star';
import LanguageIcon from '@material-ui/icons/Language';
import PhotoIcon from '@material-ui/icons/Photo';

import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@material-ui/icons/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';

import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import Rating from '@material-ui/lab/Rating';

import Navigation from './Navigation';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';

import { useMutation, useQuery } from "@apollo/react-hooks";

import {
    DELETE_PLAYFIELD,
    UPDATE_PLAYFIELD,
} from './gql/mutations/mutations';

import {
    GET_PLAYFIELD,
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

const labels = {
    0: 'Not Selected',
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

export default function PlayFieldsEditForm({ match }) {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();

    const [updated, setUpdated] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [hover, setHover] = React.useState(-1);

    const [editPlayField, { data: updatePlayField }] = useMutation(UPDATE_PLAYFIELD);
    const [removePlayField, { data: deletePlayField }] = useMutation(DELETE_PLAYFIELD);

    const [loadedPlayFieldData, setLoadedPlayfieldData] = useState('');

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [cost, setCost] = useState(0);
    const [ownerPhoneNumber, setOwnerPhoneNumber] = useState('');
    const [ownerEmailAddress, setOwnerEmailAddress] = useState('');
    const [courtsNumber, setCourtsNumber] = useState(0);
    const [courtType, setCourtType] = useState('');
    const [courtFloorType, setCourtFloorType] = useState('');
    const [webpage, setWebpage] = useState('');
    const [rating, setRating] = useState(0);

    const [playFieldPhoto, setPlayFieldPhoto] = useState('');
    const [fileName, setFileName] = useState('');

    const { loading, error, data } = useQuery(GET_PLAYFIELD, {
        variables: { id: match.params.id },
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
            setLoadedPlayfieldData(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    if (!loadedPlayFieldData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    let playField;
    if (loadedPlayFieldData) {
        playField = loadedPlayFieldData.getPlayField;
    }

    function handleInformationSubmit(event) {
        event.preventDefault();

        setUpdated(true);
        setIsLoading(true);

        editPlayField({
            variables: {
                id: match.params.id,
                playFieldInput: filterNotEnteredEntries({
                    title,
                    city,
                    address,
                    cost: parseFloat(cost),
                    ownerPhoneNumber,
                    ownerEmailAddress,
                    courtsNumber: parseInt(courtsNumber),
                    courtType,
                    courtFloorType,
                    webpage,
                    rating,
                    playFieldPhoto,
                }),
            },
        });

        setUpdated(false);
        setIsLoading(false);

        history.push('/playfields');
        window.location.reload(true);
    }

    function triggerDeleteAction(event) {
        event.preventDefault();

        setUpdated(true);
        setIsLoading(true);

        removePlayField({
            variables: {
                id: match.params.id,
            },
        });

        setUpdated(false);
        setIsLoading(false);

        history.push('/playfields');
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
            setPlayFieldPhoto(base64String);
        };
    }

    if (!updatePlayField && updated) {
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
                            Play Field Details
                        </Typography>
                    </Grid>
                    <form className={classes.form} onSubmit={handleInformationSubmit}>
                        <Grid container>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <TextFieldsIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        autoComplete="title"
                                        name="title"
                                        required
                                        defaultValue={playField.title}
                                        style={{ width: 300 }}
                                        id="title"
                                        label="Title"
                                        onInput={e => setTitle(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <HomeIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        required
                                        style={{ width: 300 }}
                                        id="city"
                                        defaultValue={playField.city}
                                        label="City"
                                        name="city"
                                        autoComplete="city"
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
                                        required
                                        style={{ width: 300 }}
                                        id="address"
                                        defaultValue={playField.address}
                                        label="Address"
                                        name="address"
                                        autoComplete="address"
                                        onInput={e => setAddress(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <AlternateEmail />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        id="email"
                                        required
                                        defaultValue={playField.ownerEmailAddress}
                                        label="Owner's Email Address"
                                        name="ownerEmailAddress"
                                        autoComplete="ownerEmailAddress"
                                        onInput={e => setOwnerEmailAddress(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <PhoneIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        id="ownerPhoneNumber"
                                        defaultValue={playField.ownerPhoneNumber}
                                        label="Owner's Phone Number"
                                        name="ownerPhoneNumber"
                                        onInput={e => setOwnerPhoneNumber(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <EuroSymbolIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        required
                                        style={{ width: 265 }}
                                        id="cost"
                                        defaultValue={playField.cost}
                                        label="Reservation Cost"
                                        name="cost"
                                        autoComplete="cost"
                                        onInput={e => setCost(e.target.value)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="right"
                                        title="Approximate reservation cost per hour."
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <BorderHorizontalIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        required
                                        style={{ width: 300 }}
                                        id="courtsNumber"
                                        label="Courts Number"
                                        defaultValue={playField.courtsNumber}
                                        name="courtsNumber"
                                        autoComplete="courtsNumber"
                                        onInput={e => setCourtsNumber(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <TextFieldsIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        required
                                        style={{ width: 265 }}
                                        id="courtType"
                                        defaultValue={playField.courtType}
                                        label="Court Type"
                                        name="courtType"
                                        autoComplete="courtType"
                                        onInput={e => setCourtType(e.target.value)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="right"
                                        title="Is your play field is outside the building, inside the building, has fence, has ceiling..."
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <TextFieldsIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        required
                                        style={{ width: 265 }}
                                        defaultValue={playField.courtFloorType}
                                        id="courtFloorType"
                                        label="Court Floor Type"
                                        name="courtFloorType"
                                        autoComplete="courtFloorType"
                                        onInput={e => setCourtFloorType(e.target.value)}
                                    />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="right"
                                        title="What play field's floor are made from? Examples: sand, wood, asphalt, fake grass..."
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <LanguageIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        style={{ width: 300 }}
                                        id="webpage"
                                        label="Webpage"
                                        defaultValue={playField.webpage}
                                        name="webpage"
                                        autoComplete="webpage"
                                        onInput={e => setWebpage(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <Grid className={classes.spacingBetweenRatingStars}></Grid>
                            <Grid
                                container
                                spacing={1}
                                alignItems="center"
                                justify="center"
                                className={classes.ratingGrid}
                            >
                                <Grid item>
                                    <StarIcon />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="bottom"
                                        title={rating !== null && labels[hover !== -1 ? hover : rating]}
                                    >
                                        <Rating
                                            required
                                            precision={0.5}
                                            size="large"
                                            defaultValue={playField.rating}
                                            name="playfield-rating-bar"
                                            getLabelText={(value) => { customIcons[value].label }}
                                            IconContainerComponent={IconContainer}
                                            onChangeActive={(event, newHover) => {
                                                setHover(newHover || 0);
                                            }}
                                            onChange={(event, newValue) => {
                                                setRating(newValue || 0);
                                            }}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="right"
                                        title="What is global rating between 1 and 5?"
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid className={classes.spacingBetweenRatingStars}></Grid>
                            <Grid container spacing={1} alignItems="center" justify="center">
                                <Grid item>
                                    <Avatar
                                        id="avatar-tennis"
                                        sizes="100px"
                                        alt="tennis-court"
                                        src={playFieldPhoto || playField.playFieldPhoto }
                                        variant="square"
                                        className={classes.media}
                                    >
                                        <PhotoIcon />
                                    </Avatar>
                                </Grid>
                                <Grid item>
                                    <input
                                        accept="image/*"
                                        className={classes.input}
                                        onChange={fileToBase64}
                                        id="contained-button-file-playfield"
                                        multiple
                                        type="file"
                                    />
                                    <label htmlFor="contained-button-file-playfield">
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
                        </Grid>
                        <Grid container justify="center">
                            <Button
                                type="submit"
                                variant="outlined"
                                color="secondary"
                                className={classes.buttonBox}
                            >
                                Update
                                </Button>
                            <Grid className={classes.spacingBetweenRatingStars}></Grid>
                            <Button
                                variant="contained"
                                color="secondary"
                                className={classes.buttonBox}
                                onClick={triggerDeleteAction}
                            >
                                Delete
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Container>
        </div >
    );
}