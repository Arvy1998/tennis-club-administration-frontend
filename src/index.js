import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import { CookiesProvider } from 'react-cookie';

document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(
        <React.StrictMode>
            <CookiesProvider>
                <App />
            </CookiesProvider>
        </React.StrictMode>,
        document.body.appendChild(document.createElement('app'))
    );
})

module.hot.accept();