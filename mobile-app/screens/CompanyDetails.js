/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  FlatList,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ErrorMessage from '../Components/ErrorMessage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackActions} from '@react-navigation/native';
import {gql, useMutation} from '@apollo/client';
import {connect} from 'react-redux';
import {UpdateProfile, updateToken} from '../src/actions/dataAction';
import AnimatedLoader from './AnimatedLoader';
import axios from 'axios';
import qs from 'qs';
import Entypo from 'react-native-vector-icons/Entypo';
// import Geolocation from '@react-native-community/geolocation';
// import GetLocation from 'react-native-get-location';

const {width, height} = Dimensions.get('screen');

function backButtonHandler() {
  ToastAndroid.show('First Complete Profile', ToastAndroid.SHORT);
  return true;
}

const profile_mutation = gql`
  mutation RegisterCompany($input: CompanyInput!) {
    registerCompany(input: $input) {
      company {
        name
        admin {
          username
        }
        location
      }
      errors {
        field
        message
      }
    }
  }
`;

function CompanyDetails(props) {
  // const [CompanyName, setCompanyName] = useState('');
  // const [Location, setLocation] = useState('');
  // const [age, setAge] = useState(null);
  // const [gender, setGender] = useState(null);
  // const [fileData, setfileData] = useState(null);
  // const [image, setImage] = useState(null);
  // const [error, setError] = useState(false);
  // const [orientation, setOrientation] = useState('Portrait');

  const [CompanyName, setCompanyName] = useState('Google Inc.');
  const [Location, setLocation] = useState('');
  //   const [Location, setLocation] = useState('Mumbai , India');
  const [locToken, setLocToken] = useState('');
  const [Searches, setSearches] = useState(null);
  const [Searching, setSearching] = useState(false);
  const [curLoc, setcurLoc] = useState('');
  const [gender, setGender] = useState('MALE');
  const [age, setage] = useState('10');
  const [fileData, setfileData] = useState(null);
  const [image, setImage] = useState(null);
  const [ImageUrl, setImageUrl] = useState('');
  const [FileUrl, setFileUrl] = useState('');
  const [error, setError] = useState(false);
  const [orientation, setOrientation] = useState('Portrait');
  const [ageError, setAgeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [profileUpdate, {dataa, errorr, loading}] = useMutation(
    profile_mutation,
    {
      onCompleted: async (data) => {
        console.log(data);
        if (data.createOrUpdateProfile.errors != null) {
          console.log(data.createOrUpdateProfile.errors);
        } else {
          const {profile} = data.createOrUpdateProfile;

          await props.UpdateProfile(profile);
        }
        setIsLoading(false);
      },
      onError: async (err) => {
        console.log(err);
        if (err.message == 'Not authenticated') {
          await props.updateToken(props.refreshToken);
          uploadProfile();
          setIsLoading(false);
        }
        setIsLoading(false);
      },
    },
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backButtonHandler,
    );

    requestLocationPermission();

    var data = qs.stringify({
      grant_type: 'client_credentials',
      client_id:
        'l5IKLsoGiTws7Jvnb0i0pkKX8QXqZK4VeGQ7ZTeTrQyv9YkVpie6OkwAQk3dATEAKWUjgGCrQcjwIaV_qy7tDg==',
      client_secret:
        'QJcH6ymTGazCmXuyNR8G28x1SZoCHFliH_GImWPMKdGxVPofw0C3CiSnXbsH83aglqlAsQu4G-8y8c2lIiMk76GJBC57cKCp',
    });
    var config = {
      method: 'post',
      url: 'https://outpost.mapmyindia.com/api/security/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };
    axios(config)
      .then((response) => {
        console.log(response.data);
        setLocToken(
          `${response.data.token_type} ${response.data.access_token}`,
        );
      })
      .catch((err) => {
        console.log(err);
      });
    return () => backHandler.remove();

    // return () => {
    //   BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    // };
  }, []);

  const SaveProfile = () => {
    console.log('adding', image.type);
    let img = {
      uri: image.uri,
      type: image.type,
      name: `${CompanyName}_${Location}.${image.uri.split('.')[1]}`,
    };
    console.log(fileData);
    let resume = {
      uri: fileData.uri,
      type: 'image/jpg',
      name: `${CompanyName}_${Location}_resume.jpg`,
    };

    const data = new FormData();
    data.append('file', img);
    data.append('upload_preset', 'user_profile');
    data.append('cloud_name', 'ai-recruitment');
    const data2 = new FormData();
    data2.append('file', resume);
    data2.append('upload_preset', 'user_resume');
    data2.append('cloud_name', 'ai-recruitment');

    fetch('https://api.cloudinary.com/v1_1/ai-recruitment/image/upload', {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => res.json())
      .then((val) => {
        var photo = image;
        photo.uri = val.secure_url;
        setImage(photo);
        console.log('added', ' ', val);
        setImageUrl(val.secure_url);
        fetch('https://api.cloudinary.com/v1_1/ai-recruitment/image/upload', {
          method: 'post',
          body: data2,
        })
          .then((res2) => res2.json())
          .then((val2) => {
            console.log('added file', ' ', val2);
            setFileUrl(val2.secure_url);
            uploadProfile();
          })
          .catch((err) => {
            Alert.alert('An Error Occured While Uploading : ', err);
          });
      })
      .catch((err) => {
        Alert.alert('An Error Occured While Uploading : ', err);
      });
  };

  const uploadProfile = () => {
    profileUpdate({
      variables: {
        input: {
          name: `${CompanyName} ${Location}`,
          age: parseInt(age, 10),
          gender: gender,
          photo: ImageUrl,
          resume: FileUrl,
        },
      },
    });
  };
  const isLandscape = () => {
    const dim = Dimensions.get('window');
    return dim.width >= dim.height;
  };

  const isPortrait = () => {
    const dim = Dimensions.get('window');
    return dim.height >= dim.width;
  };

  const locSearch = (txt) => {
    var query = txt.split(' ').join('+');
    var url =
      curLoc == ''
        ? `https://atlas.mapmyindia.com/api/places/search/json?query=${query}`
        : `https://atlas.mapmyindia.com/api/places/search/json?query=${query},location=${curLoc}`;
    axios
      .get(url, {
        headers: {
          Authorization: locToken,
        },
      })
      .then((res) => {
        setSearches(res.data.suggestedLocations);
        // console.log(res.data.suggestedLocations);
      })
      .catch((err) => {
        console.log('error', err);
      });
  };

  Dimensions.addEventListener('change', () => {
    // orientation has changed, check if it is portrait or landscape here
    console.log(isPortrait());
    console.log(isLandscape());
    isPortrait() ? console.log('Portrait') : console.log('Ladscape');
    isPortrait() ? setOrientation('Portrait') : setOrientation('Landscape');
  });

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      scrollEnabled={orientation == 'Portrait' ? false : true}
      enableResetScrollToCoords={true}
      enableAutomaticScroll={true}
      resetScrollToCoords={{x: -100, y: -100}}
      style={{
        backgroundColor: '#ADD8E6',
        flex: 1,
        height: '100%',
        paddingHorizontal: 8,
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <TouchableOpacity
          activeOpacity={0.4}
          onPress={() => {
            props.navigation.dispatch(StackActions.popToTop());
            console.log('done');
          }}
          style={{marginLeft: 12, borderRadius: 12, zIndex: 1}}>
          <Icon style={{zIndex: 2}} name="chevron-left" size={35} />
        </TouchableOpacity>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 25,
            letterSpacing: 1,
            position: 'absolute',
            zIndex: 0,
            marginLeft: 15,
          }}>
          Add Company Details
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: 20,
          marginTop: 90,
          paddingBottom: 50,
        }}>
        <View
          style={{
            justifyContent: 'space-around',
            height: 'auto',
            width: '100%',
            alignSelf: 'center',
            borderRadius: 40,
          }}>
          {/* {error == true && image == null ? (
            <View
              style={{
                flex: 1,
                marginTop: 2,
                alignSelf: 'center',
                width: 'auto',
              }}>
              <ErrorMessage msg={'Please Upload Profile Pic'} />
            </View>
          ) : null} */}
          <TextInputCustom
            hasIcon={true}
            iconName="office-building"
            textVal={CompanyName}
            inputHandler={(txt) => {
              setCompanyName(txt);
            }}
            placeholder="FIRST NAME"
            viewStyle={{paddingLeft: 0, width: '85%', alignSelf: 'center'}}
            inputStyle={{fontSize: 16, marginLeft: 5}}
          />
          {error == true && (CompanyName == '' || Location == '') ? (
            <View style={{flex: 1, marginTop: 2}}>
              <ErrorMessage msg={'Enter Full Name'} />
            </View>
          ) : null}
          <View>
            <TextInputCustom
              hasIcon={true}
              customIcon={true}
              iconChild={<Entypo name="location-pin" size={25} color="red" />}
              textVal={Location}
              inputHandler={(txt) => {
                setLocation(txt);
                locSearch(txt);
              }}
              placeholder="Location"
              viewStyle={{
                paddingLeft: 0,
                width: '85%',
                borderColor: '#3B3B3B',
                alignSelf: 'center',
              }}
              inputStyle={{fontSize: 16, marginLeft: 5}}
            />
            {error == true && (age == null || parseInt(age, 10) < 0) ? (
              <View style={{flex: 1, marginTop: 2}}>
                <ErrorMessage msg={'Please enter valid Location'} />
              </View>
            ) : null}
          </View>
          {Searches != null || Searches != [] ? (
            <FlatList
              data={Searches}
              style={{
                height: 'auto',
                maxHeight: 200,
                width: '85%',
                alignSelf: 'center',
                marginTop: 5,
                paddingBottom: 5,
              }}
              // ListEmptyComponent={null}
              renderItem={({item, ind}) => {
                console.log(item);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setLocation(item.placeAddress);
                      setSearches(null);
                    }}
                    style={{
                      height: 'auto',
                      maxHeight: 80,
                      marginVertical: 5,
                      backgroundColor: '#51515120',
                      paddingLeft: 10,
                      paddingVertical: 5,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      borderRadius: 15,
                    }}>
                    {/* <Text
                      style={{fontSize: 15, width: '100%', fontWeight: 'bold'}}>
                      {item.placeName}
                    </Text> */}
                    <Text
                      style={{
                        fontSize: 15,
                        width: '10%',
                        fontWeight: 'bold',
                        height: '100%',
                        textAlignVertical: 'center',
                      }}>
                      📌
                    </Text>
                    <Text
                      style={{
                        width: '90%',
                        height: '100%',
                        color: 'black',
                        fontSize: 13,
                        marginTop: 5,
                        fontWeight: 'bold',
                      }}>
                      {item.placeAddress}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          ) : null}

          <TouchableOpacity
            onPress={() => {
              setIsLoading(true);
              image == null ||
              CompanyName == '' ||
              Location == '' ||
              age == null ||
              gender == null ||
              fileData == null
                ? setError(true)
                : uploadProfile();
            }}
            style={styles.savebtn}>
            <Text
              adjustsFontSizeToFit
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                width: '100%',
                textAlign: 'center',
              }}>
              SAVE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 10,
            opacity: 0.5,
            flex: 1,
          }}>
          <AnimatedLoader />
        </View>
      ) : null}
    </KeyboardAwareScrollView>
  );
}
const mapStateToProps = (state) => {
  return {
    id: state.authRed.id,
    refreshToken: state.authRed.refreshToken,
  };
};

export default connect(mapStateToProps, {UpdateProfile, updateToken})(
  CompanyDetails,
);

const styles = StyleSheet.create({
  imgStyle: {
    width: 120,
    height: 120,
    backgroundColor: '#fff',
    alignSelf: 'center',
    zIndex: 3,
    borderRadius: 20,
    padding: 5,
    elevation: 5,
    overflow: 'hidden',
    position: 'absolute',
    top: -60,
  },
  pickerStyle: {
    paddingLeft: 0,
    width: '85%',
    alignSelf: 'center',
    borderColor: '#3B3B3B',
    borderBottomWidth: 1.5,
    marginTop: 20,
  },
  resHeaderStyle: {
    width: '85%',
    alignSelf: 'center',
    marginTop: 30,
    paddingLeft: 10,
    fontSize: 16,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  fileStyle: {
    marginHorizontal: '12%',
    alignSelf: 'center',
    height: 50,
    borderWidth: 0.8,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  savebtn: {
    width: '80%',
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: '#45656550',
    height: 35,
    marginTop: 30,
  },
});
