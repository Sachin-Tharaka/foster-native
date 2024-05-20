import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {

    const navigation = useNavigation();

    const handleHome = () => {
         navigation.navigate('BookingHouse');
      };
      
      const handleNotifications = () => {
        navigation.navigate('NotificationScreen');
      };
      
      const handleAccount = () => {
        navigation.navigate('UserAccount');
      };
      
      const handleGallery = () => {
        navigation.navigate('Home');
      };
      
      return (
        <View style={styles.navBar}>
      <TouchableOpacity onPress={handleHome} style={styles.iconContainer}>
        <Icon name="home" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNotifications} style={styles.iconContainer}>
        <Icon name="bell" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAccount} style={styles.iconContainer}>
        <Icon name="user-circle" size={24} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGallery} style={styles.iconContainer}>
        <Icon name="navicon" size={24} color="#333" />
      </TouchableOpacity>
    </View>
      );
  };
  
  const styles = StyleSheet.create({
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#fff',
      height: 60,
      paddingHorizontal: 16, 
      width: '100%', // Make the navigation bar span the full width
    },
    iconContainer: {
      alignItems: 'center',
      marginLeft:35,
      marginRight:35
    },
  });
  
  export default Navbar;
  