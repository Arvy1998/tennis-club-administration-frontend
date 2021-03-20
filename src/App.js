import React from 'react';

import Login from './Login';
import Register from './Register';
import Home from './Home';

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
                    </Switch>
                </Router>
            </div>
        </ApolloProvider>
    );
};

export default App;