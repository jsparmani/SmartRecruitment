/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ScrollView} from 'react-native-gesture-handler';

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      username: '',
      email: '',
      password: '',
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
              marginTop: 30,
              flexDirection: 'row',
              paddingLeft: 10,
              backgroundColor: '#00000045',
            }}>
            <AntDesign
              name="user"
              color="black"
              size={30}
              style={{
                flex: 0.2,
                alignSelf: 'center',
              }}
            />
            <TextInput
              autoCompleteType="username"
              style={{flex: 1}}
              placeholder="Username"
              value={this.state.username}
              onChangeText={(username) => {
                this.setState({username});
              }}
              placeholderTextColor="#000"
            />
          </View>
          <View
            style={{
              height: 50,
              width: '90%',
              borderColor: 'black',
              marginTop: 30,
              flexDirection: 'row',
              backgroundColor: '#00000045',
              paddingLeft: 10,
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
              backgroundColor: '#00000045',
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
              secureTextEntry={this.state.visible}
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
          <TouchableOpacity
            onPress={async () => {
              var {email, password, username} = this.state;
              if (email != '' && username != '' && password != '') {
                await this.props.createUser(email, password, username);
              }
            }}
            style={{
              width: '90%',
              bottom: 20,
              marginTop: 50,
              height: 45,
              backgroundColor: 'lightblue',
              elevation: 10,
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
          </TouchableOpacity>
          <Text
            onPress={() => {
              this.props.navigation.navigate('SignIn');
            }}
            adjustsFontSizeToFit
            allowFontScaling
            style={{
              width: '90%',
              height: 60,
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
        </ScrollView>
      </LinearGradient>
    );
  }
}

// export default connect(null, {createUser})(SignUpScreen);
export default SignUpScreen;
