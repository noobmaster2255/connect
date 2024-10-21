import {StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image';
import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import RenderHtml, { RenderHTML } from 'react-native-render-html';
import { getSupabaseFileUrl } from '../postService';
import { Video } from 'expo-av';

const textStyles = {
    color:'#000',
    fontSize:16
}
const tagsStyles = {
    div: textStyles,
    p:textStyles,
    ol:textStyles,
    h1:{
        color:'#000'
    },
    h4:{
        color:'#000'
    },
}

const PostCard = ({item, currentUser, hasShadow=true}) => {

    const shadowStyle = {
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity: 0.06,
        shadowRadius:6,
        elevation:1
    }

    console.log("post item", item)

    const createdAt = moment(item?.created_At).format('MMM D');
    console.log("date item", createdAt)



  return (
    <View style={[styles.container, hasShadow && shadowStyle]}>
        <View style={styles.header}>
              <FontAwesome name="user-circle" size={40} color="#FF9567" />
                <View style={{ gap: 2 }}>
                  <Text style={styles.userName}>
                      {
                          item.user && item?.user?.username
                      }
                  </Text>
                  <View>
                      <Text style={styles.subHeading}>{createdAt}</Text>
                </View>
            </View>
        </View>
        <View style={styles.content}>
            <View style={styles.postBody}>
                {
                    item?.body && (
                        <RenderHTML
                            contentWidth={'100%'}
                            source={{html: item?.body}}
                            tagsStyles={tagsStyles}
                        />
                    )
                }
            </View>
            {
                item?.file && item?.file?.includes('postImages') && (
                    <Image
                        source={getSupabaseFileUrl(item?.file)}
                        transition={100}
                        style={styles.postMedia}
                        contentFit='cover'/>
                )
            }

            {
                item?.file && item?.file?.includes('postVideos') && (
                    <Video
                        style={styles.postMedia}
                        source={getSupabaseFileUrl(item?.file)}
                        useNativeControls
                        resizeMode='cover'
                        isLooping
                        />
                )
            }

            {
                <View style={styles.footer}>
                    <View style={styles.footerButton}>
                          <View style={styles.buttonContainer}>
                              <TouchableOpacity>
                              <FontAwesome5 name="heart" size={26} color="black" />
                              </TouchableOpacity>
                              <Text style={styles.count}>
                                  {
                                      0
                                  }
                              </Text>
                          </View>
                    </View>
                    <View style={styles.footerButton}>
                          <View style={styles.buttonContainer}>
                              <TouchableOpacity>
                              <FontAwesome5 name="comment-alt" size={24} color="black" />
                              </TouchableOpacity>
                              <Text style={styles.count}>
                                  {
                                      0
                                  }
                              </Text>
                          </View>
                    </View>
                    <View style={styles.footerButton}>
                          <View style={styles.buttonContainer}>
                              <TouchableOpacity>
                              <FontAwesome5 name="share-square" size={24} color="black" />
                              </TouchableOpacity>
                              <Text style={styles.count}>
                                  {
                                      0
                                  }
                              </Text>
                          </View>
                    </View>
                </View>
            }
        </View>
    </View>
  )
}

export default PostCard

const styles = StyleSheet.create({

    container: {
        width: 350,
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
    userInfo: {
        justifyContent: 'center',
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
    postContent: {
        marginTop: 10,
        marginBottom:10,
        fontSize: 14,
        color: '#333',
    },
    postMedia:{
        marginTop:10,
        height:300,
        width:'100%',
        borderRadius:20,
        borderCurve:'continuous'
    },
    footer:{
        flexDirection:'row',
        alignItems:'center',
        gap:15,
        marginTop:10
    },
    buttonContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:5
    }
})