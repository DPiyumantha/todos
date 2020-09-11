/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import TodoScreen from './screens/todoScreen';
import TodoDetails from './screens/todoDetails';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
const App = () => {
  return (
    <TodoScreen/>
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     <Stack.Screen
    //       name="Home"
    //       component={TodoScreen}
    //       options={{ title: 'Todos' }}
    //     />
    //     <Stack.Screen name="Details" component={TodoDetails} />
    //   </Stack.Navigator>
    // </NavigationContainer>
  )
};

export default App;
