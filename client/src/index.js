import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reducer from './store/reducers';
import {unstable_HistoryRouter as HistoryRouter} from "react-router-dom";
import {createBrowserHistory} from "history";
import configureStore from './store';
import {Provider} from "react-redux";

const history = createBrowserHistory({window});

const store = configureStore(reducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <HistoryRouter history={history}>
            <App history={history} />
        </HistoryRouter>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
