/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
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

export default function SignInScreen(props) {
  const {width, height} = Dimensions.get('screen');
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
            value={email}
            inputHandler={(e) => {
              setEmail(e);
            }}
            iconName="email"
            placeholder="Email Id or Username"
          />
          <TextInputCustom
            autoCompleteType="password"
            hasIcon={true}
            hasRightIcon={true}
            secureTextEntry={!visible}
            value={password}
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
              <Pressable
                android_ripple={{
                  color: '#000',
                }}
                disabled={props.isLoading}
                onPress={async () => {
                  if (email != '' && password != '') {
                    // await this.props.setLoading(true);
                    // await this.props.signInUser(email, password);
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

// const mapStateToProps = (state) => {
//   return {
//     isLoading: state.details.isLoading,
//   };
// };

// export default connect(mapStateToProps, {signInUser, checkLogin, setLoading})(
//   SignInScreen,
// );
