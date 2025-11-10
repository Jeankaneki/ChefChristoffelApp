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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MenuItem, CourseType, Stats } from '../types';

const HomeScreen: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [refreshCount, setRefreshCount] = useState(0); // To force FlatList re-render
  const [stats, setStats] = useState<Stats>({
    totalItems: 0,
    avgStarters: '0.00',
    avgMains: '0.00',
    avgDesserts: '0.00',
  });

  // Load menu items on mount
  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async (): Promise<void> => {
    try {
      const storedItems = await AsyncStorage.getItem('menuItems');
      if (storedItems) {
        setMenuItems(JSON.parse(storedItems));
        console.log('Loaded menuItems:', JSON.parse(storedItems));
      } else {
        // initialize with default items if none exist
        const initialItems: MenuItem[] = [
          {
            id: generateId(),
            name: 'Sample Dish',
            description: 'Sample description',
            course: 'Starters',
            price: '10.00',
          },
        ];
        setMenuItems(initialItems);
        await AsyncStorage.setItem('menuItems', JSON.stringify(initialItems));
        console.log('Initialized with default items');
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  const generateId = (): string =>
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Calculate stats whenever menuItems change
  useEffect(() => {
    const calculateStats = (): void => {
      const total = menuItems.length;
      const starters = menuItems.filter((item) => item.course === 'Starters');
      const mains = menuItems.filter((item) => item.course === 'Mains');
      const desserts = menuItems.filter((item) => item.course === 'Desserts');

      const avgStarters =
        starters.length > 0
          ? starters.reduce((sum, item) => sum + parseFloat(item.price), 0) / starters.length
          : 0;
      const avgMains =
        mains.length > 0
          ? mains.reduce((sum, item) => sum + parseFloat(item.price), 0) / mains.length
          : 0;
      const avgDesserts =
        desserts.length > 0
          ? desserts.reduce((sum, item) => sum + parseFloat(item.price), 0) / desserts.length
          : 0;

      setStats({
        totalItems: total,
        avgStarters: avgStarters.toFixed(2),
        avgMains: avgMains.toFixed(2),
        avgDesserts: avgDesserts.toFixed(2),
      });
    };

    calculateStats();
  }, [menuItems]);

  // Delete functions
  const deleteMenuItem = (id: string): void => {
    console.log('deleteMenuItem called for id:', id);
    Alert.alert(
      'Delete Menu Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(id),
        },
      ]
    );
  };

  const confirmDelete = async (id: string): Promise<void> => {
    console.log('confirmDelete for id:', id);
    try {
      const updatedItems = menuItems.filter((item) => item.id !== id);
      setMenuItems(updatedItems);
      setRefreshCount(prev => prev + 1); // force FlatList re-render
      await AsyncStorage.setItem('menuItems', JSON.stringify(updatedItems));
      console.log('Item deleted, state updated:', updatedItems);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      Alert.alert('Error', 'Failed to delete menu item');
    }
  };

  const getCourseColor = (course: CourseType): string => {
    switch (course) {
      case 'Starters':
        return '#3498db';
      case 'Mains':
        return '#e67e22';
      case 'Desserts':
        return '#9b59b6';
      default:
        return '#95a5a6';
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

          {/* Stats */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Menu Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{menuItems.length}</Text>
                <Text style={styles.statLabel}>Total Items</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>${stats.avgStarters}</Text>
                <Text style={styles.statLabel}>Avg. Starter</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>${stats.avgMains}</Text>
                <Text style={styles.statLabel}>Avg. Main</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>${stats.avgDesserts}</Text>
                <Text style={styles.statLabel}>Avg. Dessert</Text>
              </View>
            </View>
          </View>

          {/* Menu Items */}
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
                extraData={refreshCount} // <-- ensure list updates
                renderItem={({ item }) => {
                  const badgeStyle = {
                    ...styles.courseBadge,
                    backgroundColor: getCourseColor(item.course),
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
                keyExtractor={(item) => item.id}
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

  // Stats styles
  statsSection: { marginHorizontal: 15, marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 15 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '48%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  statLabel: { fontSize: 12, color: '#7f8c8d', marginTop: 5 },

  // Menu styles
  menuSection: { marginHorizontal: 15, flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  itemCount: { color: '#7f8c8d', fontSize: 14 },
  menuItem: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  menuItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  dishName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', flex: 1, marginRight: 10 },
  courseBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  courseText: { color: 'white', fontSize: 12, fontWeight: '500' },
  description: { color: '#7f8c8d', fontSize: 14, lineHeight: 20, marginBottom: 10 },
  menuItemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  deleteButtonText: { color: '#e74c3c', fontSize: 14, fontWeight: '500' },

  // Empty state styles
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 18, color: '#7f8c8d', marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: '#bdc3c7', textAlign: 'center' },
});

export default HomeScreen;