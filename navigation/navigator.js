import {createStackNavigator} from '@react-navigation/stack';
import { createAppContainer } from 'react-navigation';
import TodoScreen from '../screens/todoScreen';
const Stack = createStackNavigator({
    Home:{
        name:"Home",
        component:{TodoScreen},
        options:{title: 'Todos'}
    }
});

export default createAppContainer(Stack);