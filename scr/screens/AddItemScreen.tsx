// src/screens/AddItemScreen.tsx

import React, { useState } from 'react';
import { /*... imports ...*/ } from 'react-native';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackScreenProps } from '@react-navigation/stack';
import { MenuItem, CourseType } from '../types';
import { RootTabParamList, AddItemStackParamList } from '../../App';

type AddItemScreenProps = CompositeScreenProps<
  StackScreenProps<AddItemStackParamList, 'AddItemMain'>,
  BottomTabScreenProps<RootTabParamList>
>;

const AddItemScreen: React.FC<AddItemScreenProps> = ({ navigation }) => {
  // ... (all your existing state and functions are fine)
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<CourseType>('Starters');
  const courses: CourseType[] = ['Starters', 'Mains', 'Desserts'];
  const generateId = (): string => Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const handleAddItem = async (): Promise<void> => {
    // ... (your existing handleAddItem logic)
    if (!dishName.trim()) { Alert.alert('Error', 'Please enter a dish name'); return; }
    if (!description.trim()) { Alert.alert('Error', 'Please enter a description'); return; }
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) { Alert.alert('Error', 'Please enter a valid price'); return; }
    const newItem: MenuItem = { id: generateId(), name: dishName.trim(), description: description.trim(), course: selectedCourse, price: parseFloat(price).toFixed(2) };
    try {
      const storedItems = await AsyncStorage.getItem('menuItems');
      const existingItems: MenuItem[] = storedItems ? JSON.parse(storedItems) : [];
      const updatedItems = [...existingItems, newItem];
      await AsyncStorage.setItem('menuItems', JSON.stringify(updatedItems));
      Alert.alert('Success', `${newItem.name} has been added to the menu!`, [{ text: 'OK', onPress: () => {
        setDishName(''); setDescription(''); setPrice(''); setSelectedCourse('Starters');
        navigation.navigate('Home');
      }}]);
    } catch (error) { console.error('Error saving menu item:', error); Alert.alert('Error', 'Failed to save menu item'); }
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* ... (keep KeyboardAvoidingView, ScrollView, form inputs) */}
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.form}>
            <View style={styles.inputGroup}><Text style={styles.label}>Dish Name</Text><TextInput style={styles.input} placeholder="Enter dish name" value={dishName} onChangeText={setDishName} placeholderTextColor="#95a5a6" /></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Description</Text><TextInput style={[styles.input, styles.textArea]} placeholder="Enter dish description" value={description} onChangeText={setDescription} multiline numberOfLines={4} textAlignVertical="top" placeholderTextColor="#95a5a6" /></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Course</Text><View style={styles.courseOptions}>{courses.map(course => (<TouchableOpacity key={course} style={[styles.courseOption, selectedCourse === course && styles.courseOptionActive,]} onPress={() => setSelectedCourse(course)}><Text style={[styles.courseOptionText, selectedCourse === course && styles.courseOptionTextActive,]}>{course}</Text></TouchableOpacity>))}</View></View>
            <View style={styles.inputGroup}><Text style={styles.label}>Price ($)</Text><TextInput style={styles.input} placeholder="0.00" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholderTextColor="#95a5a6" /></View>
            
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Add to Menu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (your existing styles)
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Update addButton style for better centering without icon
  addButton: {
    backgroundColor: '#27ae60',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 8,
    marginTop: 10,
  },
  container: { flex: 1, backgroundColor: '#f8f9fa' }, scrollContent: { flexGrow: 1, justifyContent: 'center' }, form: { padding: 25 }, inputGroup: { marginBottom: 25 }, label: { fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 8 }, input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 16, color: '#2c3e50' }, textArea: { height: 100 }, courseOptions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 }, courseOption: { flex: 1, backgroundColor: '#ecf0f1', padding: 15, borderRadius: 8, alignItems: 'center' }, courseOptionActive: { backgroundColor: '#3498db' }, courseOptionText: { fontSize: 14, fontWeight: '500', color: '#7f8c8d' }, courseOptionTextActive: { color: 'white' },
});

export default AddItemScreen;