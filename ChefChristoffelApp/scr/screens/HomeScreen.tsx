// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuItem, CourseType } from '../types';

const HomeScreen: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dishName, setDishName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<CourseType>('Starters');

  const courses: CourseType[] = ['Starters', 'Mains', 'Desserts'];

  // Load menu items on component mount
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async (): Promise<void> => {
    try {
      const storedItems = await AsyncStorage.getItem('menuItems');
      if (storedItems) {
        setMenuItems(JSON.parse(storedItems));
      } else {
        // Initialize withthree items
        const initialItems: MenuItem[] = [
          {
            id: generateId(),
            name: 'Bruschetta',
            description: 'Toasted bread topped with tomatoes, garlic, and fresh basil',
            course: 'Starters',
            price: '8.99'
          },
          {
            id: generateId(),
            name: 'Grilled Salmon',
            description: 'Fresh salmon fillet with lemon butter sauce and seasonal vegetables',
            course: 'Mains',
            price: '24.99'
          },
          {
            id: generateId(),
            name: 'Chocolate Mousse',
            description: 'Rich chocolate mousse with whipped cream and berries',
            course: 'Desserts',
            price: '7.99'
          }
        ];
        setMenuItems(initialItems);
        await AsyncStorage.setItem('menuItems', JSON.stringify(initialItems));
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const generateId = (): string => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const handleAddItem = async (): Promise<void> => {
    // Validation
    if (!dishName.trim()) {
      Alert.alert('Error', 'Please enter a dish name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const newItem: MenuItem = {
      id: generateId(),
      name: dishName.trim(),
      description: description.trim(),
      course: selectedCourse,
      price: parseFloat(price).toFixed(2)
    };

    try {
      const updatedItems = [...menuItems, newItem];
      
      await AsyncStorage.setItem('menuItems', JSON.stringify(updatedItems));
      setMenuItems(updatedItems);
      
      // Reset form
      setDishName('');
      setDescription('');
      setPrice('');
      setSelectedCourse('Starters');
      
      Alert.alert('Success', `${newItem.name} has been added to the menu!`);
    } catch (error) {
      console.error('Error saving menu item:', error);
      Alert.alert('Error', 'Failed to save menu item');
    }
  };

  const deleteMenuItem = (id: string): void => {
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => confirmDelete(id)
        },
      ]
    );
  };

  const confirmDelete = async (id: string): Promise<void> => {
    try {
      const updatedItems = menuItems.filter(item => item.id !== id);
      setMenuItems(updatedItems);
      await AsyncStorage.setItem('menuItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      Alert.alert('Error', 'Failed to delete menu item');
    }
  };

  const getCourseColor = (course: CourseType): string => {
    switch (course) {
      case 'Starters': return '#3498db';
      case 'Mains': return '#e67e22';
      case 'Desserts': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chef Christoffel's Menu</Text>
            <Text style={styles.headerSubtitle}>Premium Culinary Experiences</Text>
          </View>

          {/* ADD ITEM FORM */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Add New Menu Item</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dish Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter dish name"
                value={dishName}
                onChangeText={setDishName}
                placeholderTextColor="#95a5a6"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter dish description"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor="#95a5a6"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Course</Text>
              <View style={styles.courseOptions}>
                {courses.map((course) => (
                  <TouchableOpacity
                    key={course}
                    style={[
                      styles.courseOption,
                      selectedCourse === course && styles.courseOptionActive
                    ]}
                    onPress={() => setSelectedCourse(course)}
                  >
                    <Text
                      style={[
                        styles.courseOptionText,
                        selectedCourse === course && styles.courseOptionTextActive
                      ]}
                    >
                      {course}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Price ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholderTextColor="#95a5a6"
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Text style={styles.addButtonText}>Add to Menu</Text>
            </TouchableOpacity>
          </View>

          {/* Statistics Section */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Menu Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{menuItems.length}</Text>
                <Text style={styles.statLabel}>Total Items</Text>
              </View>
            </View>
          </View>

          {/* Menu Items Display */}
          <View style={styles.menuSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Current Menu</Text>
              <Text style={styles.itemCount}>{menuItems.length} items</Text>
            </View>
            
            {menuItems.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No menu items yet</Text>
                <Text style={styles.emptySubtext}>
                  Add some delicious dishes to get started!
                </Text>
              </View>
            ) : (
              <FlatList
                data={menuItems}
                renderItem={({ item }) => {
                  const badgeStyle = {
                    ...styles.courseBadge,
                    backgroundColor: getCourseColor(item.course)
                  };

                  return (
                    <View style={styles.menuItem}>
                      <View style={styles.menuItemHeader}>
                        <Text style={styles.dishName}>{item.name}</Text>
                        <View style={badgeStyle}>
                          <Text style={styles.courseText}>{item.course}</Text>
                        </View>
                      </View>
                      <Text style={styles.description}>{item.description}</Text>
                      <View style={styles.menuItemFooter}>
                        <Text style={styles.price}>${item.price}</Text>
                        <TouchableOpacity onPress={() => deleteMenuItem(item.id)}>
                          <Text style={styles.deleteButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={item => item.id}
                scrollEnabled={false}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1 },
  header: { backgroundColor: '#2c3e50', padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: '#ecf0f1', textAlign: 'center', marginTop: 5 },
  
  // Form Styles
  formSection: { 
    backgroundColor: 'white', 
    margin: 15, 
    padding: 20, 
    borderRadius: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#2c3e50', marginBottom: 8 },
  input: { 
    backgroundColor: '#f8f9fa', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16, 
    color: '#2c3e50' 
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  courseOptions: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  courseOption: { 
    flex: 1, 
    backgroundColor: '#ecf0f1', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  courseOptionActive: { backgroundColor: '#3498db' },
  courseOptionText: { fontSize: 14, fontWeight: '500', color: '#7f8c8d' },
  courseOptionTextActive: { color: 'white' },
  addButton: { 
    backgroundColor: '#27ae60', 
    padding: 15, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  addButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  
  // Statistics Styles
  statsSection: { marginHorizontal: 15, marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15 },
  statsGrid: { 
    flexDirection: 'row', 
    justifyContent: 'center'
  },
  statCard: { 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 15, 
    alignItems: 'center', 
    width: '48%', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  statLabel: { fontSize: 12, color: '#7f8c8d', marginTop: 5 },
  
  // Menu Section Styles
  menuSection: { marginHorizontal: 15, flex: 1 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  itemCount: { color: '#7f8c8d', fontSize: 14 },
  menuItem: { 
    backgroundColor: 'white', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3 
  },
  menuItemHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 8 
  },
  dishName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#2c3e50', 
    flex: 1, 
    marginRight: 10 
  },
  courseBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  courseText: { color: 'white', fontSize: 12, fontWeight: '500' },
  description: { 
    color: '#7f8c8d', 
    fontSize: 14, 
    lineHeight: 20, 
    marginBottom: 10 
  },
  menuItemFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  price: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  deleteButtonText: { color: '#e74c3c', fontSize: 14, fontWeight: '500' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 18, color: '#7f8c8d', marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: '#bdc3c7', textAlign: 'center' },
});

export default HomeScreen;