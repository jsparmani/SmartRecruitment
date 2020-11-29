import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import {gql, useLazyQuery, useMutation} from '@apollo/client';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {JobDetails, UpdateAppliedJobs} from '../src/actions/dataAction';

const job_query = gql`
  query getJobs {
    jobs {
      id
      title
      description
      requirements
      appliedCandidates {
        username
      }
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

function JobDetailsScreen(props) {
  const {details} = props.route.params;
  const loc = details.company.location.split(',');

  console.log(details.appliedCandidates, details.id);

  const [getAllAppliied, {}] = useLazyQuery(me_query, {
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

  const applyjob_mutation = gql`
    mutation ApplyJob {
      applyJob(jobId: ${details.id})
    }
  `;

  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (props.appliedJobs.includes(details.id)) {
      setApplied(true);
    }
  }, []);

  const [applyJob_now, {data, err, load}] = useMutation(applyjob_mutation, {
    onCompleted: (data) => {
      console.log('Applied : ', data);
      if (data.applyJob) {
        ToastAndroid.show('Applied for Job', ToastAndroid.LONG);
        getAllAppliied();
        props.navigation.goBack();
      }
    },
    onError: (error) => {
      console.log('Apply Error : ', error);
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
              source={{uri: details.company.admin.profile.photo}}
            />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: '#fff', fontSize: 25, fontWeight: 'bold'}}>
              {details.company.name}
            </Text>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '400'}}>
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
        <Text style={{marginTop: 25, fontSize: 16, fontWeight: 'bold'}}>
          Job Description
        </Text>
        <Text style={{marginTop: 10, fontSize: 16, textAlign: 'justify'}}>
          {details.description}
        </Text>
        <Text style={{marginTop: 25, fontSize: 16, fontWeight: 'bold'}}>
          Department
        </Text>
        <Text
          style={{
            marginTop: 10,
            fontSize: 16,
            textAlign: 'justify',
            textTransform: 'capitalize',
          }}>
          {details.department}
        </Text>
        <Text style={{marginTop: 25, fontSize: 16, fontWeight: 'bold'}}>
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
      <TouchableOpacity
        onPress={() => {
          applyJob_now();
        }}
        disabled={applied}
        style={{
          width: '100%',
          height: 40,
          backgroundColor: applied ? '#bebebe' : '#497AD7',
        }}>
        <Text
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
          {applied ? 'APPLIED' : 'Apply Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    username: state.authRed.username,
    appliedJobs: state.authRed.appliedJobs,
  };
};

export default connect(mapStateToProps, {JobDetails, UpdateAppliedJobs})(
  JobDetailsScreen,
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
    width: '18%',
    paddingHorizontal: 5,
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#00000050',
    marginLeft: 10,
    justifyContent: 'center',
  },
});
