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
  Platform,
  Alert,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import ErrorMessage from '../Components/ErrorMessage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {StackActions} from '@react-navigation/native';
import {gql, useMutation} from '@apollo/client';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');

function backButtonHandler() {
  ToastAndroid.show('First Complete Profile', ToastAndroid.SHORT);
  return true;
}
BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);

const profile_mutation = gql`
  mutation CreateUpdateProfile($input: ProfileInput!) {
    createOrUpdateProfile(input: $input) {
      profile {
        name
        age
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

function ProfilePage(props) {
  // const [frstName, setFrstName] = useState('');
  // const [lastName, setLastName] = useState('');
  // const [age, setAge] = useState(null);
  // const [gender, setGender] = useState(null);
  // const [fileData, setfileData] = useState(null);
  // const [image, setImage] = useState(null);
  // const [error, setError] = useState(false);
  // const [orientation, setOrientation] = useState('Portrait');

  const [frstName, setFrstName] = useState('Prakhar');
  const [lastName, setLastName] = useState('Jindal');
  const [age, setAge] = useState('20');
  const [gender, setGender] = useState('MALE');
  const [fileData, setfileData] = useState(null);
  const [image, setImage] = useState(null);
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
          //   data.register.errors.map((val, ind) => {
          //     if (val.field == 'age') {
          //       setAgeError(val.message);
        }
        //   });
        // } else {
        //   // const {profile} = data.register.user;
        //   // const {accessToken, refreshToken} = data;
        //   console.log(data);
        //   // await props.setUser(
        //   //   email,
        //   //   username,
        //   //   role,
        //   //   profile,
        //   //   accessToken,
        //   //   refreshToken,
        //   // );
        //   // props.navigation.navigate('Profile');
        // }
        setIsLoading(false);
      },
    },
  );

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
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

  const downloadSample = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Access Storage',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const {config, fs} = RNFetchBlob;
        let PictureDir =
          Platform.OS == 'android' ? fs.dirs.DownloadDir : fs.dirs.DocumentDir; // this is the pictures directory. You can check the available directories in the wiki.
        let options = {
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
            notification: true,
            path: PictureDir + '/Sample_Resume.pdf', // this is the path where your downloaded file will live in
            description: 'Downloading Sample resume.',
          },
        };
        config(options)
          .fetch(
            'GET',
            // 'https://www.coolfreecv.com/doc/coolfreecv_resume_en_06_n.docx',
            'https://res.cloudinary.com/ai-recruitment/image/upload/v1604378216/jakes-resume_na7ngk.pdf',
          )
          .then((res) => {
            console.log('downloaded');
            ToastAndroid.show('Sample resume downloaded', ToastAndroid.SHORT);
          });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      ToastAndroid.show('Sample Error Occurred !', ToastAndroid.SHORT);
      console.warn(err);
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
    var imgID = '';
    var resumeID = '';
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
        imgID = val.public_id;
        fetch('https://api.cloudinary.com/v1_1/ai-recruitment/image/upload', {
          method: 'post',
          body: data2,
        })
          .then((res) => res.json())
          .then((val) => {
            console.log('added file', ' ', val);
            resumeID = val.public_id;
            profileUpdate({
              variables: {
                input: {
                  name: `${frstName} ${lastName}`,
                  age: parseInt(age, 10),
                  gender: gender,
                  photo: imgID,
                  resume: resumeID,
                },
              },
            });
          })
          .catch((err) => {
            Alert.alert('An Error Occured While Uploading : ', err);
          });
      })
      .catch((err) => {
        Alert.alert('An Error Occured While Uploading : ', err);
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
          Profile
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          // borderTopLeftRadius: 40,
          // borderTopRightRadius: 40,
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
                Click{'\n'}To{'\n'}Upload
              </Text>
            </View>
          ) : (
            <Image
              source={
                // {uri: 'data:image/jpeg;base64,' + image.data}
                {uri: image.uri}
              }
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              marginTop: 20,
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
          {error == true && (age == null || parseInt(age, 10) < 0) ? (
            <View style={{flex: 1, marginTop: 2}}>
              <ErrorMessage msg={'Please enter valid Age'} />
            </View>
          ) : null}
          <View style={styles.pickerStyle}>
            <Picker
              selectedValue={gender}
              onValueChange={(val) => {
                setGender(val);
              }}>
              <Picker.Item label="Select Gender" value={null} color="#3B3B3B" />
              <Picker.Item label="MALE" value="MALE" />
              <Picker.Item label="FEMALE" value="FEMALE" />
              <Picker.Item label="OTHER" value="OTHER" />
            </Picker>
          </View>
          {error == true && gender == null ? (
            <View style={{flex: 1, marginTop: 2}}>
              <ErrorMessage msg={'Please Select Gender'} />
            </View>
          ) : null}
          <Text style={styles.resHeaderStyle}>UPLOAD RESUME</Text>
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
              <ErrorMessage msg={'Please Upload Resume'} />
            </View>
          ) : null}
          <Text
            onPress={downloadSample}
            style={{
              width: '85%',
              alignSelf: 'center',
              marginTop: 15,
              paddingLeft: 10,
              color: 'darkblue',
            }}>
            Click here to check Resume Format
          </Text>

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
              console.log(error);
              setIsLoading(false);
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
  };
};

export default connect(mapStateToProps, {})(ProfilePage);

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
