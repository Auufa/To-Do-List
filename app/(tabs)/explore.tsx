import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from "twrnc";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const Index = () => {
  const [mapel, setMapel] = useState('');
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('PR');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const addTask = () => {
    if (title.trim() === '' || deadline.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      mapel: mapel.trim(),
      title: title.trim(),
      deadline: deadline.trim(),
      category,
      checked: false,
    };

    setList([...list, newTask]);
    setMapel('');
    setTitle('');
    setDeadline('');
    setCategory('PR');
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
    } catch (error) {
      console.log('Gagal simpan:', error);
    }
  };

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved !== null) {
        setList(JSON.parse(saved));
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
    const updated = list.map(item =>
      item.id === editId
        ? { ...item, mapel:mapel.trim(), title: title.trim(), deadline: deadline.trim(), category }
        : item
    );
    setList(updated);
    setMapel('');
    setTitle('');
    setDeadline('');
    setCategory('PR');
    setIsEditing(false);
    setEditId(null);
  };

  const startEdit = (item: any) => {
    setMapel(item.mapel);
    setTitle(item.title);
    setDeadline(item.deadline);
    setCategory(item.category);
    setIsEditing(true);
    setEditId(item.id);
  };

  return (
    <SafeAreaView style={tw`flex-1 mt-8`}>
      <View>
        <View style={tw` px-4`}>
          <Text style={tw`font-bold text-4xl text-center`}>📝 TugasKu</Text>
        </View>

        <View style={tw`mt-5 px-4 gap-3`}>
        <View>
          <Text>Mata Pelajaran</Text>
          <TextInput
            placeholder='Mata Pelajaran'
            style={tw`border border-gray-700 rounded px-2 h-10 mt-2`}
            value={mapel}
            onChangeText={setMapel}
          />
        </View>
        
        <View>
          <Text>Judul Tugas</Text>
          <TextInput
            placeholder='Judul Tugas'
            style={tw`border border-gray-700 rounded px-2 h-10 mt-2`}
            value={title}
            onChangeText={setTitle}
          />
        </View>
          
        <View>
          <Text>Tanggal</Text>
           <TextInput
            placeholder='Deadline (cth: 20 Apr 2025)'
            style={tw`border border-gray-700 rounded px-2 h-10 mt-2`}
            value={deadline}
            onChangeText={setDeadline}
          />
        </View>
         
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
            <Picker.Item label="PR" value="PR" />
            <Picker.Item label="Mapel" value="Mapel" />
            <Picker.Item label="Tugas" value="Tugas" />
          </Picker>

          <TouchableOpacity onPress={isEditing ? handleEdit : addTask} style={tw`bg-blue-600 h-10 rounded-lg justify-center`}>
            <Text style={tw`text-white text-center text-base font-bold`}>
              {isEditing ? ' SELESAI EDIT' : 'TAMBAH TUGAS'}
            </Text>
          </TouchableOpacity>
        </View>

        
      </View>

      <View style={tw`pt-5 px-4`}>
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={tw`border border-gray-300 rounded p-3 mb-3`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-gray-600 ml-2 font-semibold text-2xl`}>
                  {item.mapel}
                </Text>
              </View>
              <Text style={tw`text-gray-600 mt-1`}>Judul Tugas: {item.title}</Text>
              <Text style={tw`text-gray-600 mt-1`}>🗓 Deadline: {item.deadline}</Text>
              <Text style={tw`text-gray-600`}>📌 Kategori: {item.category}</Text>
              <View style={tw`flex-row gap-3 mt-2 left-56`}>
                <TouchableOpacity onPress={() => startEdit(item)}>
                  <Text style={tw`text-blue-800 font-bold bg-blue-200 px-3 py-1 rounded-md `}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.id)} style={tw`bg-red-700 px-3 py-1 rounded-md`}>
                  <Text style={tw`text-white`}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;
