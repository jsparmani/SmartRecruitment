/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from './HomeScreen';
import SignInScreen from './SignInScreen';
import ProfilePage from './ProfilePage';
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

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// Initialize Apollo Client
// const client = new ApolloClient({
//   // uri: '192.168.137.1:5000/graphql',
//   uri: 'http://10.0.2.2:5000/graphql',
//   // uri: 'http://localhost:5000/graphql',
//   cache: new InMemoryCache(),
// });

class index extends Component {
  constructor(props) {
    super(props);

    this.httpLink = createHttpLink({
      uri: 'http://10.0.2.2:5000/graphql',
    });

    this.authLink = setContext((_, {headers}) => {
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

    this.client = new ApolloClient({
      link: this.authLink.concat(this.httpLink),
      cache: new InMemoryCache(),
    });

    this.state = {
      isSignedIn: props.isSignedIn,
    };
  }

  MainScreen = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          animationEnabled: false,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    );
  };

  render() {
    console.log(
      'auth  : ',
      this.props.accessToken,
      this.props.profile,
      this.props.accessToken == '' || this.props.profile == null,
    );
    console.log(
      'Home : ',
      this.props.accessToken != '' && this.props.profile != null,
    );
    if (this.props.accessToken == '' || this.props.profile == null) {
      return (
        <ApolloProvider client={this.client}>
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
          </Stack.Navigator>
        </ApolloProvider>
      );
    } else if (this.props.accessToken != '' && this.props.profile != null) {
      return (
        <ApolloProvider client={this.client}>
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
              component={this.MainScreen}
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
}
const mapStateToProps = (state) => {
  return {
    isSignedIn: state.authRed.isSignedIn,
    profile: state.authRed.profile,
    accessToken: state.authRed.accessToken,
  };
};
export default connect(mapStateToProps, {})(index);
