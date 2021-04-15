import React, { useState, useEffect } from 'react';
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';

import InfoIcon from '@material-ui/icons/Info';
import EventIcon from '@material-ui/icons/Event';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';

import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import Navigation from './Navigation';

import filterNotEnteredEntries from '../utils/filterNotEnteredEntries';

import { useMutation } from "@apollo/react-hooks";
import {
    CREATE_RESERVATION,
} from './gql/mutations/mutations';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_RESERVATIONS_BY_PLAYFIELD_ID,
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
    spacingBetweenCalendar: {
        paddingBottom: theme.spacing(2),
    },
    centeredForms: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spacingBetweenDifferentFields: {
        padding: theme.spacing(0.2),
    },
    formHeaderH3Spacing: {
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
}));

export default function ReservationAddForm({ match }) {
    const classes = useStyles();
    const history = useHistory();

    let eventGuid = 0

    function createEventId() {
        return String(eventGuid++)
    }

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const [loadedReservationsData, setLoadedReservationsData] = useState(null);
    const [loadedPlayFieldData, setLoadedPlayFieldData] = useState(null);

    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [choosenEvent, setChoosenEvent] = useState(null);

    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');

    const [addReservation, { data: createReservation }] = useMutation(CREATE_RESERVATION);

    const { loading: reservationsLoading, error: reservationsError, data: reservationsData } = useQuery(
        GET_RESERVATIONS_BY_PLAYFIELD_ID, { variables: { playFieldId: match.params.playFieldId } },
    );
    const { loading: playFieldLoading, error: playFieldError, data: playFieldData } = useQuery(
        GET_PLAYFIELD, { variables: { id: match.params.playFieldId } },
    );

    useEffect(() => {
        if (reservationsLoading) {
            setIsLoading(reservationsLoading);
        }

        if (reservationsError) {
            setIsError(reservationsError);
            setIsLoading(false);
        }

        if (reservationsData) {
            setLoadedReservationsData(reservationsData);
            setIsLoading(false);
        }
    }, [reservationsLoading, reservationsError, reservationsData]);

    useEffect(() => {
        if (playFieldLoading) {
            setIsLoading(playFieldLoading);
        }

        if (playFieldError) {
            setIsError(playFieldError);
            setIsLoading(false);
        }

        if (playFieldData) {
            setLoadedPlayFieldData(playFieldData);
            setIsLoading(false);
        }
    }, [playFieldLoading, playFieldError, playFieldData]);

    useEffect(() => {
        if (!!(startDateTime && endDateTime)) {
            setChoosenEvent([{
                id: createEventId(),
                title: 'Reservation',
                start: startDateTime + ':00',
                end: endDateTime + ':00',
            }]);
        }
    }, [startDateTime, endDateTime]);

    if (!loadedPlayFieldData || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    if (!loadedReservationsData || isLoading) {
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

    let reservations;
    if (loadedReservationsData) {
        reservations = reservationsData.getReservationsByPlayfieldId.map(reservation => {
            return {
                id: createEventId(),
                title: 'Reservation',
                start: reservation.startDateTime + ':00',
                end: reservation.endDateTime + ':00',
            }
        })
    }

    function handleInformationSubmit(event) {
        event.preventDefault();

        setIsLoading(true);

        addReservation({
            variables: {
                reservationInput: filterNotEnteredEntries({
                    playFieldId: match.params.playFieldId,
                    userId: localStorage.getItem('id'),
                    startDateTime,
                    endDateTime,
                }),
            },
        });

        setIsLoading(false);

        history.push('/reservations');
        window.location.reload(true);
    }

    if (!createReservation && isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    console.log({ choosenEvent });

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
                            Make New Reservation
                        </Typography>
                    </Grid>
                    <form className={classes.form} onSubmit={handleInformationSubmit}>
                        <Grid container spacing={1} alignItems="flex-end" justify="center">
                            <Grid className={classes.formHeaderH3Spacing}></Grid>
                            <Grid container spacing={1} alignItems="flex-end" justify="center">
                                <Grid item>
                                    <EventIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="startDateTime"
                                        label="Reservation Start Time"
                                        type="datetime-local"
                                        onInput={e => setStartDateTime(e.target.value)}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <EventIcon />
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="endDateTime"
                                        label="Reservation End Time"
                                        type="datetime-local"
                                        onInput={e => setEndDateTime(e.target.value)}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="right"
                                        title="Selected start and end time should be placed in same day."
                                    >
                                        <InfoIcon />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* reservation calendar */}
                        <Grid className={classes.spacingBetweenCalendar}></Grid>
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            headerToolbar={{
                                left: 'prev,next today',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            initialView='dayGridMonth'
                            editable={false}
                            selectable={false}
                            selectMirror={true}
                            dayMaxEvents={true}
                            weekends={weekendsVisible}
                            events={choosenEvent ? [...choosenEvent, ...currentEvents] : currentEvents}
                        // select={this.handleDateSelect}
                        // eventContent={renderEventContent} // custom render function
                        // eventClick={this.handleEventClick}
                        //eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                        /* you can update a remote database when these fire:
                            eventAdd={function(){}}
                            eventChange={function(){}}
                            eventRemove={function(){}}
                        */
                        />
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