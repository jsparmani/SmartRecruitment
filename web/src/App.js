import React ,{useEffect}from 'react';
import {BrowserRouter as Router,Switch,Route  ,Redirect,
} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {updateToken} from './Redux/actions/dataAction';
import ErrorPage from './Components/errorPage'
import HomePage from './Components/Home/HomePage';
import LoginPage from './Components/Login/LoginPage';
import RegisterPage from './Components/Register/RegisterPage';
import CompanyProfilePage from './Components/CompanyProfile/CompanyProfilePage';
import CandidateProfilePage from './Components/CandidateProfile/CandidateProfilePage';
import SearchPage from './Components/Search/SearchPage';
import JobDescPage from './Components/JobDescPage/JobDescPage';



function App(props) {

  const httpLink = createHttpLink({
    
    uri: 'http://localhost:5000/graphql',
  });


  useEffect(() => {
    props.updateToken(props.refreshToken);
  }, []);



  const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization:
          props.accessToken != '' ? `Bearer ${props.accessToken}` : '',
      },
    };
  });

  const defaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    mutation: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  };

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
  });


  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  if (props.accessToken == '' || props.profile == null) {
    <Redirect to='/login'/>
  return(
    <ApolloProvider client={client}>
        <Router>
          <Switch>
            <Route exact path='/'><HomePage/></Route>
            <Route  path='/login'><LoginPage/></Route>
            <Route  path='/register'><RegisterPage/></Route>
            <Route  path='/candidateprofile'><CandidateProfilePage/></Route>
            <Route  path='/companyprofile'><CompanyProfilePage/></Route>
            <Route component={ErrorPage}/>
          </Switch>
        </Router>
    </ApolloProvider>
  )}

  else if (props.accessToken != '' && props.profile != null) {

    return(
      <ApolloProvider client={client}>
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
      </ApolloProvider>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    isSignedIn: state.authRed.isSignedIn,
    profile: state.authRed.profile,
    accessToken: state.authRed.accessToken,
    id: state.authRed.id,
    role: state.authRed.role,
    refreshToken: state.authRed.refreshToken,
  };
};
export default connect(mapStateToProps, {updateToken})(App);
