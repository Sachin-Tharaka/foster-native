import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import ImageGallery from '../components/ImageGallery';
import Navbar from '../components/Navbar';

const HomeScreen = ({ navigation }) => {

  const [searchText, setSearchText] = useState('');

  // Dummy images
  const images = Array.from({ length: 10 }).map((_, index) => ({
    source: {
      uri: `https://picsum.photos/400/600?image=${index + 1}`,
    },
  }));

  // Handle search function
  const handleSearch = () => {
    // Implement search functionality here
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foster Pet Gallery</Text>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <Text>All results</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Display the image gallery */}
        <ImageGallery images={images} />
      </ScrollView>
      <View>
        
        <Navbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:30,
    marginHorizontal:10
    
  },
  contentContainer: {
    // flexGrow: 1,
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 10,
    marginTop:10
  },

  
});

export default HomeScreen;
