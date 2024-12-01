import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal } from 'react-native';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import RenderHTML from 'react-native-render-html';
import moment from 'moment';
import { getSupabaseFileUrl } from '../postService';
import { Video } from 'expo-av';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useWindowDimensions } from 'react-native';
import { supabase } from '../../supabase';
import CommentOverlay from '../CommentOverlay/CommentOverlay';
import { addLike, removeLike } from '../postService';

const textStyles = {
    color: '#000',
    fontSize: 16,
};

const tagsStyles = {
    div: textStyles,
    p: textStyles,
    ol: textStyles,
    h1: {
        color: '#000',
    },
    h4: {
        color: '#000',
    },
};

const PostCard = ({ item, currentUser, hasShadow = true }) => {
    const shadowStyle = {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    };

    const createdAt = moment(item?.created_At).format('MMM D');
    const [likesCount, setLikesCount] = useState("");
    const [commentsCount, setCommentCount] = useState(0);
    const [userLiked, setIsUserLiked] = useState(false);
    const [isCommentVisible, setIsCommentVisible] = useState(false);
    const [isReportVisible, setIsReportVisible] = useState(false);

    const { width: contentWidth } = useWindowDimensions();

    const fetchCommentsCount = async (postId) => {
        const { count, error } = await supabase
            .from("comments")
            .select("id", { count: "exact", head: true })
            .eq("post_id", postId);
        if (error) {
            console.error("Error fetching comments count:", error.message);
            return 0;
        }
        setCommentCount(count);
    };

    const fetchLikesCount = async (postId) => {
        const { count, error } = await supabase
            .from("post_likes")
            .select("id", { count: "exact", head: true })
            .eq("post_id", postId);
        if (error) {
            console.error("Error fetching likes count:", error.message);
            return 0;
        }
        setLikesCount(count);
    };

    const fetchUserLiked = async (postId) => {
        const sessionData = await supabase.auth.getSession();
        const { count } = await supabase
            .from("post_likes")
            .select("id", { count: "exact" })
            .eq("post_id", postId)
            .eq("userId", sessionData.data.session.user.id);
        setIsUserLiked(count > 0);
    };

    const Icon = () => {
        if (userLiked) {
            return <Ionicons name="heart" size={20} color={"red"} />;
        } else {
            return <Ionicons name="heart-outline" size={20} color={"black"} />;
        }
    };

    const handleComment = () => {
        setIsCommentVisible((previous) => !previous);
    };

    const handleReport = () => {
        setIsReportVisible(true);
    };

    useEffect(() => {
        fetchLikesCount(item.id);
        fetchCommentsCount(item.id);
        fetchUserLiked(item.id);

        const subscription = supabase
            .channel("comments-count-channel")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "comments", filter: `post_id=eq.${item.id}` },
                () => {
                    setCommentCount((prevCount) => prevCount + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [item.id]);

    return (
        <View style={[styles.container, hasShadow && shadowStyle]}>
            <View style={styles.header}>
                <FontAwesome name="user-circle" size={40} color="#FF9567" />
                <View style={{ gap: 2 }}>
                    <Text style={styles.userName}>
                        {item.user && item?.user?.username}
                    </Text>
                    <Text style={styles.subHeading}>{createdAt}</Text>
                </View>
            </View>
            <View style={styles.content}>
                {item?.body && (
                    <RenderHTML
                        contentWidth={contentWidth}
                        source={{ html: item?.body }}
                        tagsStyles={tagsStyles}
                    />
                )}
                {item?.file && item?.file.includes('postImages') && (
                    <Image
                        source={getSupabaseFileUrl(item?.file)}
                        transition={100}
                        style={styles.postMedia}
                        contentFit='cover'
                    />
                )}
                {item?.file && item?.file.includes('postVideos') && (
                    <Video
                        style={styles.postMedia}
                        source={getSupabaseFileUrl(item?.file)}
                        useNativeControls
                        resizeMode='cover'
                        isLooping
                    />
                )}
                <View style={styles.footer}>
                    <View style={styles.footerButton}>
                        <TouchableOpacity onPress={() => {
                            if (userLiked) {
                                removeLike(item.id);
                                setLikesCount((previousCount) => previousCount - 1);
                                setIsUserLiked(false);
                            } else {
                                addLike(item.id);
                                setLikesCount((previousCount) => previousCount + 1);
                                setIsUserLiked(true);
                            }
                        }}>
                            {Icon()}
                        </TouchableOpacity>
                        <Text style={styles.count}>{likesCount}</Text>
                    </View>
                    <View style={styles.footerButton}>
                        <TouchableOpacity onPress={handleComment}>
                            <Ionicons name="chatbubble-outline" size={20} color={"black"} />
                        </TouchableOpacity>
                        <Text style={styles.count}>{commentsCount}</Text>
                    </View>
                    <View style={styles.footerButton}>
                        <TouchableOpacity onPress={handleReport}>
                            <FontAwesome5 name="exclamation-circle" size={18} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <CommentOverlay visible={isCommentVisible} onClose={() => { setIsCommentVisible(false); fetchCommentsCount(item.id) }} postId={item.id} />
            <Modal
                transparent={true}
                visible={isReportVisible}
                animationType="slide"
                onRequestClose={() => setIsReportVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Report Post</Text>
                        <TouchableOpacity onPress={() => {/* Handle reporting logic */}}>
                            <Text style={styles.modalOption}>Spam</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {/* Handle reporting logic */}}>
                            <Text style={styles.modalOption}>Inappropriate Content</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setIsReportVisible(false)}>
                            <Text style={styles.modalCancel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    container: {
        width: 370,
        marginBottom: 20,
        borderRadius: 20,
        padding: 15,
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'gray',
        shadowColor: '#000',
        alignSelf: 'center',
        gap: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    subHeading: {
        color: 'grey',
        fontSize: 12,
        marginTop: 2,
    },
    postMedia: {
        marginTop: 10,
        height: 300,
        width: '100%',
        borderRadius: 20,
        borderCurve: 'continuous',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        marginTop: 10,
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    count: {
        marginLeft: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalOption: {
        fontSize: 16,
        marginVertical: 10,
        color: '#007BFF',
    },
    modalCancel: {
        fontSize: 16,
        color: 'red',
        marginTop: 15,
    },
});
