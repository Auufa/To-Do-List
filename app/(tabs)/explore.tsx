import { View, Text, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
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
    if (title.trim() === '' || deadline.trim() === ''){
      Alert.alert('Duh', 'belom kamu isi');
      return;
    }

    if (mapel.trim().length < 3) {
      Alert.alert('Huh', 'Yang bener kamu input mapelnya');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      mapel: mapel.trim(),
      title: title.trim(),
      deadline: deadline.trim(),
      category,
      checked: false,
    };

    setList([...list, newTask]);
    resetForm();
  };

  const resetForm = () => {
    setMapel('');
    setTitle('');
    setDeadline('');
    setCategory('PR');
    setIsEditing(false);
    setEditId(null);
  };

  const toggleCheck = (id) => {
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

  const deleteTask = (id) => {
    const filtered = list.filter(item => item.id !== id);
    setList(filtered);

  };

  const alertDelete = (id) => {
   Alert.alert(
      "Hapus Tugas",
      "Yakin mau hapus tugas ini?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Hapus",
          onPress: () => {
            deleteTask(id);
          },
          style: "destructive"
        }
      ]
    ); 
  }
  const handleEdit = () => {
    const updated = list.map(item =>
      item.id === editId
        ? { ...item, mapel: mapel.trim(), title: title.trim(), deadline: deadline.trim(), category }
        : item
    );
    setList(updated);
    resetForm();
  };

  const startEdit = (item) => {
    setMapel(item.mapel);
    setTitle(item.title);
    setDeadline(item.deadline);
    setCategory(item.category);
    setIsEditing(true);
    setEditId(item.id);
  };

  const TaskCard = ({ item }) => (
    <View style={[tw`rounded-xl p-3 mb-3 flex-row justify-between items-center`,
      { backgroundColor: item.checked ? '#1f3f2a' : '#fff', elevation: 2 }
    ]}>
      <View style={tw`flex-row items-start gap-2 flex-1`}>
        <TouchableOpacity onPress={() => toggleCheck(item.id)} style={tw`mt-1`}>
          <View style={[tw`w-7 h-7 rounded border items-center justify-center mr-4 mt-3`, 
            item.checked ? tw`bg-green-700 border-green-700` : tw`border-gray-400`
          ]}>
            {item.checked && <Text style={tw`text-white text-center text-xs`}>✔</Text>}
          </View>
        </TouchableOpacity>
        <View>
          <Text style={[tw`font-bold text-base`, item.checked ? tw`text-white` : tw`text-black`]}>{item.title}</Text>
          <Text style={[tw`text-xs`, item.checked ? tw`text-gray-200` : tw`text-gray-600`]}>Mapel {item.mapel}</Text>
          <Text style={[tw`text-xs font-bold`, item.checked ? tw`text-red-200` : tw`text-red-600`]}>{item.deadline}</Text>
        </View>
      </View>

      <View style={tw`flex-row gap-2`}>
        <TouchableOpacity onPress={() => startEdit(item)}>
          <View style={tw`bg-blue-600 p-2 rounded`}>
            <Text style={tw`text-white text-xs`}>✏️</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => alertDelete(item.id)}>
          <View style={tw`bg-red-600 p-2 rounded`}>
            <Text style={tw`text-white text-xs`}>🗑️</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 mt-8`}>
      <View>
        <View style={tw`px-4`}>
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

          <TouchableOpacity onPress={isEditing ? handleEdit : addTask} style={tw`bg-blue-900 h-10 rounded-lg justify-center`}>
            <Text style={tw`text-white text-center text-base font-bold`}>
              {isEditing ? ' SELESAI EDIT' : 'TAMBAH TUGAS'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`pt-5 px-4`}>
        <FlatList
          data={list}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TaskCard item={item} />}
          contentContainerStyle={tw`pt-5 pb-10`}
          ListEmptyComponent={() => (
            <View style={tw`items-center justify-center mt-20`}>
              <Text style={tw`text-gray-500 text-lg font-semibold`}>Yeay gada tugas kamu</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;