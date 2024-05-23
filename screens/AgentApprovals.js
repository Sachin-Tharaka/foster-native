import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const AgentApprovals = ({ navigation }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Mock data similar to what's seen in the screenshot
  const data = [
    { id: '1', name: 'Nipuni Perera', role: 'Kennel', detail: 'Test data' },
    { id: '2', name: 'Isuru Malikshara', role: 'Volunteer', detail: 'Test data' },
    { id: '3', name: 'Isuru Malikshara', role: 'Volunteer', detail: 'Test data' },
    { id: '4', name: 'Isuru Malikshara', role: 'Volunteer', detail: 'Test data' }
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
    <Image source={{ uri: 'https://picsum.photos/400/600?image=1' }} style={styles.profilePic} />
    <View style={styles.detailContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <Text style={styles.detail}>{item.detail}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall}>
          <Text style={styles.buttonText}>Cancel Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmallBlue}>
          <Text style={styles.buttonTextWhite}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleNavbar}>
          <FontAwesome name={isCollapsed ? 'bars' : 'times'} size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.header}>Orders</Text>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
      
      {!isCollapsed && (
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.closeIcon} onPress={toggleNavbar}>
            <FontAwesome name="times" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.navItem} onPress={() => navigation.navigate('AgentHome')}>Home</Text>
          <Text style={styles.navItem} onPress={() => navigation.navigate('AgentApprovals')}>Bookings</Text>
          <Text style={styles.navItem} onPress={() => navigation.navigate('AgentChat')}>Chats</Text>
          <Text style={styles.navItem} onPress={() => navigation.navigate('AgentWallet')}>Wallet</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:60

  },
  content: {
    flex: 1,
    padding: 20,

  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',

  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10
  },
  detailContainer: {
    flex: 1
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  role: {
    fontSize: 14,
    color: '#666'
  },
  detail: {
    fontSize: 12,
    color: '#999'
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  buttonSmall: {
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5
  },
  buttonSmallBlue: {
    backgroundColor: '#007BFF',
    padding: 8,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 12,
  },
  buttonTextWhite: {
    fontSize: 12,
    color: '#FFF'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50  // Add margin to avoid overlap with the menu icon
  },
  sidebar: {
    position: 'absolute',
    width: 200,
    height: '100%',
    backgroundColor: '#2C3E50',
    paddingTop: 20,
    left: 0,
    top: 0
  },
  navItem: {
    padding: 10,
    color: 'white',
    fontWeight: 'bold'
  },
  menuIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2
  }
});

export default AgentApprovals;
