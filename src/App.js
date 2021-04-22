import React from 'react';

import Login from './Login';
import Register from './Register';
import Home from './Home';
import Account from './Account';
import PlayFields from './PlayFields';
import PlayFieldsAddForm from './PlayFieldsAddForm';
import PlayFieldsEditForm from './PlayFieldsEditForm';
import Reservations from './Reservations';
import ReservationAddForm from './ReservationAddForm';
import ReservationEditForm from './ReservationEditForm';
import Games from './Games';
import GamesAddForm from './GamesAddForm';
import GamesEditForm from './GamesEditForm';
import Players from './Players';
import PlayerDetails from './PlayerDetails';
import ClubsForm from './ClubsForm';
import AdminAccounts from './AdminAccounts';
import About from './About';
import Top from './Top';
import Badges from './Badges';
import AdminNews from './AdminNews';
import AdminAddNews from './AdminAddNews';
import AdminEditNews from './AdminEditNews';
import News from './News';

import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";

import { ApolloProvider } from '@apollo/react-hooks';
import { useAppApolloClient } from './gql/client/apolloClient';

const App = () => {
    return (
        <ApolloProvider client={useAppApolloClient()}>
            <div>
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/register" component={Register} />
                        <Route path="/login" component={Login} />
                        <Route path="/home" component={Home} />
                        <Route path="/admin/news/edit/:id" component={AdminEditNews} />
                        <Route path="/admin/news/add" component={AdminAddNews} />
                        <Route path="/admin/news" component={AdminNews} />
                        <Route path="/news" component={News} />
                        <Route path="/top" component={Top} />
                        <Route path="/about" component={About} />
                        <Route path="/badges" component={Badges} />
                        <Route path="/accounts" component={AdminAccounts} />
                        <Route path="/account" component={Account} />
                        <Route path="/club" component={ClubsForm}/>
                        <Route path="/games/edit/:id" component={GamesEditForm} />
                        <Route path="/games/add" component={GamesAddForm} />
                        <Route path="/games" component={Games} />
                        <Route path="/players/:id" component={PlayerDetails} />
                        <Route path="/players" component={Players} />
                        <Route path="/reservations/edit/:playFieldId/:reservationId" component={ReservationEditForm}/>
                        <Route path="/reservations/add/:playFieldId" component={ReservationAddForm}/>
                        <Route path="/reservations" component={Reservations} />
                        <Route path="/playfields/edit/:id" component={PlayFieldsEditForm} />
                        <Route path="/playfields/add" component={PlayFieldsAddForm} />
                        <Route path="/playfields" component={PlayFields} />
                    </Switch>
                </Router>
            </div>
        </ApolloProvider>
    );
};

export default App;