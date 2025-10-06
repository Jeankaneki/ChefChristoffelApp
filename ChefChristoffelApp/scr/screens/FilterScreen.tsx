import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// Correct path from './screens' up one level to './' then into 'types'
import { MenuItem, CourseType } from '../types';

interface FilterOption {
  key: string;
  label: string;
}

const FilterScreen: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filters: FilterOption[] = [
    { key: 'All', label: 'All Items' },
    { key: 'Starters', label: 'Starters' },
    { key: 'Mains', label: 'Main Courses' },
    { key: 'Desserts', label: 'Desserts' },
  ];

  const loadMenuItems = async (): Promise<void> => {
    try {
      const storedItems = await AsyncStorage.getItem('menuItems');
      setMenuItems(storedItems ? JSON.parse(storedItems) : []);
    } catch (error) {
      console.error('Error loading menu items:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMenuItems();
    }, [])
  );

  useEffect(() => {
    if (selectedFilter === 'All') {
      setFilteredItems(menuItems);
    } else {
      const filtered = menuItems.filter(
        item => item.course === selectedFilter
      );
      setFilteredItems(filtered);
    }
  }, [selectedFilter, menuItems]);

  const getCourseColor = (course: CourseType): string => {
    switch (course) {
      case 'Starters': return '#3498db';
      case 'Mains': return '#e67e22';
      case 'Desserts': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }): React.JSX.Element => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.dishName}>{item.name}</Text>
        <View style={[ styles.courseBadge, { backgroundColor: getCourseColor(item.course) } ]}>
          <Text style={styles.courseText}>{item.course}</Text>
        </View>
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.menuItemFooter}>
        <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filter Menu</Text>
        <Text style={styles.headerSubtitle}>Browse dishes by course</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.filterSection}>
          <View style={styles.filterButtons}>
            {filters.map(filter => (
              <TouchableOpacity
                key={filter.key}
                style={[ styles.filterButton, selectedFilter === filter.key && styles.filterButtonActive ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[ styles.filterButtonText, selectedFilter === filter.key && styles.filterButtonTextActive ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <FlatList
          data={filteredItems}
          renderItem={renderMenuItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              Showing {filteredItems.length} of {menuItems.length} items
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                {selectedFilter === 'All'
                  ? 'No menu items yet'
                  : `No ${selectedFilter.toLowerCase()} found`}
              </Text>
              <Text style={styles.emptySubtext}>
                {selectedFilter === 'All'
                  ? 'Add some delicious dishes to get started!'
                  : 'Try a different filter or add new items'}
              </Text>
            </View>
          }
          contentContainerStyle={styles.menuList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { backgroundColor: '#2c3e50', padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  headerSubtitle: { fontSize: 14, color: '#ecf0f1', textAlign: 'center', marginTop: 5 },
  content: { flex: 1, padding: 15 },
  filterSection: { marginBottom: 20 },
  filterButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filterButton: { flex: 1, minWidth: '48%', backgroundColor: '#ecf0f1', padding: 15, borderRadius: 8, alignItems: 'center' },
  filterButtonActive: { backgroundColor: '#3498db' },
  filterButtonText: { fontSize: 14, fontWeight: '500', color: '#7f8c8d' },
  filterButtonTextActive: { color: 'white' },
  resultsCount: { color: '#7f8c8d', fontSize: 14, fontStyle: 'italic', textAlign: 'center', marginBottom: 20, },
  menuList: { flexGrow: 1 },
  menuItem: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  menuItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  dishName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', flex: 1, marginRight: 10 },
  courseBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  courseText: { color: 'white', fontSize: 12, fontWeight: '500' },
  description: { color: '#7f8c8d', fontSize: 14, lineHeight: 20, marginBottom: 10 },
  menuItemFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: 'bold', color: '#27ae60' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, flex: 1 },
  emptyText: { fontSize: 18, color: '#7f8c8d', marginTop: 15, marginBottom: 5 },
  emptySubtext: { fontSize: 14, color: '#bdc3c7', textAlign: 'center' },
});

export default FilterScreen;
