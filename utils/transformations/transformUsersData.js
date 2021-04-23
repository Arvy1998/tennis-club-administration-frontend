import _ from 'lodash';

import levelSelectionMap from "../levelSelectionMap";

const sexMap = {
    'MALE': 'Male',
    'FEMALE': 'Female',
    'OTHER': 'Other',
}

const levelMap = _.invert(levelSelectionMap);

const transformUsersData = (users, clubs) => {
    clubs = clubs.map(club => {
        return {
            ...club,
            userIds: club.users.map(user => user.id)
        }
    });

    return users.map(user => {
        let userClub = _.find(clubs, function(club) {
            return club.userIds.includes(user.id);
        });

        return {
            ...user,
            sex: user.sex ? sexMap[user.sex] : '',
            level: user.level ? levelMap[user.level] : '',
            clubTitle: userClub ? userClub.title : '',
            clubLogo: userClub ? userClub.clubLogo : '',
            rating: user.rating ? parseInt(user.rating) : 0,
            badgeIds: user.badges.map(badge => badge.id),
        }
    })
}

export default transformUsersData;