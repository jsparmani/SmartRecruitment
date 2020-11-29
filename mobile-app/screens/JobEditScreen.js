import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {gql, useLazyQuery, useMutation} from '@apollo/client';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {JobDetails} from '../src/actions/dataAction';

const me_query = gql`
  query Me {
    me {
      company {
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

function JobDetailsScreen(props) {
  const [editing, setEditing] = useState(false);
  const {details} = props.route.params;
  const loc = props.companyLocation.split(',');

  const deleteMutation = gql`
    mutation DeleteJob {
      deleteJob(jobId:${details.id})
    }
  `;

  const [updateJobs, {data, err, loading}] = useLazyQuery(me_query, {
    // variables: {
    //   id: props.id,
    // },
    onCompleted: async (dataa) => {
      console.log('data : ', dataa);
      if (dataa.me != null) {
        console.log(dataa.me.company.jobs);
        await props.JobDetails(dataa.me.company.jobs);
        props.navigation.goBack();
        ToastAndroid.show('Job Deleted Successfully !!', ToastAndroid.LONG);
        console.log('added');
      }
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  const [deleteJob] = useMutation(deleteMutation, {
    onCompleted: (data) => {
      console.log(data);
      updateJobs();
    },
    onError: (err) => {
      console.log(err, details.id, props.accessToken);
      ToastAndroid.show(err.message, ToastAndroid.LONG);
    },
  });

  return (
    <View style={{backgroundColor: '#EAEEF1', flex: 1}}>
      <View
        style={{
          paddingHorizontal: 20,
          backgroundColor: '#497AD7',
          paddingVertical: 15,
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
              borderRadius: 30,
              backgroundColor: '#EAEEF199',
              padding: 5,
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="contain"
              source={{uri: props.profile.photo}}
            />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: '#fff', fontSize: 25, fontWeight: 'bold'}}>
              {props.companyName}
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '400',
                marginTop: 8,
              }}>
              📍 {loc[loc.length - 3]}, {loc[loc.length - 2]}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView style={{flex: 3.2, paddingTop: 20, paddingHorizontal: 20}}>
        <Text
          style={{
            fontSize: 20,
            letterSpacing: 0.1,
            textDecorationLine: 'underline',
            fontWeight: 'bold',
          }}>
          {details.title}
        </Text>
        <Text style={{marginTop: 25, fontSize: 17, fontWeight: 'bold'}}>
          Department
        </Text>
        <Text style={{marginTop: 10, fontSize: 16, textAlign: 'justify'}}>
          {details.department}
        </Text>
        <Text style={{marginTop: 25, fontSize: 17, fontWeight: 'bold'}}>
          Job Description
        </Text>
        <Text style={{marginTop: 10, fontSize: 16, textAlign: 'justify'}}>
          {details.description}
        </Text>
        <Text style={{marginTop: 25, fontSize: 17, fontWeight: 'bold'}}>
          Requirements :
        </Text>
        {details.requirements.map((item, ind) => {
          return (
            <Text
              key={`${item}${ind}`}
              style={{marginTop: 10, fontSize: 16, textAlign: 'justify'}}>
              {ind + 1}. {item}
            </Text>
          );
        })}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'red',
          height: 40,
          width: '100%',
          // justifyContent: 'space-between',
        }}>
        <View style={{width: '50%'}}>
          <TouchableOpacity style={{width: '100%', backgroundColor: '#27A102'}}>
            {/* <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              allowFontScaling
              style={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 20,
                paddingVertical: 5,
                color: '#fff',
                fontWeight: 'bold',
              }}>
              EDIT
            </Text> */}
            <Icon2
              name="edit"
              style={{
                backgroundColor: 'transparent',
                alignSelf: 'center',
                height: '100%',
              }}
              color="#fff"
              size={35}
            />
          </TouchableOpacity>
        </View>
        <View style={{width: '50%'}}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Delete Job',
                'Are you sure you want to delete this job',
                [
                  {text: 'Cancel', style: 'cancel'},
                  {
                    text: 'Delete',
                    onPress: () => {
                      deleteJob();
                    },
                  },
                ],
              );
            }}
            style={{width: '100%', backgroundColor: '#D61A3C'}}>
            <Icon
              name="delete"
              style={{
                backgroundColor: 'transparent',
                alignSelf: 'center',
                height: '100%',
              }}
              color="#fff"
              size={35}
            />
            {/* <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              allowFontScaling
              style={{
                width: '100%',
                height: '100%',
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 20,
                paddingVertical: 5,
                color: '#fff',
                fontWeight: 'bold',
              }}>
              Delete
            </Text> */}
          </TouchableOpacity>
        </View>
      </View>
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

export default connect(mapStateToProps, {JobDetails})(JobDetailsScreen);

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
