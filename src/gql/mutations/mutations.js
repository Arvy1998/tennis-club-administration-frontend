import { gql } from '@apollo/client';

const LOGIN_USER = gql`
    mutation loginUser($userInput: UserInput!) {
        loginUser(userInput: $userInput)
    }
`;

const REGISTER_USER = gql`
    mutation registerUser($userInput: UserInput!) {
        registerUser(userInput: $userInput)
    }
`;

export {
    LOGIN_USER,
    REGISTER_USER,
}