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
                .select('post_id, posts(*)')
                .eq('saved_by', currentUserId);

            if (error) throw new Error("Error fetching saved posts: " + error.message);

            console.log("Fetched data:", data);

            // Fetch public URLs for images using getPublicUrl
            const postsWithUrls = data.map(item => {
                const publicUrl = supabase.storage
                    .from("uploads")
                    .getPublicUrl(item.posts.file).data.publicUrl;

                return { ...item.posts, imageUrl: publicUrl };
            });

            setSavedPosts(postsWithUrls);
        } catch (err) {
            console.error(err.message);
            alert("Failed to fetch saved posts. Please try again.");
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    useEffect(() => {
        console.log("Updated savedPosts:", savedPosts);
    }, [savedPosts]);

    const renderPost = ({ item }) => {
        console.log("Post Image URL:", item.imageUrl);
        return (
            <TouchableOpacity
                style={[styles.postContainer, { backgroundColor: theme.card }]}
                onPress={() => navigation.navigate('PostDetail',  { post: { ...item, image: item.imageUrl } })}
            >
                <Image
                    source={{ uri: item.imageUrl }}
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
        marginBottom: 15,
    },
    postContainer: {
        width: (Dimensions.get('window').width - 30) / 3,
        borderRadius: 10,
        overflow: 'hidden',
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    postImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
});
