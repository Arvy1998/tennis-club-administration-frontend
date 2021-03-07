import { gql } from '@apollo/client';

const GET_USER = gql`
    query getUser($email: String!) {
        getUser(email: $email) {
            id
            password
            firstName
            lastName
            email
            city
            role
        }
    }
`;

export {
    GET_USER,
}