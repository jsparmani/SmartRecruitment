import React from 'react';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';
import HomePage from './Components/Home/HomePage';
import LoginPage from './Components/Login/LoginPage';
import RegisterPage from './Components/Register/RegisterPage';

import CompanyProfilePage from './Components/CompanyProfile/CompanyProfilePage';
import CandidateProfilePage from './Components/CandidateProfile/CandidateProfilePage';
import SearchPage from './Components/Search/SearchPage';
import JobDescPage from './Components/JobDescPage/JobDescPage';
function App() {
  return(
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
  )
}

export default App;
