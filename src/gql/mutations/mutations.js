import { gql } from '@apollo/client';

const LOGIN_USER = gql`
    mutation loginUser($userInput: UserInput!) {
        loginUser(userInput: $userInput) {
            id
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
        }
    }
`;

export {
    LOGIN_USER,
    UPDATE_USER,
    REGISTER_USER,
}