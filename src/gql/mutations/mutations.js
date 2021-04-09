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
    mutation editUser($playFieldInput: PlayFieldInput!) {
        editUser(playFieldInput: $playFieldInput) {
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
            workHours
            rating
            createdAt
            updatedAt
        }
    }
`;

const UPDATE_PLAYFIELD = gql`
    mutation editUser($id: ID!, $playFieldInput: PlayFieldInput!) {
        editUser(id: $id, playFieldInput: $playFieldInput) {
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
            workHours
            rating
            createdAt
            updatedAt
        }
    }
`;

export {
    LOGIN_USER,
    UPDATE_USER,
    REGISTER_USER,
    CREATE_PLAYFIELD,
    UPDATE_PLAYFIELD,
}