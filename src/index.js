import {render} from 'inferno';
import {Provider} from "inferno-redux";
import {initDevTools} from 'inferno-devtools';
import {BrowserRouter} from 'inferno-router';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from "./store";

initDevTools();

render(
    <Provider store={store}>
        <BrowserRouter><App/></BrowserRouter>
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
