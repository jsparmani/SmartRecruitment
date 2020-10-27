/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';

const Stack = createStackNavigator();

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    return (
      <Stack.Navigator
        screenOptions={{
          animationEnabled: false,
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
      </Stack.Navigator>
    );
  }
}
// const mapStateToProps = (state) => {
//   return {
//     Members: state.details.MemberList,
//     idSignedIn: state.details.idSignedIn,
//   };
// };
// export default connect(mapStateToProps, {getMembers})(Index);
export default Index;
