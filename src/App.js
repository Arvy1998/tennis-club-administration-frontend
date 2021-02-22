import React from 'react';

import Login from './Login';

import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";

const App = () => {
    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/login" component={Login} />
                </Switch>
            </Router>
        </div>
    );
};

export default App;