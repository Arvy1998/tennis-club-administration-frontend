import React from 'react';
import { Link } from 'react-router-dom'

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import GamesIcon from '@material-ui/icons/Games';
import TodayIcon from '@material-ui/icons/Today';
import TocIcon from '@material-ui/icons/Toc';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import TableChartIcon from '@material-ui/icons/TableChart';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import InfoIcon from '@material-ui/icons/Info';

export const mainListItems = (
    <div>
        <ListItem button component={Link} to="/home">
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/games">
            <ListItemIcon>
                <GamesIcon />
            </ListItemIcon>
            <ListItemText primary="Games" />
        </ListItem>
        <ListItem button component={Link} to="/reservations">
            <ListItemIcon>
                <TodayIcon />
            </ListItemIcon>
            <ListItemText primary="Reservations" />
        </ListItem>
        <ListItem button component={Link} to="/playfields">
            <ListItemIcon>
                <TocIcon />
            </ListItemIcon>
            <ListItemText primary="Play Fields" />
        </ListItem>
        <ListItem button component={Link} to="/badges">
            <ListItemIcon>
                <LoyaltyIcon />
            </ListItemIcon>
            <ListItemText primary="Badges" />
        </ListItem>
        <ListItem button component={Link} to="/account">
            <ListItemIcon>
                <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Your Account" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Other</ListSubheader>
        <ListItem button component={Link} to="/top">
            <ListItemIcon>
                <TableChartIcon />
            </ListItemIcon>
            <ListItemText primary="TOP Players" />
        </ListItem>
        <ListItem button component={Link} to="/news">
            <ListItemIcon>
                <AnnouncementIcon />
            </ListItemIcon>
            <ListItemText primary="News" />
        </ListItem>
        <ListItem button component={Link} to="/about">
            <ListItemIcon>
                <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
        </ListItem>
    </div>
);