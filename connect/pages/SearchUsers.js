import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../supabase";

const SearchUsers = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchUsers = async (query) => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, username, full_name")
        .ilike("username", `%${query}%`); 

      if (error) {
        console.error("Error searching users:", error.message);
        return;
      }

      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching user suggestions:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    searchUsers(text);
  };

  const handleUserSelect = (userId) => {
    setSearchQuery(""); 
    setSuggestions([]);   
    navigation.navigate("Profile", { userId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={() => handleUserSelect(item.user_id)}>
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.fullName}>{item.full_name || "No name provided"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for users..."
        value={searchQuery}
        onChangeText={handleSearchChange}
      />

      {isLoading && <ActivityIndicator size="small" color="#0000ff" />}

      <FlatList
        data={suggestions}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
        ListEmptyComponent={
          !isLoading && searchQuery.length > 0 ? (
            <Text style={styles.noResultsText}>No users found</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fullName: {
    fontSize: 14,
    color: "gray",
  },
  noResultsText: {
    textAlign: "center",
    color: "gray",
    marginTop: 20,
  },
});

export default SearchUsers;