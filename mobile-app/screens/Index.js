/* eslint-disable react-native/no-inline-styles */
import React, {Component, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from './HomeScreen';
import JobDetailsScreen from './JobDeatilsScreen';
import SignInScreen from './SignInScreen';
import ProfilePage from './ProfilePage';
import CompanyDetails from './CompanyDetails';
import SignUpScreen from './SignUpScreen';
import {connect} from 'react-redux';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import SettingsScreen from './SettingsScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import JobsProfilePage from './JobsProfilePage';
import CompanyHomeScreen from './CompanyHomeScreen';
import {updateToken} from '../src/actions/dataAction';
import AddJobScreen from './AddJobScreen';
import JobEditScreen from './JobEditScreen';

function Index(props) {
  const Stack = createStackNavigator();
  const Tab = createMaterialBottomTabNavigator();

  const httpLink = createHttpLink({
    // uri: 'http://10.0.2.2:5000/graphql',
    uri: 'http://192.168.137.1:5000/graphql',
    // uri: 'http://192.168.0.105:5000/graphql',
    // uri: 'http://localhost:5000/graphql',
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

  const CanditateMainScreen = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          animationEnabled: true,
          animationTypeForReplace: 'push',
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
          options={{
            headerShown: false,
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
        />
      </Stack.Navigator>
    );
  };

  const CompanyMainScreen = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          animationEnabled: true,
          animationTypeForReplace: 'push',
        }}>
        <Stack.Screen
          name="Home"
          component={CompanyHomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="JobEdits"
          component={JobEditScreen}
          options={{
            headerShown: false,
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
        />
        <Stack.Screen
          name="AddJob"
          component={AddJobScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  if (props.accessToken == '' || props.profile == null) {
    return (
      <ApolloProvider client={client}>
        <Stack.Navigator
          screenOptions={{
            animationEnabled: true,
          }}>
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={SignInScreen}
            name="SignIn"
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={SignUpScreen}
            name="SignUp"
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={ProfilePage}
            name="Profile"
          />
          <Stack.Screen
            options={{
              headerShown: false,
            }}
            component={JobsProfilePage}
            name="JobProfile"
          />
        </Stack.Navigator>
      </ApolloProvider>
    );
  } else if (props.accessToken != '' && props.profile != null) {
    // props.updateToken(props.refreshToken);
    // console.log('Acess Token : ', props.accessToken);
    // console.log('Acess Token : ', props.accessToken);
    return (
      <ApolloProvider client={client}>
        <Tab.Navigator
          shifting
          sceneAnimationEnabled={false}
          activeColor="#0A84FF"
          inactiveColor="#efefef"
          barStyle={{backgroundColor: '#27292d'}}>
          <Tab.Screen
            options={{
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
            listeners={({navigation, route}) =>
              navigation.addListener('tabPress', async () => {
                navigation.navigate('Home', 'Home');
              })
            }
            name="Home"
            component={
              props.role == 'CANDIDATE'
                ? CanditateMainScreen
                : CompanyMainScreen
            }
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({color}) => (
                <MaterialIcons name="person" color={color} size={26} />
              ),
            }}
            name="Profile2"
            component={JobsProfilePage}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({color}) => (
                <MaterialIcons name="settings" color={color} size={26} />
              ),
            }}
            name="Setting"
            component={SettingsScreen}
          />
        </Tab.Navigator>
      </ApolloProvider>
    );
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
export default connect(mapStateToProps, {updateToken})(Index);
