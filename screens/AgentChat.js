import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


const AgentChat = ({ navigation }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Mock data for demonstration
  const notifications = [
    { id: 1, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis."},
    { id: 2, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis."},
    { id: 3, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis."},
    { id: 4, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis."},
    { id: 5, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis." },
    { id: 6, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis." },
    { id: 7, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis."},
    { id: 8, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis."},
    { id: 9, name: "Mahele", review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lorem nam purus vulputate quis."},

    // Add more notifications here
  ];




  return (

    <View style={styles.container}>
    <ScrollView style={styles.content}>
      <TouchableOpacity style={styles.menuIcon} onPress={toggleNavbar}>
        <FontAwesome name={isCollapsed ? 'bars' : 'times'} size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Chats</Text>

      <View style={styles.container}>




      <ScrollView style={styles.list}>
        {notifications.map(notification => (
          <View key={notification.id} style={styles.entry}>
          <Image source={{ uri: 'https://picsum.photos/400/600?image=1' }} style={styles.image} />
          <View style={styles.infoContainer}>
              <Text style={styles.name}>{notification.name}</Text>
              <Text style={styles.review}>{notification.review}</Text>
            
            </View>
            <TouchableOpacity onPress={() => console.log("Close notification")}>
              <Text style={{fontSize: 18, color: '#888'}}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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

  name: {
    fontWeight: 'bold',
    fontSize: 16
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    width: '80%',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom:10
  },


  buttonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold'
  },
 
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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
  },
  list: {
    flex: 1,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  review: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AgentChat;
