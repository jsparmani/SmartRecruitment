import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Index from './screens/Index';
import {NavigationContainer} from '@react-navigation/native';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';

// Initialize Apollo Client
const client = new ApolloClient({
  uri: 'localhost:4000/graphql',
  cache: new InMemoryCache(),
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ApolloProvider client={client}>
          <NavigationContainer>
            <Index />
          </NavigationContainer>
        </ApolloProvider>
      </View>
    );
  }
}

export default App;
