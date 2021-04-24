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
            club {
                id
                title
                clubLogo
            }
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
            badges {
                id
                title
                description
            }
        }
    }
`;

const GET_USER_BY_ID = gql`
    query getUserById($id: ID!) {
        getUserById(id: $id) {
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
            club {
                id
                title
                clubLogo
            }
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
            badges {
                id
                title
                description
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
            club {
                id
                title
                clubLogo
            }
            badges {
                id
                title
                description
            }
        }
    }
`;

const ALL_USERS = gql`
    query allUsers {
        allUsers {
            id
            firstName
            lastName
            status
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
            playFieldPhoto
            paymentRecipient
            paymentIBAN
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
            playFieldPhoto
            paymentRecipient
            paymentIBAN
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

const GET_RESERVATIONS_BY_PLAYFIELD_ID = gql`
    query getReservationsByPlayfieldId($playFieldId: ID!) {
        getReservationsByPlayfieldId(playFieldId: $playFieldId) {
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
            }
            totalCost
            status
            paid
        }
    }
`;

const GET_RESERVATIONS_BY_USER_ID = gql`
    query getReservationsByUserId($userId: ID!) {
        getReservationsByUserId(userId: $userId) {
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
                title
                city
                address
                paymentRecipient
                paymentIBAN
            }
            totalCost
            status
            paid
        }
    }
`;

const LIST_RESERVATIONS = gql`
    query listReservations {
        listReservations {
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
                title
                city
                address
            }
            totalCost
            status
            paid
        }
    }
`;

const GET_CLUB = gql`
    query getClub($id: ID!) {
        getClub(id: $id) {
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

const LIST_CLUBS = gql`
    query listClubs {
        listClubs {
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

const GET_CLUB_BY_CREATOR_ID = gql`
    query getClubByCreatorId($creatorId: ID!) {
        getClubByCreatorId(creatorId: $creatorId) {
            id
        }
    }
`;

const LIST_BADGES = gql`
    query listBadges {
        listBadges {
            id
            title
            description
        }
    }
`;

const GET_NEWS = gql`
    query getNews($id: ID!) {
        getNews(id: $id) {
            id
            title
            description
            firstClubPlaying {
                id
                title
                clubLogo
            }
            secondClubPlaying {
                id
                title
                clubLogo
            }
            date
            playField {
                id
                title
                address
                city
            }
        }
    }
`;

const LIST_NEWS = gql`
    query listNews {
        listNews {
            id
            title
            description
            firstClubPlaying {
                id
                title
                clubLogo
            }
            secondClubPlaying {
                id
                title
                clubLogo
            }
            date
            playField {
                id
                title
                address
                city
            }
        }
    }
`;

const GET_PLAYFIELDS_SELECTION = gql`
    query listPlayFields($playFieldQueryInput: PlayFieldQueryInput) {
        listPlayFields(playFieldQueryInput: $playFieldQueryInput) {
            id
            title
        }
    }
`;

export {
    GET_USER,
    GET_USER_BY_ID,
    ALL_USERS,
    GET_PLAYFIELDS,
    GET_PLAYFIELD,
    LIST_GAMES,
    GET_GAME,
    GET_PLAYERS,
    GET_RESERVATIONS_BY_PLAYFIELD_ID,
    GET_RESERVATIONS_BY_USER_ID,
    GET_CLUB,
    LIST_CLUBS,
    GET_CLUB_BY_CREATOR_ID,
    LIST_BADGES,
    GET_NEWS,
    LIST_NEWS,
    GET_PLAYFIELDS_SELECTION,
    LIST_RESERVATIONS,
}