import {
  Dimensions,
  Keyboard,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

const {width} = Dimensions.get('window');

const App = () => {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=6').then(res =>
      res.json().then(data =>
        data.map(item =>
          setTodos(prev => [
            ...prev,
            {
              id: item.id,
              text: item.title,
              completed: item.completed,
            },
          ]),
        ),
      ),
    );
  }, []);

  const createNewTodo = () => {
    if (text === '') {
      return;
    }

    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };

    setTodos([newTodo, ...todos]);
    setText('');
    Keyboard.dismiss();
  };

  const editTodo = id => {
    setEdit(true);
    setEditId(id);
    const todo = todos.find(todo => todo.id === id);
    setText(todo.text);
    inputRef.current.focus();
  };

  const saveEdit = () => {
    const newTodos = todos.map(todo => {
      if (todo.id === editId) {
        todo.text = text;
      }
      return todo;
    });

    setTodos(newTodos);
    setEdit(false);
    setEditId(null);
    setText('');
    Keyboard.dismiss();
  };

  const deleteTodo = id => {
    const newTodos = todos.filter(todo => todo.id !== id);
    setTodos(newTodos);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView
        style={{alignItems: 'center', justifyContent: 'flex-start', flex: 1}}>
        <Text style={{fontSize: 32, fontWeight: '500', marginVertical: 12}}>
          My To Do List
        </Text>
        <View
          style={{
            paddingVertical: 12,
            width: width - width * 0.1,
            flexDirection: 'row',
          }}>
          <TextInput
            placeholder="New ToDo"
            style={{
              flex: 1,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: '#128756',
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              paddingHorizontal: 12,
            }}
            ref={inputRef}
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity
            style={{
              paddingHorizontal: 20,
              backgroundColor: '#128756',
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={edit ? saveEdit : createNewTodo}>
            <Text style={{fontSize: 14, fontWeight: '400', color: '#FFFFFF'}}>
              {edit ? 'Update' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{flex: 1}}>
          {todos.map(todo => (
            <View
              key={todo.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: width - width * 0.1,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: '#128756',
                borderRadius: 8,
                marginVertical: 8,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '400',
                  textDecorationLine: todo.completed ? 'line-through' : 'none',
                  flex: 0.7,
                  whiteSpace: 'wrap',
                }}>
                {todo.text}
              </Text>
              <View style={{flexDirection: 'row', flex: 0.3}}>
                <TouchableOpacity
                  style={{
                    padding: 12,
                    backgroundColor: '#128756',
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 6,
                  }}
                  onPress={() => editTodo(todo.id)}>
                  <Icon name="edit" size={20} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 12,
                    backgroundColor: '#984356',
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 6,
                  }}
                  onPress={() => deleteTodo(todo.id)}>
                  <Icon name="delete" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default App;

const styles = StyleSheet.create({});
