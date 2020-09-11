/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
// import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Dimensions,
  DrawerLayoutAndroidComponent,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import sortByDate from '../helpers/sortByDate';
const TodoScreen = ({navigation}) => {
  const [modalVisibility, setmodalVisibility] = useState(false);
  const [detailsModalVisibility, setDetailsModalVisibility] = useState(false);
  const [todos, setTodos] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [selectedTodo, setSelectedTodo] = useState({});
  const [fetching, isFetching] = useState(false);

  const Item = ({id, title, description, isCompleted}) => (
    <TouchableOpacity
      // onPress={()=>navigation.navigate('Details',{id, title, description, isCompleted})}
      onPress={() => {
        setDetailsModalVisibility(true);
        setSelectedTodo({id, title, description, isCompleted});
      }}>
      <View style={styles.item}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15,
          }}>
          <CheckBox
            value={isCompleted}
            onValueChange={() =>
              handleCheck(id, title, description, isCompleted)
            }></CheckBox>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.title}>{title}</Text>
          <Text>{description.substr(0, 20)}...</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleCheck = (id, title, description, isCompleted) => {
    console.log(id, title, description, isCompleted);
    isFetching(true);
    fetch(`https://todos-dima.herokuapp.com/todos/api/todos/update/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        isCompleted: !isCompleted,
      }),
    })
      .then((data) => {
        isFetching(false);
        console.log(data);
        fetchAndUpdateTodos();
      })
      .catch((err) => {
        console.log(err);
        isFetching(false);
      });
  };

  const submitTodo = (title, description) => {
    const data = {
      title,
      description,
      isCompleted: false,
    };
    console.log(data);
    isFetching(true);
    fetch('https://todos-dima.herokuapp.com/todos/api/todos', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
      }),
    })
      .then((data) => {
        console.log(data);
        isFetching(false);
        fetchAndUpdateTodos();
      })
      .catch((err) => {
        console.log(err);
        isFetching(false);
      });
  };
  const addTodo = () => {
    // setTodos([
    //   ...todos,
    //   {
    //     title: formData.title,
    //     description: formData.description,
    //     isCompleted: false,
    //     id: 97868,
    //   },
    // ]);
    // console.log({
    //   title: formData.title,
    //   description: formData.description,
    // });
    submitTodo(formData.title, formData.description);
    setmodalVisibility(false);
  };

  const fetchAndUpdateTodos = () => {
    console.log('fetching');
    isFetching(true);
    fetch('https://todos-dima.herokuapp.com/todos/api/todos')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        var arr =sortByDate(data)
        setTodos(arr);
      })
      .then(isFetching(false))
      .catch((err) => {
        console.log(err);
        isFetching(false);
      });
  };

  useEffect(() => {
    fetchAndUpdateTodos();
  }, [todos.length]);

  const renderItem = ({item}) => (
    <Item
      isCompleted={item.isCompleted}
      id={item._id}
      title={item.title}
      description={item.description}
    />
  );

  return (
    <View style={{flex: 1}}>
      <View style={styles.heading}>
        <Text
          style={{
            fontFamily: 'ShadowsIntoLight-Regular',
            fontSize: 60,
            color: 'white',
          }}>
          Todos
        </Text>
      </View>
      <View style={styles.list}>
        <FlatList
          data={todos}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      </View>
      <ActionButton
        buttonColor="rgba(231,76,60,1)"
        onPress={() => setmodalVisibility(true)}>
        {/* <ActionButton.Item
          isVisible={false}
          buttonColor="#9b59b6"
          title="Add todo"
          onPress={() => setmodalVisibility(true)}>
          <Icon name="rocket" size={30} color="#900" />
        </ActionButton.Item> */}
      </ActionButton>

      <Modal isVisible={modalVisibility}>
        <View style={styles.modal}>
          <TextInput
            autoFocus={true}
            placeholder="Title"
            onChangeText={(val) => setFormData({...formData, title: val})}
            style={styles.textInput}></TextInput>
          <TextInput
            placeholder="Description"
            onChangeText={(val) => setFormData({...formData, description: val})}
            style={styles.textInput}></TextInput>
          <View
            style={{
              // zIndex:2,
              flexDirection: 'row',
              justifyContent: 'space-around',
              // flex: 1,
              padding: 20,
            }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setmodalVisibility(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addTodo} style={styles.button}>
              <Text>Add todo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={detailsModalVisibility}>
        <View style={{...styles.modal}}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ ...styles.title,fontSize:30,}}>{selectedTodo.title}</Text>
            <Text style={styles.title}>{selectedTodo.description}</Text>
            <TouchableOpacity
              style={{...styles.button, marginTop: 25}}
              onPress={() => {
                setDetailsModalVisibility(false);
                setSelectedTodo({});
              }}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 15,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 30,
    width: 75,
    backgroundColor: 'pink',
  },
  modal: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 25,
    borderBottomEndRadius: 40,
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  heading: {
    fontSize: 45,
    backgroundColor: 'violet',
    padding: 25,
    alignItems: 'center',
    borderBottomEndRadius: Dimensions.get('window').width / 2,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
  },
  list: {
    flex: 1,
  },
});

export default TodoScreen;
