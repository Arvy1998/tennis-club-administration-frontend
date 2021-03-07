import React from 'react';

import Login from './Login';

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
                        <Route path="/login" component={Login} />
                    </Switch>
                </Router>
            </div>
        </ApolloProvider>
    );
};

export default App;