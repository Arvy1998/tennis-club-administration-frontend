import { gql } from '@apollo/client';

const LOGIN_USER = gql`
    mutation loginUser($userInput: UserInput!) {
        loginUser(userInput: $userInput) {
            id
            firstName
            lastName
            email
            role
            token
        }
    }
`;

const REGISTER_USER = gql`
    mutation registerUser($userInput: UserInput!) {
        registerUser(userInput: $userInput) {
            id
            firstName
            lastName
            email
            role
            token
        }
    }
`;

const UPDATE_USER = gql`
    mutation editUser($email: String!, $userInput: UserInput!) {
        editUser(email: $email, userInput: $userInput) {
            id
            firstName
            lastName
            city
            address
            sex
            level
            phoneNumber
            email
            city
            role
            userProfilePhoto
            mainHand
            details
        }
    }
`;

const CREATE_PLAYFIELD = gql`
    mutation createPlayField($playFieldInput: PlayFieldInput!) {
        createPlayField(playFieldInput: $playFieldInput) {
            id
            title
            address
            cost
            ownerPhoneNumber
            ownerEmailAddress
            courtsNumber
            courtType
            courtFloorType
            additionalInformation
            webpage
            rating
            playFieldPhoto
            createdAt
            updatedAt
        }
    }
`;

const UPDATE_PLAYFIELD = gql`
    mutation updatePlayField($id: ID!, $playFieldInput: PlayFieldInput!) {
        updatePlayField(id: $id, playFieldInput: $playFieldInput) {
            id
            title
            address
            cost
            ownerPhoneNumber
            ownerEmailAddress
            courtsNumber
            courtType
            courtFloorType
            additionalInformation
            webpage
            rating
            playFieldPhoto
            createdAt
            updatedAt
        }
    }
`;

const DELETE_PLAYFIELD = gql`
    mutation deletePlayField($id: ID!) {
        deletePlayField(id: $id) {
            id
        }
    }
`;

const CREATE_GAME = gql`
    mutation createGame($gameInput: GameInput!) {
        createGame(gameInput: $gameInput) {
            id
            date
            firstTeamFirstPlayer {
                id
                firstName
                lastName
            }
            firstTeamSecondPlayer {
                id
                firstName
                lastName
            }
            secondTeamFirstPlayer {
                id
                firstName
                lastName
            }
            secondTeamSecondPlayer {
                id
                firstName
                lastName
            }
            matches {
                firstTeamScore
                secondTeamScore
            }
        }
    }
`;

const UPDATE_GAME = gql`
    mutation updateGame($id: ID!, $gameInput: GameInput!) {
        updateGame(id: $id, gameInput: $gameInput) {
            id
            date
            firstTeamFirstPlayer {
                id
                firstName
                lastName
            }
            firstTeamSecondPlayer {
                id
                firstName
                lastName
            }
            secondTeamFirstPlayer {
                id
                firstName
                lastName
            }
            secondTeamSecondPlayer {
                id
                firstName
                lastName
            }
            matches {
                firstTeamScore
                secondTeamScore
            }
        }
    }
`;

const DELETE_GAME = gql`
    mutation deleteGame($id: ID!) {
        deleteGame(id: $id) {
            id
        }
    }
`;

const CREATE_RESERVATION = gql`
    mutation createReservation($reservationInput: ReservationInput!) {
        createReservation(reservationInput: $reservationInput) {
            id
            startDateTime
            endDateTime
            user {
                id
            }
            isRecurring
            recurringDate
            recurringPeriod
            recurringEvery
            playField {
                id
                cost
            }
            totalCost
            paid
        }
    }
`;

const UPDATE_RESERVATION = gql`
    mutation updateReservation($id: ID!, $reservationInput: ReservationInput!) {
        updateReservation(id: $id, reservationInput: $reservationInput) {
            id
            startDateTime
            endDateTime
            user {
                id
            }
            isRecurring
            recurringDate
            recurringPeriod
            recurringEvery
            playField {
                id
                cost
            }
            totalCost
            paid
        }
    }
`;

const DELETE_RESERVATION = gql`
    mutation deleteReservation($id: ID!) {
        deleteReservation(id: $id) {
            id
        }
    }
`;

const CREATE_CLUB = gql`
    mutation createClub($clubInput: ClubInput!) {
        createClub(clubInput: $clubInput) {
            id
            title
            description
            clubLogo
            creator {
                id
                firstName
                lastName
            }
            users {
                id
                firstName
                lastName
                rating
            }
        }
    }
`;

const UPDATE_CLUB = gql`
    mutation updateClub($id: ID!, $clubInput: ClubInput!) {
        updateClub(id: $id, clubInput: $clubInput) {
            id
            title
            description
            clubLogo
            creator {
                id
                firstName
                lastName
            }
            users {
                id
                firstName
                lastName
                rating
            }
        }
    }
`;

const DELETE_CLUB = gql`
    mutation deleteClub($id: ID!) {
        deleteClub(id: $id) {
            id
        }
    }
`;

export {
    LOGIN_USER,
    UPDATE_USER,
    REGISTER_USER,
    CREATE_PLAYFIELD,
    UPDATE_PLAYFIELD,
    DELETE_PLAYFIELD,
    CREATE_GAME,
    UPDATE_GAME,
    DELETE_GAME,
    CREATE_RESERVATION,
    UPDATE_RESERVATION,
    DELETE_RESERVATION,
    CREATE_CLUB,
    UPDATE_CLUB,
    DELETE_CLUB,
}