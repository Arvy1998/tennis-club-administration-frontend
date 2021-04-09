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
            userProfilePhoto
        }
    }
`;

const GET_PLAYFIELDS = gql`
    query listPlayFields($playFieldQueryInput: PlayFieldQueryInput) {
        listPlayFields(playFieldQueryInput: $playFieldQueryInput) {
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
`

const GET_PLAYFIELD = gql`
    query getPlayField($id: ID!) {
        getPlayField(id: $id) {
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
`

export {
    GET_USER,
    GET_PLAYFIELDS,
    GET_PLAYFIELD,
}