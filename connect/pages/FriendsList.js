import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../supabase';

const FriendsList = ({ route }) => {
  const { profileId } = route.params;
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('friends')
          .select(`
            user_id_1,
            user_id_2,
            Profiles1:profiles!user_id_1(full_name, username),
            Profiles2:profiles!user_id_2(full_name, username)
          `)
          .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);
          
        if (error) throw error;

        const friendsList = data.map((friend) => {
          const isUserId1Friend = friend.user_id_1 !== userId;
          const profile = isUserId1Friend ? friend.Profiles1 : friend.Profiles2;
          return {
            id: profile.user_id,
            name: profile.full_name,
            username: profile.username,
            profilePicture: 'https://via.placeholder.com/50',
          };
        });

        setFriends(friendsList);
      } catch (error) {
        console.error('Error fetching friends:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends(profileId);
  }, [profileId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Friends...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            {/* <Image source={{ uri: item.profilePicture }} style={styles.profileImage} /> */}
            <View style={styles.infoContainer}>
              <Text style={styles.friendName}>{item.name}</Text>
              <Text style={styles.friendUsername}>@{item.username}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  listContainer: {
    paddingBottom: 20,
  },
  friendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    marginBottom: 15, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 3, 
    elevation: 2 
  },
  profileImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 15 
  },
  infoContainer: { 
    flex: 1 
  },
  friendName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  friendUsername: { 
    fontSize: 14, 
    color: '#888', 
    marginTop: 2 
  },
});

export default FriendsList;
