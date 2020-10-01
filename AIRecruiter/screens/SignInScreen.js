/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StatusBar,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      password: '',
      email: '',
      isLoading: false,
    };
  }

  render() {
    return (
      <LinearGradient
        style={{flex: 1, alignItems: 'center'}}
        colors={['#2840c7', '#228bd6', '#24cde3']}>
        <StatusBar backgroundColor="#2840c7" />
        <ScrollView
          style={{
            flex: 1,
            width: '100%',
          }}
          contentContainerStyle={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontWeight: '700',
              fontSize: 20,
              fontStyle: 'Roboto',
            }}>
            AI RECRUITER
          </Text>
          <Image
            resizeMode="contain"
            style={{
              height: 180,
              marginVertical: 20,
              width: '90%',
              alignSelf: 'center',
              justifyContent: 'center',
              borderRadius: 20,
            }}
            source={require('../assets/logo.png')}
          />
          <View
            style={{
              height: 50,
              width: '90%',
              borderColor: 'black',
              flexDirection: 'row',
              paddingLeft: 10,
              backgroundColor: '#00000030',
            }}>
            <MaterialCommunityIcons
              name="email"
              color="black"
              size={30}
              style={{
                flex: 0.2,
                alignSelf: 'center',
              }}
            />
            <TextInput
              keyboardType="email-address"
              autoCompleteType="email"
              style={{flex: 1}}
              placeholder="Email Id"
              placeholderTextColor="#000"
              value={this.state.email}
              onChangeText={(email) => {
                this.setState({email});
              }}
            />
          </View>
          <View
            style={{
              height: 50,
              width: '90%',
              borderColor: 'black',
              marginTop: 30,
              flexDirection: 'row',
              paddingLeft: 10,
              backgroundColor: '#00000030',
            }}>
            <MaterialCommunityIcons
              name="lock"
              color="black"
              size={30}
              style={{
                flex: 0.2,
                alignSelf: 'center',
              }}
            />
            <TextInput
              autoCompleteType="password"
              style={{flex: 1}}
              placeholder="Password"
              secureTextEntry={!this.state.visible}
              placeholderTextColor="#000"
              value={this.state.password}
              onChangeText={(password) => {
                this.setState({password});
              }}
            />
            <Entypo
              name={this.state.visible ? 'eye-with-line' : 'eye'}
              color="black"
              onPress={() => {
                this.setState({
                  visible: !this.state.visible,
                });
              }}
              size={25}
              style={{
                flex: 0.2,
                alignSelf: 'center',
                justifyContent: 'flex-end',
              }}
            />
          </View>
          <Text
            onPress={() => {
              this.props.navigation.navigate('ForgotPass');
            }}
            adjustsFontSizeToFit
            allowFontScaling
            style={{
              width: '100%',
              height: 50,
              textAlign: 'center',
              textAlignVertical: 'center',
              fontWeight: 'bold',
            }}>
            Forgot Password?
          </Text>
          {this.state.isLoading ? (
            <ActivityIndicator
              style={{
                alignSelf: 'center',
                width: '90%',
                bottom: 20,
                marginTop: 50,
                height: 45,
              }}
              color="black"
            />
          ) : (
            <Pressable
              android_ripple={{
                color: '#000',
              }}
              disabled={this.props.isLoading}
              onPress={async () => {
                var {email, password} = this.state;
                if (email != '' && password != '') {
                  await this.props.setLoading(true);
                  await this.props.signInUser(email, password);
                }
              }}
              style={{
                width: '90%',
                bottom: 20,
                marginTop: 50,
                height: 45,
                backgroundColor: 'lightblue',
                elevation: 10,
                justifyContent: 'center',
              }}>
              <Text
                adjustsFontSizeToFit
                allowFontScaling
                style={{
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontWeight: 'bold',
                }}>
                Sign In
              </Text>
            </Pressable>
          )}
          <Text
            onPress={() => {
              this.props.navigation.navigate('SignUp');
            }}
            adjustsFontSizeToFit
            allowFontScaling
            style={{
              width: '100%',
              height: 50,
              textAlign: 'center',
              textAlignVertical: 'center',
              fontWeight: 'bold',
            }}>
            Not Registered ? Click Here to{' '}
            <Text style={{color: 'darkblue'}}>Sign Up.</Text>
          </Text>
        </ScrollView>
      </LinearGradient>
    );
  }
}

// const mapStateToProps = (state) => {
//   return {
//     isLoading: state.details.isLoading,
//   };
// };

// export default connect(mapStateToProps, {signInUser, checkLogin, setLoading})(
//   SignInScreen,
// );

export default SignInScreen;
