/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  Image,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {ScrollView} from 'react-native-gesture-handler';
import TextInputCustom from '../Components/TextInputCustom';
import {gql, useMutation} from '@apollo/client';
import RadioButton from '../Components/RadioButton';
import ErrorMessage from '../Components/ErrorMessage';
import {setUser} from '../src/actions/dataAction';
import {connect} from 'react-redux';
import * as Animatable from 'react-native-animatable';

const register_mutation = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        email
        username
        role
        id
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
function SignUpScreen(props) {
  const {width, height} = Dimensions.get('screen');
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('abcdefghk');
  const [email, setEmail] = useState('abcdefghk@gmail.com');
  const [role, setRole] = useState('COMPANY');
  const [username, setUsername] = useState('abcdefghk');
  // const [password, setPassword] = useState('abcdefg');
  // const [email, setEmail] = useState('abcdefg@gmail.com');
  // const [role, setRole] = useState('CANDIDATE');
  // const [username, setUsername] = useState('abcdefg');
  const [location, setlocation] = useState('');
  const [errorr, setErrorr] = useState(false);
  const [notUnique, setnotUnique] = useState(false);
  const [notUniqueMsg, setnotUniqueMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [addUser, {data, error, loading}] = useMutation(register_mutation, {
    onCompleted: async (data) => {
      if (data.register.errors != null) {
        data.register.errors.map((val, ind) => {
          if (val.field == 'username/email') {
            setnotUnique(true);
            setnotUniqueMsg(val.message);
          }
        });
      } else {
        const {profile, id} = data.register.user;
        const {accessToken, refreshToken} = data.register;
        console.log(data.register.user);
        await props.setUser(
          email,
          username,
          role,
          profile,
          id,
          accessToken,
          refreshToken,
        );

        role == 'CANDIDATE'
          ? props.navigation.navigate('Profile')
          : props.navigation.navigate('JobProfile');
      }
      setIsLoading(false);
    },
  });

  return (
    <LinearGradient
      style={{flex: 1, alignItems: 'center'}}
      colors={['#ffffff', '#ffffff']}>
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
              height: 160,
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
          <Animatable.View animation="zoomInUp">
            <TextInputCustom
              autoCompleteType="username"
              hasIcon={true}
              customIcon={true}
              iconChild={<AntDesign name="user" color="black" size={30} />}
              textVal={username}
              inputHandler={(name) => {
                setUsername(name);
              }}
              placeholder="Username"
            />
            {errorr == true && username.length < 5 ? (
              <View style={{flex: 1, marginTop: 8, width: '100%'}}>
                <ErrorMessage msg={'Username must be atleast 5 characters'} />
              </View>
            ) : null}
            {notUnique == true ? (
              <View style={{flex: 1, marginTop: 8, width: '100%'}}>
                <ErrorMessage msg={notUniqueMsg} />
              </View>
            ) : null}
            <TextInputCustom
              keyboardType="email-address"
              autoCompleteType="email"
              hasIcon={true}
              textVal={email}
              inputHandler={(e) => {
                setEmail(e);
              }}
              iconName="email"
              placeholder="Email Id"
            />
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
            {errorr == true && password.length <= 6 ? (
              <View style={{flex: 1, marginTop: 8, width: '100%'}}>
                <ErrorMessage msg={'Password length must be greater than 6'} />
              </View>
            ) : null}
          </Animatable.View>
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: 10,
            }}>
            <RadioButton
              textVal="COMPANY"
              selected={role == 'COMPANY' ? true : false}
              outerStyle={{
                marginTop: 20,
                justifyContent: 'center',
              }}
              onPress={() => {
                setRole('COMPANY');
              }}
            />
            <RadioButton
              textVal="CANDIDATE"
              selected={role == 'CANDIDATE' ? true : false}
              outerStyle={{
                marginTop: 20,
                justifyContent: 'center',
              }}
              onPress={() => {
                setRole('CANDIDATE');
              }}
            />
          </View>
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
                if (
                  email != '' &&
                  password != '' &&
                  username != '' &&
                  username.length > 4 &&
                  password.length >= 7
                ) {
                  addUser({
                    variables: {
                      input: {
                        username: username,
                        email: email,
                        password: password,
                        role: role,
                      },
                    },
                  });
                } else {
                  setErrorr(true);
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
                Sign Up
              </Text>
            </Pressable>
          )}
          <Text
            onPress={() => {
              props.navigation.navigate('SignIn');
            }}
            adjustsFontSizeToFit
            allowFontScaling
            numberOfLines={2}
            style={{
              width: '93%',
              marginTop: 10,
              fontSize: 13,
              textAlign: 'center',
              textAlignVertical: 'center',
              fontWeight: 'bold',
              fontFamily: 'monospace',
            }}>
            Already Registered ? Click Here to{' '}
            <Text style={{color: 'darkblue'}}>Sign In.</Text>
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default connect(null, {setUser})(SignUpScreen);
