/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {View, Text, Animated, TouchableOpacity, Easing} from 'react-native';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ball1: new Animated.Value(0),
      ball2: new Animated.Value(0),
      ball3: new Animated.Value(0),
    };
  }

  componentDidMount = () => {
    this.moveBall();
  };
  moveBall = () => {
    Animated.timing(this.state.ball1, {
      toValue: 15,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(this.state.ball1, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
    Animated.timing(this.state.ball2, {
      toValue: 15,
      duration: 650,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(this.state.ball2, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }).start();
    });
    Animated.timing(this.state.ball3, {
      toValue: 15,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(this.state.ball3, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        this.moveBall();
      });
    });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: 'black',
          width: '100%',
          justifyContent: 'center',
        }}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: this.state.ball1,
              },
            ],
          }}>
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: 'red',
              borderRadius: 15,
              margin: 5,
              justifyContent: 'center',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          />
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              {
                translateY: this.state.ball2,
              },
            ],
          }}>
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: 'lightgreen',
              borderRadius: 15,
              margin: 5,
              justifyContent: 'center',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          />
        </Animated.View>
        <Animated.View
          style={{
            transform: [
              {
                translateY: this.state.ball3,
              },
            ],
          }}>
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: 'yellow',
              borderRadius: 15,
              margin: 5,
              justifyContent: 'center',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          />
        </Animated.View>
        <TouchableOpacity
          onPress={() => {
            this.moveBall();
          }}
          style={{position: 'absolute', bottom: 10, alignSelf: 'center'}}>
          <Text>Move Me</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default App;
