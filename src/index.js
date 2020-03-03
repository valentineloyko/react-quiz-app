import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
//here, after installing 'yarn add react-router-dom', we wrapp the <App/> component in hoc <BrowserRouter>
// and put it in the const 'app' to be rendered in index.js
import {BrowserRouter} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import {createStore, compose, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './store/reducers/rootReducer'
import thunk from 'redux-thunk'


const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
	}) : compose;
	

const store = createStore(
	rootReducer,
	composeEnhancers(
		applyMiddleware(thunk)
	)
)

const app = (
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
