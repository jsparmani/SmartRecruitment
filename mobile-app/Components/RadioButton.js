/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

export default function RadioButton({
  selected = false,
  textVal,
  outerStyle = {},
  onPress,
}) {
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      style={[
        {
          flexDirection: 'row',
        },
        outerStyle,
      ]}>
      <View
        style={{
          width: 20,
          height: 20,
          borderWidth: 1.5,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#282A36',
        }}>
        <View
          style={{
            backgroundColor: selected ? '#34b1eb' : 'transparent',
            width: 12,
            height: 12,
            borderWidth: selected ? 1.5 : 0,
            borderRadius: 12,
          }}
        />
      </View>
      <Text style={{marginLeft: 10}}>{textVal}</Text>
    </TouchableWithoutFeedback>
  );
}
