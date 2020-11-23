import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import {applyMiddleware, createStore} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {Provider} from 'react-redux';

import HomePage from './Components/Home/HomePage';
import LoginPage from './Components/Login/LoginPage';
import RegisterPage from './Components/Register/RegisterPage';
import CompanyProfilePage from './Components/CompanyProfile/CompanyProfilePage';
import CandidateProfilePage from './Components/CandidateProfile/CandidateProfilePage';
import SearchPage from './Components/Search/SearchPage';
import JobDescPage from './Components/JobDescPage/JobDescPage';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  timeout: null,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

function App() {
  return(
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path='/'><HomePage/></Route>
          <Route  path='/login'><LoginPage/></Route>
          <Route  path='/register'><RegisterPage/></Route>
          <Route  path='/candidateprofile'><CandidateProfilePage/></Route>
          <Route  path='/companyprofile'><CompanyProfilePage/></Route>
          <Route  path='/search'><SearchPage/></Route>
          <Route  path='/jobdesc'><JobDescPage/></Route>
        </Switch>
      </Router>
    </Provider>
  )
}

export default App;
