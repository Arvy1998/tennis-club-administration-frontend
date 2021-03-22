import { gql } from '@apollo/client';

const GET_USER = gql`
    query getUser($email: String!) {
        getUser(email: $email) {
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
    GET_USER,
}