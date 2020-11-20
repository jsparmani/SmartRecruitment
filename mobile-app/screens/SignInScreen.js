/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  StatusBar,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native-gesture-handler';
import TextInputCustom from '../Components/TextInputCustom';
import {gql, useMutation} from '@apollo/client';
import ErrorMessage from '../Components/ErrorMessage';
import {setLoginUser} from '../src/actions/dataAction';
import {connect} from 'react-redux';

const login_mutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        role
        id
        username
        email
        profile {
          name
          age
          gender
          photo
          resume
        }
      }
      errors {
        field
        message
      }
      accessToken
      refreshToken
    }
  }
`;

function SignInScreen(props) {
  console.log(props.accessToken);

  const {width, height} = Dimensions.get('screen');
  const [visible, setVisible] = useState(false);
  // const [password, setPassword] = useState('abcdefghkl');
  // const [email, setEmail] = useState('abcdefghkl');
  const [password, setPassword] = useState('abcdefg');
  const [email, setEmail] = useState('abcdefg');
  const [isLoading, setIsLoading] = useState(false);
  const [userErr, setUserErr] = useState('');
  const [errorr, setErrorr] = useState(false);
  const [passErr, setPassErr] = useState('');

  const [loginUser, {data, error, loading}] = useMutation(login_mutation, {
    onCompleted: async (data) => {
      console.log(data);
      if (data.login.errors != null) {
        console.log(data.login.errors);
        data.login.errors.map((val, ind) => {
          if (val.field == 'username') {
            setUserErr(val.message);
          }
          if (val.field == 'password') {
            setPassErr(val.message);
          }
        });
      } else {
        var user = data.login.user;
        setIsLoading(false);
        await props.setLoginUser(
          email,
          user.User,
          user.role,
          user.profile,
          data.login.accessToken,
          data.login.refreshToken,
          data.id,
          props.navigation,
        );
      }
    },
    onError: (err) => {
      setIsLoading(false);
      console.log(err.message);
      ToastAndroid.show(err.message, ToastAndroid.SHORT);
    },
  });

  return (
    <LinearGradient
      style={{flex: 1, alignItems: 'center'}}
      // colors={['#2840c7', '#228bd6', '#24cde3']}
      colors={['#ffffff', '#ffffff']}>
      {/* <StatusBar backgroundColor="#2840c7" /> */}
      <StatusBar backgroundColor="black" />
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
        }}
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        <View
          style={{
            ...StyleSheet.absoluteFill,
            height: 250,
            // backgroundColor: 'lightblue',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: width / 1,
          }}>
          <Image
            source={require('../assets/bk2.png')}
            style={{
              height: 200,
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
            }}
            resizeMode="stretch"
          />
        </View>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            width: '100%',
          }}>
          <Image
            source={require('../assets/bk3.png')}
            style={{
              height: 150,
              width: '100%',
              alignSelf: 'center',
              marginTop: 10,
              justifyContent: 'center',
            }}
            resizeMode="stretch"
          />
          <Text
            style={{
              fontWeight: '700',
              fontSize: 20,
              marginTop: 50,
              fontFamily: 'Roboto',
            }}>
            AI RECRUITER
          </Text>
          <TextInputCustom
            keyboardType="email-address"
            autoCompleteType="email"
            hasIcon={true}
            customIcon={true}
            iconChild={<AntDesign name="user" color="black" size={30} />}
            textVal={email}
            inputHandler={(e) => {
              setEmail(e);
            }}
            placeholder="Email Id or Username"
          />
          {errorr == true && email == '' ? (
            <View style={{flex: 1, marginTop: 8, width: '100%'}}>
              <ErrorMessage msg={'Field should not be empty ! '} />
            </View>
          ) : null}
          {userErr != '' ? (
            <View style={{flex: 1, marginTop: 8, width: '100%'}}>
              <ErrorMessage msg={`Username / Email ${userErr.toLowerCase()}`} />
            </View>
          ) : null}
          <TextInputCustom
            autoCompleteType="password"
            hasIcon={true}
            hasRightIcon={true}
            secureTextEntry={!visible}
            textVal={password}
            inputHandler={(pass) => {
              setPassword(pass);
            }}
            iconName="lock"
            placeholder="Password"
            righticonChild={
              <Entypo
                name={visible ? 'eye-with-line' : 'eye'}
                color="black"
                onPress={() => {
                  setVisible(!visible);
                }}
                size={25}
                style={{
                  marginLeft: -50,
                  marginTop: 'auto',
                  marginBottom: 'auto',
                }}
              />
            }
          />
          {errorr == true && password == '' ? (
            <View style={{flex: 1, marginTop: 8, width: '100%'}}>
              <ErrorMessage msg={'Field should not be empty ! '} />
            </View>
          ) : null}
          {passErr != '' ? (
            <View style={{flex: 1, marginTop: 8, width: '100%'}}>
              <ErrorMessage msg={passErr} />
            </View>
          ) : null}
          {isLoading ? (
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
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                onPress={() => {
                  // props.navigation.navigate('ForgotPass');
                }}
                adjustsFontSizeToFit
                allowFontScaling
                style={{
                  width: '100%',
                  height: 50,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontWeight: 'bold',
                  marginTop: 20,
                  letterSpacing: 1,
                  fontSize: 15,
                }}>
                Forgot Password?
              </Text>
              {isLoading ? (
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
                    color: '#0000010',
                  }}
                  onPress={() => {
                    setIsLoading(true);
                    if (email != '' && password != '') {
                      loginUser({
                        variables: {
                          input: {
                            usernameOrEmail: email,
                            password: password,
                          },
                        },
                      });
                    } else {
                      setErrorr(true);
                      setIsLoading(false);
                    }
                  }}
                  style={{
                    width: '90%',
                    bottom: 20,
                    marginTop: 50,
                    height: 45,
                    backgroundColor: 'lightblue',
                    elevation: 5,
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
                  props.navigation.navigate('SignUp');
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
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const mapStateToProps = (state) => {
  return {
    profile: state.authRed.profile,
    accessToken: state.authRed.accessToken,
  };
};

export default connect(mapStateToProps, {setLoginUser})(SignInScreen);
