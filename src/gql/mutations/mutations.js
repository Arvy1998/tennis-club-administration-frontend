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

export {
    LOGIN_USER,
    UPDATE_USER,
    REGISTER_USER,
    CREATE_PLAYFIELD,
    UPDATE_PLAYFIELD,
    DELETE_PLAYFIELD,
    CREATE_GAME,
    UPDATE_GAME,
}