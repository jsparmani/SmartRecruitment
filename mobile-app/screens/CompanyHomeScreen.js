import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {gql, useMutation, useQuery} from '@apollo/client';
import {CompanyDetail, updateToken} from '../src/actions/dataAction';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/AntDesign';

const me_query = gql`
  query Me {
    me {
      company {
        name
        id
        location
        jobs {
          title
          description
          requirements
          department
          id
          appliedCandidates {
            username
            id
            responses {
              answer
            }
          }
          questions
        }
      }
    }
  }
`;

function CompanyHomeScreen(props) {
  console.log('HomeSreen ', props.accessToken);
  const tempData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const [CompanyDetails, setCompanyDetails] = useState(null);

  const {data, error, loading} = useQuery(me_query, {
    // variables: {
    //   id: props.id,
    // },
    onCompleted: (dataa) => {
      console.log('data : ', dataa);
      if (dataa.me != null) {
        // setCompanyDetails(dataa.me.company);
        props.CompanyDetail(dataa.me.company);
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  // console.log(data, loading, error);
  // console.log(CompanyDetails.jobs);

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
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 200,
              overflow: 'hidden',
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 20,
            }}>
            <Image
              style={{width: '95%', height: '95%'}}
              source={{uri: props.profile.photo}}
            />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '200'}}>
              Hello {props.companyName}
            </Text>
            <Text style={{color: '#fff', fontSize: 18, fontWeight: '400'}}>
              Lets Create More Jobs !!
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
        <Text
          style={{
            paddingLeft: 30,
            fontSize: 17,
            fontWeight: '800',
            letterSpacing: 0.2,
            textDecorationLine: 'underline',
          }}>
          Jobs You added
        </Text>
        {props.jobs != null ? (
          <FlatList
            style={{flex: 1, marginTop: 5}}
            contentContainerStyle={{paddingBottom: 58}}
            data={props.jobs}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <Image
                    source={require('../assets/nodatafound.png')}
                    style={{width: '100%', height: 200}}
                    resizeMode="contain"
                  />
                </View>
              );
            }}
            renderItem={({item, index}) => (
              <View style={styles.cardStyle}>
                <View style={styles.logoStyle}>
                  <Image
                    style={{width: '100%', height: '60%'}}
                    resizeMode="contain"
                    source={{
                      uri: props.profile.photo,
                      // 'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png',
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
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    // adjustsFontSizeToFit
                    style={{fontSize: 13, marginTop: 10, paddingRight: 10}}>
                    {item.description}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'flex-end',
                      marginTop: 'auto',
                      height: 30,
                    }}>
                    <Text
                      onPress={() => {
                        props.navigation.navigate('JobEdits', {
                          details: item,
                        });
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
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              height: '100%',
            }}>
            <Image
              source={require('../assets/nodatafound.png')}
              style={{width: '100%', height: 200}}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => {
          props.navigation.navigate('AddJob');
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 50,
          backgroundColor: '#497AD7',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          zIndex: 10,
          elevation: 10,
          bottom: 5,
          alignSelf: 'center',
        }}>
        <Icon name="plus" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    profile: state.authRed.profile,
    id: state.authRed.id,
    refreshToken: state.authRed.refreshToken,
    jobs: state.authRed.jobs,
    accessToken: state.authRed.accessToken,
    companyName: state.authRed.companyName,
    companyLocation: state.authRed.companyLocation,
  };
};

export default connect(mapStateToProps, {updateToken, CompanyDetail})(
  CompanyHomeScreen,
);

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
    width: '16%',
    paddingHorizontal: 5,
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#00000050',
    marginLeft: 10,
    justifyContent: 'center',
  },
});
