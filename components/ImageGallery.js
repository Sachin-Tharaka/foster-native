import React from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ImageGallery = ({ images, onImagePress }) => {
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => onImagePress(item)}>
        <Image source={item.source} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`}
        numColumns={2} // Number of columns in the grid
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 150, 
    height: 150, 
    margin: 5,
  },
});

export default ImageGallery;
