import React from "react";
import { View, Image, FlatList, StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3 - 2;

const ImageGrid = ({ images }) => {
  return (
    <FlatList
      data={images}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item }} style={styles.image} />
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      numColumns={3} 
      contentContainerStyle={styles.grid}
    />
  );
};

const styles = StyleSheet.create({
  grid: {
    padding: 1, 
  },
  imageContainer: {
    margin: 1, 
  },
  image: {
    width: imageSize,
    height: imageSize,
    resizeMode: "cover",
  },
});

export default ImageGrid;
