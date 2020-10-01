import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Index from './screens/Index';
import {NavigationContainer} from '@react-navigation/native';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <NavigationContainer>
          <Index />
        </NavigationContainer>
      </View>
    );
  }
}

export default App;
