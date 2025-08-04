import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PricingManagementScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('Routes');
  const [editingPrice, setEditingPrice] = useState(null);
  
  // Initialize dynamic styles using the current theme
  const styles = useMemo(() => createStyles(colors, isDarkMode), [colors, isDarkMode]);


  // Mock data for route pricing
  const [routePrices, setRoutePrices] = useState([
    {
      id: '1',
      from: 'Central Station',
      to: 'North Terminal',
      basePrice: 12.50,
      peakHourSurcharge: 3.00,
      discountPercentage: 0
    },
    {
      id: '2',
      from: 'Central Station',
      to: 'East Hub',
      basePrice: 8.00,
      peakHourSurcharge: 2.00,
      discountPercentage: 0
    },
    {
      id: '3',
      from: 'East Hub',
      to: 'North Terminal',
      basePrice: 6.50,
      peakHourSurcharge: 1.50,
      discountPercentage: 0
    },
    {
      id: '4',
      from: 'Central Station',
      to: 'West Junction',
      basePrice: 10.00,
      peakHourSurcharge: 2.50,
      discountPercentage: 5
    },
  ]);

  // Mock data for special pricing
  const [specialPrices, setSpecialPrices] = useState([
    {
      id: '1',
      name: 'Weekend Pass',
      description: 'Unlimited travel on weekends',
      price: 25.00,
      validityPeriod: '48 hours',
      active: true
    },
    {
      id: '2',
      name: 'Monthly Pass',
      description: 'Unlimited travel for 30 days',
      price: 150.00,
      validityPeriod: '30 days',
      active: true
    },
    {
      id: '3',
      name: 'Holiday Special',
      description: '50% off during holidays',
      price: 'Variable',
      validityPeriod: 'Specific holidays',
      active: false
    }
  ]);

  // Handle editing a route price
  const handleEditRoutePrice = (price) => {
    setEditingPrice({ ...price });
  };

  const handleUpdatePrice = () => {
    if (!editingPrice) return;

    const updatedPrices = routePrices.map(p => 
      p.id === editingPrice.id ? editingPrice : p
    );
    
    setRoutePrices(updatedPrices);
    setEditingPrice(null);
  };

  const renderEditModal = () => {
    if (!editingPrice) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!editingPrice}
        onRequestClose={() => setEditingPrice(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Price</Text>
            <Text style={styles.modalSubtitle}>{`${editingPrice.from} to ${editingPrice.to}`}</Text>
            
            <View style={styles.inputContainer}>
              <Text>Base Price ($):</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={editingPrice.basePrice.toString()}
                onChangeText={(text) => {
                  const newPrice = parseFloat(text) || 0;
                  setEditingPrice(prev => ({ ...prev, basePrice: newPrice }));
                }}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setEditingPrice(null)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleUpdatePrice}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Add a new route price
  const handleAddRoutePrice = () => {
    Alert.alert(
      'Add New Route Price',
      'This would open a form to add a new route price'
    );
    // In a real app, this would open a modal with a form
  };

  // Toggle special price active status
  const toggleSpecialPrice = (id) => {
    const updatedPrices = specialPrices.map(price => 
      price.id === id ? { ...price, active: !price.active } : price
    );
    setSpecialPrices(updatedPrices);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? colors.backgroundDark : colors.backgroundLight }]}>
      {renderEditModal()}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pricing Management</Text>
        <Text style={styles.headerSubtitle}>Set and manage ticket prices</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Routes' && styles.activeTab]}
          onPress={() => setActiveTab('Routes')}
        >
          <Text style={[styles.tabText, activeTab === 'Routes' && styles.activeTabText]}>Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'Special' && styles.activeTab]}
          onPress={() => setActiveTab('Special')}
        >
          <Text style={[styles.tabText, activeTab === 'Special' && styles.activeTabText]}>Special</Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'Routes' ? (
        <View style={styles.contentContainer}>
          <View style={styles.actionBar}>
            <Text style={styles.sectionTitle}>Route Pricing</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddRoutePrice}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Route</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.pricesList}>
            {/* Route Pricing Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>Route</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Base Price</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Peak Hour</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Discount</Text>
              <Text style={[styles.tableHeaderText, { width: 50 }]}></Text>
            </View>
            
            {routePrices.map((price) => (
              <View key={price.id} style={styles.priceRow}>
                <View style={{ flex: 2 }}>
                  <Text style={styles.routeName}>{price.from}</Text>
                  <Text style={styles.routeName}>to {price.to}</Text>
                </View>
                <Text style={[styles.priceValue, { flex: 1 }]}>${price.basePrice.toFixed(2)}</Text>
                <Text style={[styles.priceValue, { flex: 1 }]}>+${price.peakHourSurcharge.toFixed(2)}</Text>
                <Text style={[styles.priceValue, { flex: 1 }]}>
                  {price.discountPercentage > 0 ? `-${price.discountPercentage}%` : '--'}
                </Text>
                <TouchableOpacity 
                  style={[styles.editButton, { width: 50 }]}
                  onPress={() => handleEditRoutePrice(price)}
                >
                  <Ionicons name="create-outline" size={20} color="#3498db" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color="#3498db" style={{ marginRight: 10 }} />
            <Text style={styles.infoText}>
              Base prices are automatically adjusted based on demand and weather conditions.
              Peak hour surcharges apply from 7-9 AM and 5-7 PM on weekdays.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.actionBar}>
            <Text style={styles.sectionTitle}>Special Passes</Text>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Pass</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.pricesList}>
            {specialPrices.map((price) => (
              <View key={price.id} style={styles.specialPassCard}>
                <View style={styles.passHeader}>
                  <Text style={styles.passName}>{price.name}</Text>
                  <TouchableOpacity
                    style={[
                      styles.toggleButton,
                      price.active ? styles.activeToggle : styles.inactiveToggle
                    ]}
                    onPress={() => toggleSpecialPrice(price.id)}
                  >
                    <Text style={styles.toggleText}>
                      {price.active ? 'Active' : 'Inactive'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.passDetails}>
                  <Text style={styles.passDescription}>{price.description}</Text>
                  <View style={styles.passRow}>
                    <View style={styles.passDetail}>
                      <Text style={styles.detailLabel}>Price</Text>
                      <Text style={styles.detailValue}>
                        {typeof price.price === 'number' ? `$${price.price.toFixed(2)}` : price.price}
                      </Text>
                    </View>
                    <View style={styles.passDetail}>
                      <Text style={styles.detailLabel}>Validity</Text>
                      <Text style={styles.detailValue}>{price.validityPeriod}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.passActions}>
                  <TouchableOpacity style={styles.passActionButton}>
                    <Ionicons name="create-outline" size={20} color="#3498db" />
                    <Text style={[styles.actionText, { color: '#3498db' }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.passActionButton}>
                    <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                    <Text style={[styles.actionText, { color: '#e74c3c' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
};

// Create dynamic styles that use theme colors
const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: isDarkMode ? colors.cardDark : '#2c3e50',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLightSecondary,
    marginTop: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: isDarkMode ? colors.cardDark : '#fff',
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.2 : 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontWeight: 'bold',
    color: isDarkMode ? colors.textLightSecondary : '#7f8c8d',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    margin: 15,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDarkMode ? colors.textLight : '#2c3e50',
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
  pricesList: {
    flex: 1,
    backgroundColor: isDarkMode ? colors.cardDark : '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    shadowColor: isDarkMode ? '#000' : '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: isDarkMode ? 0.2 : 0.1,
    shadowRadius: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? colors.borderDark : '#ecf0f1',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: isDarkMode ? colors.textLightSecondary : '#7f8c8d',
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? colors.borderDark : '#ecf0f1',
  },
  routeName: {
    color: isDarkMode ? colors.textLight : '#2c3e50',
  },
  priceValue: {
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    color: '#2c3e50',
    fontSize: 12,
  },
  specialPassCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  passName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  toggleButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  activeToggle: {
    backgroundColor: '#e9f7ef',
  },
  inactiveToggle: {
    backgroundColor: '#f2f3f4',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  passDetails: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  passDescription: {
    color: '#7f8c8d',
    marginBottom: 10,
  },
  passRow: {
    flexDirection: 'row',
  },
  passDetail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  detailValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5,
  },
  passActions: {
    flexDirection: 'row',
    padding: 10,
  },
  passActionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  actionText: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default PricingManagementScreen;
