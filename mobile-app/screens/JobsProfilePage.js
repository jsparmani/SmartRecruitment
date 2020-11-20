/* eslint-disable react-native/no-inline-styles */
import {Picker} from '@react-native-community/picker';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  FlatList,
  Alert,
  ToastAndroid,
  BackHandler,
  SafeAreaView,
  LogBox,
} from 'react-native';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';
import ErrorMessage from '../Components/ErrorMessage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackActions} from '@react-navigation/native';
import {gql, useMutation} from '@apollo/client';
import {connect} from 'react-redux';
import {UpdateJobProfile, updateToken} from '../src/actions/dataAction';
import axios from 'axios';
import qs from 'qs';
import Entypo from 'react-native-vector-icons/Entypo';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import Geolocation from '@react-native-community/geolocation';

function backButtonHandler() {
  ToastAndroid.show('First Complete Profile', ToastAndroid.SHORT);
  return true;
}

const profile_mutation = gql`
  mutation CreateUpdateProfile($input: ProfileInput!) {
    createOrUpdateProfile(input: $input) {
      profile {
        age
        name
        gender
        photo
        resume
      }
      errors {
        field
        message
      }
    }
  }
`;

const company_mutation = gql`
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

function JobsProfilePage(props) {
  // const [frstName, setFrstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [age, setAge] = useState(null);
  // const [gender, setGender] = useState(null);
  // const [fileData, setfileData] = useState(null);
  // const [image, setImage] = useState(null);
  // const [error, setError] = useState(false);
  // const [orientation, setOrientation] = useState('Portrait');

  const [frstName, setFrstName] = useState('Jay');
  const [lastName, setLastName] = useState('Parmani');
  const [age, setAge] = useState('20');
  const [gender, setGender] = useState('MALE');
  const [fileData, setfileData] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(false);
  const [orientation, setOrientation] = useState('Portrait');
  const [ageError, setAgeError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [CompanyName, setCompanyName] = useState('Google Inc.');
  const [Location, setLocation] = useState('');
  //   const [Location, setLocation] = useState('Mumbai , India');
  const [locToken, setLocToken] = useState('');
  const [Searches, setSearches] = useState(null);
  const [ProfileData, setProfileData] = useState(false);
  const [curLoc, setcurLoc] = useState('');

  const [companyDetails, {dataa, errorr, loading}] = useMutation(
    company_mutation,
    {
      onCompleted: async (data) => {
        console.log(data.registerCompany);
        if (data.registerCompany.errors != null) {
          console.log(data.registerCompany.errors);
          setIsLoading(false);
        } else {
          const {company} = data.registerCompany;
          setIsLoading(false);
          await props.UpdateJobProfile(ProfileData, company);
        }
      },
      onError: async (err) => {
        console.log(err);
        setIsLoading(false);
      },
    },
  );
  const [profileUpdate, {data2, error2, loading2}] = useMutation(
    profile_mutation,
    {
      onCompleted: async (data) => {
        console.log(data);
        if (data.createOrUpdateProfile.errors != null) {
          console.log(data.createOrUpdateProfile.errors);
          setIsLoading(false);
        } else {
          const {profile} = data.createOrUpdateProfile;
          uploadCompanyDetails();
          setProfileData(profile);
        }
      },
      onError: async (err) => {
        console.log(err);
        if (err.message == 'Not authenticated') {
          await props.updateToken(props.refreshToken);
          setIsLoading(false);
          uploadProfile(imageUrl, fileUrl);
        }
        setIsLoading(false);
      },
    },
  );

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'A.I. Recruiter',
          message: 'This App access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the location');
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then((data) => {
            console.log('In enabler ', data);
            // Geolocation.getCurrentPosition(
            //   //Will give you the current location
            //   (position) => {
            //     //getting the Longitude from the location json
            //     const currentLongitude = JSON.stringify(
            //       position.coords.longitude,
            //     );

            //     //getting the Latitude from the location json
            //     const currentLatitude = JSON.stringify(
            //       position.coords.latitude,
            //     );
            //     console.log(`${currentLatitude},${currentLongitude}`);
            //     setcurLoc(`${currentLatitude},${currentLongitude}`);
            //   },
            //   (err2) => alert(err2.message),
            //   {
            //     enableHighAccuracy: true,
            //     timeout: 20000000000000,
            //     maximumAge: 200000000,
            //   },
            // );
            //   GetLocation.getCurrentPosition({
            //     enableHighAccuracy: false,
            //     timeout: 15000,
            //   })
            //     .then((location) => {
            //       console.log(location);
            //     })
            //     .catch((error) => {
            //       const {code, message} = error;
            //       console.warn(code, message);
            //     });
          })
          .catch((err) => {
            console.log(err);
            this.requestLocationPermission();
          });
      } else {
        console.log('location permission denied');
        alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backButtonHandler,
    );
    requestLocationPermission();
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

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
  }, []);

  const UploadFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setfileData({
        uri: res.uri,
        type: res.type,
        name: res.name,
        size: res.size,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const uploadImage = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      allowsEditing: true,
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response);
      }
    });
  };

  const SaveProfile = () => {
    console.log('adding', image.type);
    let img = {
      uri: image.uri,
      type: image.type,
      name: `${frstName}_${lastName}.${image.uri.split('.')[1]}`,
    };
    console.log(fileData);
    let resume = {
      uri: fileData.uri,
      type: 'image/jpg',
      name: `${frstName}_${lastName}_resume.jpg`,
    };

    var logo = '';
    var brouch = '';

    const data = new FormData();
    data.append('file', img);
    data.append('upload_preset', 'Company_Logo');
    data.append('cloud_name', 'ai-recruitment');
    const data_form = new FormData();
    data_form.append('file', resume);
    data_form.append('upload_preset', 'Company_Brouchers');
    data_form.append('cloud_name', 'ai-recruitment');

    fetch('https://api.cloudinary.com/v1_1/ai-recruitment/image/upload', {
      method: 'post',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => res.json())
      .then(async (val) => {
        var photo = image;
        photo.uri = val.secure_url;
        setImage(photo);
        console.log('added', ' ', val.secure_url);
        await setImageUrl(val.secure_url);
        logo = val.secure_url;
        fetch('https://api.cloudinary.com/v1_1/ai-recruitment/image/upload', {
          method: 'post',
          body: data_form,
        })
          .then((res2) => res2.json())
          .then(async (val2) => {
            console.log('added file', ' ', val2);
            await setFileUrl(val2.secure_url);
            brouch = val2.secure_url;
            uploadProfile(logo, brouch);
          })
          .catch((err) => {
            Alert.alert('An Error Occured While Uploading : ', err);
          });
      })
      .catch((err) => {
        Alert.alert('An Error Occured While Uploading : ', err);
      });
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

  const uploadProfile = (logo, brouch) => {
    console.log({
      name: `${frstName} ${lastName}`,
      age: parseInt(age, 10),
      gender: gender,
      photo: imageUrl,
      resume: fileUrl,
    });
    profileUpdate({
      variables: {
        input: {
          name: `${frstName} ${lastName}`,
          age: parseInt(age, 10),
          gender: gender,
          photo: logo,
          resume: brouch,
        },
      },
    });
  };

  const uploadCompanyDetails = () => {
    companyDetails({
      variables: {
        input: {
          name: CompanyName,
          location: Location,
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
      // scrollEnabled={orientation == 'Portrait' ? false : true}
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
          }}>
          Job Profile
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
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={uploadImage}
          style={styles.imgStyle}>
          {image == null ? (
            <View>
              <Image
                source={
                  image == null
                    ? require('../assets/user.png')
                    : //  : {uri: 'data:image/jpeg;base64,' + image.data}
                      {uri: image.uri}
                }
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 0.5,
                }}
              />
              <Text
                adjustsFontSizeToFit
                numberOfLines={3}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  opacity: 0.5,
                  fontSize: 16,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}>
                Company{'\n'}Logo
              </Text>
            </View>
          ) : (
            <Image
              source={{uri: image.uri}}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 20,
              }}
            />
          )}
        </TouchableOpacity>

        <View
          style={{
            justifyContent: 'space-around',
            height: 'auto',
            width: '100%',
            alignSelf: 'center',
            marginTop: 60,
            borderRadius: 40,
          }}>
          {error == true && image == null ? (
            <View
              style={{
                flex: 1,
                marginTop: 2,
                alignSelf: 'center',
                width: 'auto',
              }}>
              <ErrorMessage msg={'Please Upload Profile Pic'} />
            </View>
          ) : null}
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
          {error == true && CompanyName == '' ? (
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
            {error == true && Location == '' ? (
              <View style={{flex: 1, marginTop: 2}}>
                <ErrorMessage msg={'Please Provide Location'} />
              </View>
            ) : null}
          </View>
          {Searches != null || Searches != [] ? (
            <SafeAreaView style={{flex: 1}}>
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
            </SafeAreaView>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            <TextInputCustom
              textVal={frstName}
              inputHandler={(txt) => {
                setFrstName(txt);
              }}
              placeholder="FIRST NAME"
              viewStyle={{paddingLeft: 0, width: '40%', alignSelf: 'center'}}
              inputStyle={{fontSize: 16, marginLeft: 5}}
            />

            <TextInputCustom
              textVal={lastName}
              inputHandler={(txt) => {
                setLastName(txt);
              }}
              placeholder="LAST NAME"
              viewStyle={{
                paddingLeft: 0,
                width: '40%',
                alignSelf: 'center',
              }}
              inputStyle={{fontSize: 16, marginLeft: 5}}
            />
          </View>
          {error == true && (frstName == '' || lastName == '') ? (
            <View style={{flex: 1, marginTop: 2}}>
              <ErrorMessage msg={'Enter Full Name'} />
            </View>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '85%',
              alignContent: 'center',
              alignItems: 'center',
              marginLeft: '5%',
            }}>
            <View style={{width: '50%', height: 60}}>
              <TextInputCustom
                textVal={age}
                autoCompleteType="off"
                inputHandler={(txt) => {
                  setAge(txt);
                }}
                placeholder="AGE"
                keyboardType="number-pad"
                viewStyle={{
                  paddingLeft: 0,
                  width: '85%',
                  borderColor: '#3B3B3B',
                  alignSelf: 'center',
                }}
                inputStyle={{fontSize: 16, marginLeft: 5}}
              />
              {error == true &&
              (age == null || age == '' || parseInt(age, 10) < 0) ? (
                <View style={{flex: 1, width: '100%'}}>
                  <ErrorMessage msg={'Enter valid Age'} />
                </View>
              ) : null}
            </View>
            <View style={{width: '45%', marginLeft: '6%', height: 60}}>
              <View style={styles.pickerStyle}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(val) => {
                    setGender(val);
                  }}>
                  <Picker.Item
                    label="Select Gender"
                    value={null}
                    color="#3B3B3B"
                  />
                  <Picker.Item label="MALE" value="MALE" />
                  <Picker.Item label="FEMALE" value="FEMALE" />
                  <Picker.Item label="OTHER" value="OTHER" />
                </Picker>
              </View>
              {error == true && gender == null ? (
                <View style={{flex: 1, width: '100%'}}>
                  <ErrorMessage msg={'Select Gender'} />
                </View>
              ) : null}
            </View>
          </View>

          <Text style={styles.resHeaderStyle}>COMPANY BROCHURE</Text>
          {fileData == null ? (
            <TouchableOpacity
              style={[styles.fileStyle, {width: '80%'}]}
              onPress={UploadFile}>
              <Icon name={'file-upload'} size={25} />
              <Text style={{marginLeft: 15, fontSize: 15}}>
                Click To Upload
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.fileStyle} onPress={UploadFile}>
              <Icon name="file-document-outline" size={25} />
              <Text
                numberOfLines={2}
                style={{
                  paddingHorizontal: 10,
                  fontSize: 16,
                  width: '100%',
                }}>
                {fileData != null ? fileData.name : ''}
              </Text>
            </TouchableOpacity>
          )}
          {error == true && fileData == null ? (
            <View style={{flex: 1, marginTop: 2, marginBottom: 5}}>
              <ErrorMessage msg={'Please Upload Company Broucher'} />
            </View>
          ) : null}
          <TouchableOpacity
            onPress={() => {
              setIsLoading(true);
              image == null ||
              frstName == '' ||
              lastName == '' ||
              age == null ||
              gender == null ||
              fileData == null
                ? setError(true)
                : SaveProfile();
              setIsLoading(true);
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
    </KeyboardAwareScrollView>
  );
}
const mapStateToProps = (state) => {
  return {
    id: state.authRed.id,
    refreshToken: state.authRed.refreshToken,
  };
};

export default connect(mapStateToProps, {UpdateJobProfile, updateToken})(
  JobsProfilePage,
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
    width: '100%',
    alignSelf: 'center',
    borderColor: '#3B3B3B',
    borderBottomWidth: 1.5,
    marginTop: 14,
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
