import React from 'react';

import Login from './Login';
import Register from './Register';
import Home from './Home';
import Account from './Account';
import PlayFields from './PlayFields';
import PlayFieldsAddForm from './PlayFieldsAddForm';
import PlayFieldsEditForm from './PlayFieldsEditForm';
import Reservations from './Reservations';

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
                        <Route exact path="/" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/login" component={Login} />
                        <Route path="/home" component={Home} />
                        <Route path="/account" component={Account} />
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