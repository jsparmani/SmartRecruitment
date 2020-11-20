import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import ErrorMessage from '../Components/ErrorMessage';
import {gql, useLazyQuery, useMutation} from '@apollo/client';
import {Picker} from '@react-native-community/picker';
import {JobDetails, updateToken} from '../src/actions/dataAction';
import {connect} from 'react-redux';
import AnimatedLoader from './AnimatedLoader';

const addjob_mutation = gql`
  mutation AddJob($input: JobInput!) {
    addJob(input: $input) {
      job {
        title
        description
        requirements
        department
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

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

// function GetJobs(props) {

//   return 'done';
// }

function AddJobScreen(props) {
  const [title, setTitle] = useState('SDE Job 3rd By Google');
  const [description, setDescription] = useState(
    'This is the 3rd job I have added.',
  );
  const [reqList, setReqList] = useState(['Django', 'Python', 'Javascript']);
  const [currReq, setCurrReq] = useState('');
  const [error, setError] = useState(false);
  const [department, setDepartment] = useState('TECHNICAL');
  const [isLoading, setIsLoading] = useState(false);

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
        ToastAndroid.show('Job Added Successfully !!', ToastAndroid.LONG);
        console.log('added');
      }
    },
    onError: (err) => {
      console.log(err.message);
    },
  });

  const [addNewJob, {dat, e, load}] = useMutation(addjob_mutation, {
    onCompleted: (data) => {
      console.log(data);
      if (data.addJob.errors != null) {
      } else {
        // var arr = props.jobs;
        // arr.push(data.addJob.job);
        updateJobs();
      }
    },
    onError: async (errorr) => {
      console.log(errorr.message);
      if (errorr.message == 'TokenExpiredError: jwt expired') {
        await props.updateToken(props.refreshToken);
        addNewJob({
          variables: {
            input: {
              title: title,
              description: description,
              requirements: reqList,
              department: department,
            },
          },
        });
      }
    },
  });

  return (
    <View style={{backgroundColor: '#e6e6e6', flex: 1}}>
      <View
        style={{
          height: 80,
          backgroundColor: '#497AD7',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Icon name="left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text
          style={{
            // width: '100%',
            textAlign: 'center',
            fontSize: 20,
            textTransform: 'uppercase',
            fontWeight: 'bold',
            color: '#fff',
          }}>
          Add A New Job
        </Text>
        <TouchableOpacity
          onPress={async () => {
            console.log(reqList);
            setIsLoading(true);
            title == '' ||
            description == '' ||
            reqList.length == 0 ||
            department == null
              ? setError(true)
              : await addNewJob({
                  variables: {
                    input: {
                      title: title,
                      description: description,
                      requirements: reqList,
                      department: department,
                    },
                  },
                });
            setIsLoading(false);
          }}>
          <Icon name="save" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{flex: 1, marginTop: 12, paddingBottom: 10}}
        contentContainerStyle={{alignItems: 'center'}}>
        <Picker
          style={{width: '80%', height: 80}}
          selectedValue={department}
          onValueChange={(val) => {
            setDepartment(val);
          }}>
          <Picker.Item
            label="Select Department"
            value={null}
            color="#00000080"
          />
          <Picker.Item label="ACCOUNTING" value="ACCOUNTING" />
          <Picker.Item label="HR" value="HR" />
          <Picker.Item label="MANAGEMENT" value="MANAGEMENT" />
          <Picker.Item label="MARKETING" value="MARKETING" />
          <Picker.Item label="PROD_MANAGEMENT" value="PROD_MANAGEMENT" />
          <Picker.Item label="SALES" value="SALES" />
          <Picker.Item label="SUPPORT" value="SUPPORT" />
          <Picker.Item label="TECHNICAL" value="TECHNICAL" />
          <Picker.Item label="OTHERS" value="OTHERS" />
        </Picker>
        <TextInput
          placeholder="Title"
          value={title}
          style={{
            fontSize: 18,
            width: '80%',
            borderBottomWidth: 1,
            borderColor: '#00000080',
          }}
          onChangeText={(txt) => {
            setTitle(txt);
          }}
        />
        {error == true && title == '' ? (
          <View style={{flex: 1, marginTop: 2}}>
            <ErrorMessage msg={'Please Add Title'} />
          </View>
        ) : null}
        <Text
          style={{
            fontSize: 18,
            width: '80%',
            marginTop: 30,
            color: '#00000075',
            marginLeft: 6,
            marginBottom: 4,
          }}>
          Description
        </Text>
        <TextInput
          numberOfLines={100}
          value={description}
          multiline
          style={{
            fontSize: 18,
            width: '80%',
            backgroundColor: '#00000012',
            borderWidth: 0.05,
            height: 250,
            textAlignVertical: 'top',
            paddingLeft: 12,
          }}
          onChangeText={(txt) => {
            setDescription(txt);
          }}
        />
        {error == true && description == '' ? (
          <View style={{flex: 1, marginTop: 2}}>
            <ErrorMessage msg={'Please Add Description'} />
          </View>
        ) : null}
        <TextInputCustom
          placeholder="Requirements"
          textVal={currReq}
          viewStyle={{
            width: '80%',
            borderBottomWidth: 1,
            borderColor: '#00000080',
            paddingLeft: 5,
            alignItems: 'center',
          }}
          inputStyle={{
            fontSize: 18,
            paddingLeft: 0,
            marginLeft: 0,
          }}
          hasRightIcon={true}
          righticonChild={
            <Icon
              onPress={() => {
                var arr = reqList;
                // reqList.
                reqList.push(currReq);
                setReqList(arr);
                setCurrReq('');
              }}
              name="plussquare"
              size={25}
              color="#6b6b6b"
              style={{marginRight: 5}}
            />
          }
          inputHandler={(txt) => {
            setCurrReq(txt);
          }}
        />
        {error == true && reqList.length == 0 ? (
          <View style={{flex: 1, marginTop: 2}}>
            <ErrorMessage msg={'Please Add Requirements'} />
          </View>
        ) : null}
        <View
          //   behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: '90%',
            marginTop: 20,
          }}>
          {reqList.map((item, ind) => {
            return (
              <View
                key={`${item}${ind}`}
                style={{
                  width: 'auto',
                  flexDirection: 'row',
                  height: 35,
                  backgroundColor: '#497AD7',
                  justifyContent: 'space-between',
                  paddingHorizontal: 8,
                  paddingLeft: 12,
                  borderRadius: 16,
                  minWidth: 80,
                  marginHorizontal: 12,
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    height: '100%',
                    textAlignVertical: 'center',
                    color: '#fff',
                  }}>
                  {item}
                </Text>
                <Entypo
                  onPress={async () => {
                    console.log('deleting');
                    var arr = reqList;
                    setReqList(
                      arr.filter((item, id) => {
                        return id != ind;
                      }),
                    );
                  }}
                  name="cross"
                  size={23}
                  color="#000"
                  style={{height: '100%', textAlignVertical: 'center'}}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
      {isLoading ? (
        <View style={{...StyleSheet.absoluteFill, opacity: 0.9}}>
          <AnimatedLoader />
          <Text
            style={{
              position: 'absolute',
              zIndex: 10,
              color: '#fff',
              fontSize: 21,
              alignSelf: 'center',
              height: '100%',
              textAlignVertical: 'center',
              marginTop: 50,
            }}>
            Adding Job ...
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    jobs: state.authRed.jobs,
    refreshToken: state.authRed.refreshToken,
  };
};

export default connect(mapStateToProps, {JobDetails, updateToken})(
  AddJobScreen,
);
