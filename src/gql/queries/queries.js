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
            mainHand
            details
            rating
            games {
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
    }
`;

const GET_PLAYERS = gql`
    query getPlayers {
        getPlayers {
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
            rating
        }
    }
`;

const ALL_USERS = gql`
    query allUsers {
        allUsers {
            id
            firstName
            lastName
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
            city
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

const GET_PLAYFIELD = gql`
    query getPlayField($id: ID!) {
        getPlayField(id: $id) {
            id
            title
            address
            cost
            city
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

const LIST_GAMES = gql`
    query listGames {
        listGames {
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

const GET_GAME = gql`
    query getGame($id: ID!) {
        getGame(id: $id) {
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
    GET_USER,
    ALL_USERS,
    GET_PLAYFIELDS,
    GET_PLAYFIELD,
    LIST_GAMES,
    GET_GAME,
    GET_PLAYERS,
}