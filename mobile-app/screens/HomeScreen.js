import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import CloudinaryImage from 'react-native-cloudinary-image-display';
import {connect} from 'react-redux';

function HomeScreen(props) {
  return (
    <View style={{backgroundColor: '#aeaeae', flex: 1}}>
      <Text> HomeScreen </Text>
      <Image
        style={{width: 100, height: 100}}
        source={{
          uri:
            'https://res.cloudinary.com/ai-recruitment/image/upload/v1604663615/Profile_Pics/Prakhar_Jindal_xkdcbc.jpg',
        }}
      />
      <CloudinaryImage
        cloud_name="ai-recruitment"
        imageId={'692881d9cb15667434399b45f09afafd512ab6fc'}
        width={800}
        height={800}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    profile: state.authRed.profile,
  };
};

export default connect(mapStateToProps, {})(HomeScreen);
