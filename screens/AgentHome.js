import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const AgentHome = ({ navigation }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.menuIcon} onPress={toggleNavbar}>
          <FontAwesome name={isCollapsed ? 'bars' : 'times'} size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.header}>Home</Text>

        <View style={styles.user_header}>
        <Image source={{ uri: 'https://picsum.photos/400/600?image=1' }} style={styles.logo} />
  
          <Text style={styles.title}>Nipuni Perera</Text>
          <Text style={styles.location}>Kotikawaththa</Text>
        </View>

        <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Change Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Ongoing Orders</Text>
        </TouchableOpacity>
    
      </View>

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  location: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  user_header: {
    alignItems: 'center',
    marginTop: 20,
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
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom:10
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
    color: 'white',
    fontWeight: 'bold'
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

export default AgentHome;
