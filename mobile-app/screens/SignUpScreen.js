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

const register_mutation = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        email
        username
        role
        profile {
          id
          name
        }
      }
      errors {
        field
        message
      }
    }
  }
`;
export default function SignUpScreen(props) {
  const {width, height} = Dimensions.get('screen');
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('qwerty12345');
  const [email, setEmail] = useState('qwerty12345@gmail.com');
  const [role, setRole] = useState('CANDIDATE');
  const [username, setUsername] = useState('qwerty12345');
  const [isLoading, setIsLoading] = useState(false);

  const [addUser, {data, error, loading}] = useMutation(register_mutation, {
    onCompleted: (data) => {
      console.log(data.register.token);
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
          {/* {error != undefined ? (
            <Text>
              Bad:
              {error.graphQLErrors.map(({message}, i) => (
                <Text key={i}>{message}</Text>
              ))}
            </Text>
          ) : null} */}
          {loading ? (
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
                if (email != '' && password != '' && username != '') {
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
                }
                // setInterval(() => {
                //   console.log(loading, data, error);
                // }, 2000);
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
          {data ? <Text>{data.register.user.email}</Text> : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
