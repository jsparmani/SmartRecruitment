/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Text, Image, FlatList, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {gql, useMutation, useQuery} from '@apollo/client';
import {
  JobDetails,
  UpdateAppliedJobs,
  updateToken,
} from '../src/actions/dataAction';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/AntDesign';

const job_query = gql`
  query getJobs {
    jobs {
      id
      title
      description
      requirements
      department
      questions
      company {
        id
        name
        location
        admin {
          profile {
            photo
            resume
          }
        }
      }
    }
  }
`;

const me_query = gql`
  query Me {
    me {
      user {
        appliedJobs {
          id
        }
      }
    }
  }
`;

function HomeScreen(props) {
  console.log('HomeSreen ', props.accessToken);

  const {data, err, load} = useQuery(job_query, {
    onCompleted: async (data) => {
      if (data.jobs != null) {
        // console.log(data.jobs);
        await props.JobDetails(data.jobs);
      }
    },
  });
  const {dataa, error, loading} = useQuery(me_query, {
    onCompleted: async (data2) => {
      if (data2.me.user != null) {
        // console.log(data2.jobs);
        var arr = props.appliedJobs;
        data2.me.user.appliedJobs.map((item) => {
          if (!arr.includes(item.id)) {
            arr.push(item.id);
          }
        });
        console.log(arr);
        await props.UpdateAppliedJobs(arr);
      }
    },
  });

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
          data={props.jobs == null ? [] : props.jobs}
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
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            var loc = item.company.location.split(',');
            var logo = item.company.admin.profile.photo;
            return (
              <View style={styles.cardStyle}>
                <View style={styles.logoStyle}>
                  <Image
                    style={{width: '100%', height: '60%'}}
                    resizeMode="contain"
                    source={{
                      uri: logo,
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
                    adjustsFontSizeToFit
                    style={{fontSize: 13}}>
                    {item.company.name} 📍 {loc[loc.length - 3]},
                    {loc[loc.length - 2]}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'flex-end',
                      marginTop: 'auto',
                      height: 30,
                    }}>
                    {/* <Text
                      style={{
                        color: '#358C96',
                        width: 'auto',
                        paddingHorizontal: 12,
                        textAlignVertical: 'center',
                        fontWeight: 'bold',
                      }}>
                      APPLY NOW
                    </Text> */}
                    <Text
                      onPress={() => {
                        props.navigation.navigate('JobDetails', {
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
            );
          }}
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
    jobs: state.authRed.jobs,
    appliedJobs: state.authRed.appliedJobs,
  };
};

export default connect(mapStateToProps, {
  updateToken,
  JobDetails,
  UpdateAppliedJobs,
})(HomeScreen);

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
