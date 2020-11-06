import React from 'react';
import {View, Text} from 'react-native';

export default function ErrorMessage({msg = '', msgStyle = {}, txtStyle = {}}) {
  console.log(msg);
  return (
    <View style={[{width: '80%', alignSelf: 'center'}, msgStyle]}>
      <Text style={[{color: 'red'}, txtStyle]}>* {msg}</Text>
    </View>
  );
}
