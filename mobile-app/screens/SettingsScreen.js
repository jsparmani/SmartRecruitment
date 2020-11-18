import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import {LogOut} from '../src/actions/dataAction';

function SettingScreen(props) {
  return (
    <View>
      <TouchableOpacity
        style={styles.btnStyle}
        onPress={() => {
          props.LogOut();
        }}>
        <Text>LOG-OUT</Text>
      </TouchableOpacity>
    </View>
  );
}

export default connect(null, {LogOut})(SettingScreen);

const styles = StyleSheet.create({
  btnStyle: {
    marginTop: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: '#ADD8E6',
  },
});
