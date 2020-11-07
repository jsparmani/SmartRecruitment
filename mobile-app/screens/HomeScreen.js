/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Text, Image, FlatList, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {gql, useMutation} from '@apollo/client';
import {updateToken} from '../src/actions/dataAction';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/AntDesign';

function HomeScreen(props) {
  console.log('HomeSreen ', props.accessToken);
  const tempData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const access_mutation = gql`
    mutation RefreshToken($refreshToken: String!) {
      refreshMyToken(refreshToken: $refreshToken) {
        accessToken
        refreshToken
      }
    }
  `;

  const [updateTokenFunc, {data, error, loading}] = useMutation(
    access_mutation,
    {
      onCompleted: async (data) => {
        if (data.refreshMyToken.errors != null) {
          console.log(data.refreshMyToken.errors);
          // data.register.errors.map((val, ind) => {
          //   if (val.field == 'username/email') {
          //     setnotUnique(true);
          //     setnotUniqueMsg(val.message);
          //   }
          // });
        } else {
          console.log(data.refreshMyToken);
          // const {profile, id} = data.register.user;
          const {refreshToken, accessToken} = data.refreshMyToken;
          refreshToken != null && props.refreshToken !== refreshToken
            ? await props.updateToken(refreshToken, accessToken)
            : null;
          // props.navigation.navigate('Profile');
        }
      },
      onError: (err) => {
        console.log(err);
      },
    },
  );

  useEffect(() => {
    updateTokenFunc({
      variables: {
        refreshToken: props.refreshToken,
      },
    });
  }, []);

  return (
    <View style={{backgroundColor: '#EAEEF1', flex: 1}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: '#497AD7',
          paddingTop: 15,
          elevation: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{width: 80, height: 80, borderRadius: 80}}
            source={{uri: props.profile.photo}}
          />
          <View style={{marginLeft: 15}}>
            <Text style={{color: '#fff', fontSize: 16}}>
              Hello {props.profile.name.split(' ')[0]} ,
            </Text>
            <Text style={{color: '#fff', fontSize: 20, fontWeight: '400'}}>
              Find Your Dream Job
            </Text>
          </View>
        </View>
        <TextInputCustom
          placeholder="Search your Job"
          hasRightIcon={true}
          viewStyle={{
            backgroundColor: '#EAEEF1',
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 0,
            height: 40,
            width: '100%',
          }}
          righticonChild={
            <Icon
              name="search1"
              color="black"
              size={22}
              style={{
                marginLeft: -10,
                marginTop: 'auto',
                marginBottom: 'auto',
              }}
            />
          }
        />
      </View>
      <View style={{flex: 3.2, paddingTop: 20}}>
        <Text style={{paddingLeft: 20, fontSize: 16, letterSpacing: 0.2}}>
          POPULAR JOBS
        </Text>
        <FlatList
          style={{flex: 1}}
          data={tempData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={() => (
            <View style={styles.cardStyle}>
              <View style={styles.logoStyle}>
                <Image
                  style={{width: '100%', height: '60%'}}
                  resizeMode="contain"
                  source={{
                    uri:
                      'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png',
                  }}
                />
              </View>
              <View
                style={{
                  width: '82%',
                  paddingHorizontal: 12,
                  paddingRight: 20,
                  paddingTop: 10,
                }}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{fontSize: 16}}>
                  Software Developer Engineer
                </Text>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  style={{fontSize: 13}}>
                  Google 📍 Mumbai, IN
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                    height: 30,
                  }}>
                  <Text
                    style={{
                      color: '#358C96',
                      width: 'auto',
                      paddingHorizontal: 12,
                      textAlignVertical: 'center',
                      fontWeight: 'bold',
                    }}>
                    APPLY NOW
                  </Text>
                  <Text
                    onPress={() => {
                      props.navigation.navigate('JobDetails');
                    }}
                    style={{
                      color: '#358C96',
                      width: 'auto',
                      paddingHorizontal: 12,
                      textAlignVertical: 'center',
                      fontWeight: 'bold',
                    }}>
                    MORE...
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    profile: state.authRed.profile,
    refreshToken: state.authRed.refreshToken,
    accessToken: state.authRed.accessToken,
  };
};

export default connect(mapStateToProps, {updateToken})(HomeScreen);

const styles = StyleSheet.create({
  cardStyle: {
    width: '90%',
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  logoStyle: {
    width: '18%',
    paddingHorizontal: 5,
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#00000050',
    marginLeft: 10,
    justifyContent: 'center',
  },
});
