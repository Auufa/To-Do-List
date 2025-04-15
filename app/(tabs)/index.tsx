import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from "twrnc";
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
  const [task, setTask] = useState('');
  const [list, setList] = useState([]);
  const [isEditing,setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const addTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      checked: false, // Tambahan: status ceklis
    };

    setList([...list, newTask]);
    setTask('');
  };

  const toggleCheck = (id: string) => {
    const updated = list.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setList(updated);
  };

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(list));
      console.log('Berhasil simpan data');
    } catch (error) {
      console.log('Gagal simpan:', error);
    }
  };

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null) {
        setList(JSON.parse(saved));
        console.log('Berhasil load data');
      }
    } catch (error) {
      console.log('Gagal load:', error);
    }
  };

  const deleteTask = (id: string) => {
    const filtered = list.filter(item => item.id !== id);
    setList(filtered);
  };

  const handleEdit = () => {
    const updated = list.map(item => item.id === editId ? { ...item, title: task.trim()}: item);
    setList(updated);
    setTask('');
    setIsEditing(false);
    setEditId(null);
  };

  const startEdit = (item: any) => {
    setTask(item.title);
    setIsEditing(true);
    setEditId(item.id);
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View>
        <View style={tw`bg-yellow-500 rounded-b-full h-42`} />
        <View style={tw`-mt-5 flex-row gap-2 px-4`}>
          <TextInput 
            placeholder='Tambahkan tugas..' 
            style={tw`border-gray-900 border rounded-lg w-70 h-10 px-2`}
            value={task} 
            onChangeText={setTask} 
          />
          <TouchableOpacity onPress={isEditing ? handleEdit : addTask} style={tw`bg-yellow-500 w-25 h-10 rounded-lg justify-center`}>
            <Text style={tw`text-white text-center text-base font-bold`}>TAMBAH</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`pt-4 px-4`}>
          <Text style={tw`font-bold text-4xl`}>👷‍♂️ Personal</Text>
        </View>
      </View>

      <View style={tw`pt-7 px-4`}>
        <FlatList 
          data={list} 
          keyExtractor={item => item.id} 
          renderItem={({ item }) => (
            <View style={tw`flex-row items-center gap-4 mb-3`}>
              <TouchableOpacity onPress={() => toggleCheck(item.id)} style={tw`w-7 h-7 border-2 border-gray-700 rounded-md items-center justify-center`}>
                {item.checked && (
                  <Text style={tw`text-lg`}>✓</Text>
                )}
              </TouchableOpacity>

              <Text style={tw`flex-1`}>
                {item.title}
              </Text>

              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={tw`text-blue-800 font-bold`}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteTask(item.id)} style={tw`bg-red-700 w-20 h-8 rounded-md items-center justify-center`}>
                <Text style={tw`text-white`}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

    </SafeAreaView>
  )
}

export default index;
