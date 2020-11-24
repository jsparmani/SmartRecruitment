import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {applyMiddleware, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import rootReducer from './Redux/reducers/index';
import thunk from 'redux-thunk';
import './index.css'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'root',
  storage,
  timeout: null,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

ReactDOM.render(
  
  <Provider store={store}>
        <PersistGate persistor={persistor}>
         
           
              <App />
            
        </PersistGate>
      </Provider>,
  document.getElementById('root'),
);
