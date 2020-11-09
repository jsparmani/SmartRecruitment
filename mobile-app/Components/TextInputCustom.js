import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TextInputCustom({
  textVal,
  inputHandler,
  keyboardType = 'default', //email-address
  autoCompleteType = 'username',
  iconName = 'icon',
  hasIcon = false,
  hasRightIcon = false,
  customIcon = false,
  iconColor = '#3B3B3B',
  iconChild,
  righticonChild,
  placeholder,
  placeholderTextColor = '#00000090',
  secureTextEntry = false,
  inputStyle = {},
  viewStyle = {},
}) {
  return (
    <View style={[styles.viewStyle, viewStyle]}>
      {hasIcon ? (
        customIcon ? (
          <View style={{justifyContent: 'center'}}>{iconChild}</View>
        ) : (
          <View style={{justifyContent: 'center'}}>
            <Icon
              name={iconName}
              color={iconColor}
              size={30}
              style={{
                // flex: 0.2,
                alignSelf: 'center',
              }}
            />
          </View>
        )
      ) : null}
      <TextInput
        keyboardType={keyboardType}
        autoCompleteType={autoCompleteType}
        secureTextEntry={secureTextEntry}
        style={[styles.inputStyle, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={textVal}
        onChangeText={inputHandler}
      />
      {hasRightIcon ? <View>{righticonChild}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    height: 50,
    width: '90%',
    borderColor: '#3B3B3B',
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    paddingLeft: 10,
    marginTop: 15,
    // backgroundColor: '#00000030',
  },
  inputStyle: {flex: 1, marginLeft: 15},
});
