import React, { useState, useEffect, useContext } from 'react';
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../supabase';
import themeContext from '../theme/themeContext';

const SavedPosts = ({ navigation }) => {
    const [savedPosts, setSavedPosts] = useState([]);
    const theme = useContext(themeContext);
    const screenWidth = Dimensions.get('window').width;

    const fetchSavedPosts = async () => {
        try {
            const sessionData = await supabase.auth.getSession();
            const currentUserId = sessionData.data.session.user.id;

            const { data, error } = await supabase
                .from('saved_posts')
                .select('post_id, posts(*)') // Fetch associated post details
                .eq('saved_by', currentUserId);

            if (error) throw new Error("Error fetching saved posts: " + error.message);

            console.log("Fetched data:", data);  // Log fetched data

            // Fetch public URLs for images using getPublicUrl
            const postsWithUrls = data.map(item => {
                const publicUrl = supabase.storage
                    .from("uploads")  // Replace 'your_bucket_name' with your actual bucket name
                    .getPublicUrl(item.posts.file).data.publicUrl;  // Assuming the image field is 'file'

                return { ...item.posts, imageUrl: publicUrl }; // Add imageUrl to post
            });

            setSavedPosts(postsWithUrls); // Store posts with URLs in state
        } catch (err) {
            console.error(err.message);
            alert("Failed to fetch saved posts. Please try again.");
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    useEffect(() => {
        console.log("Updated savedPosts:", savedPosts); // Log savedPosts when it changes
    }, [savedPosts]);

    const renderPost = ({ item }) => {
        console.log("Post Image URL:", item.imageUrl);  // Log the image URL
        return (
            <TouchableOpacity
                style={[styles.postContainer, { backgroundColor: theme.card }]}
                onPress={() => navigation.navigate('PostDetail',  { post: { ...item, image: item.imageUrl } })}
            >
                <Image
                    source={{ uri: item.imageUrl }}  // Use the public URL for the image
                    style={styles.postImage}
                    contentFit="cover"
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={savedPosts}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                renderItem={renderPost}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.columnWrapper}
            />
        </View>
    );
};

export default SavedPosts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    grid: {
        paddingVertical: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    postContainer: {
        width: (Dimensions.get('window').width / 2) - 15, // Two columns with spacing
        borderRadius: 10,
        overflow: 'hidden',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },
});
