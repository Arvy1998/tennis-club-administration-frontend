import React, { useEffect, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import ClubsAddForm from './ClubsAddForm';
import ClubsEditForm from './ClubsEditForm';

import LinearProgress from '@material-ui/core/LinearProgress';

import { useQuery } from "@apollo/react-hooks";
import {
    GET_CLUB_BY_CREATOR_ID,
} from './gql/queries/queries';

const useStyles = makeStyles((theme) => ({
    loadingBarContainer: {
        paddingBottom: theme.spacing(6),
    },
}));

export default function ClubsForm() {
    const classes = useStyles();

    const [loadedClub, setLoadedClub] = useState(null);

    const [isLoading, setIsLoading] = useState(null);
    const [isError, setIsError] = useState(null);

    const { loading, error, data } = useQuery(GET_CLUB_BY_CREATOR_ID, {
        variables: { creatorId: localStorage.getItem('id') }
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
            setLoadedClub(data);
            setIsLoading(false);
        }
    }, [loading, error, data]);

    if (!loadedClub || isLoading) {
        return (
            <div className={classes.loadingBarContainer}>
                <LinearProgress color="secondary" />
            </div>
        );
    }

    return (
        loadedClub.getClubByCreatorId ? <ClubsEditForm clubId={loadedClub.getClubByCreatorId.id} /> : <ClubsAddForm />
    )
}