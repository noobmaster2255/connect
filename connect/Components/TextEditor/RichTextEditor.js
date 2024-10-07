import { StyleSheet, Text,TextInput, View } from 'react-native'
import React from 'react'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'

export default function RichTextEditor({editorRef, onChange, }){
  return (
    <View style={{minHeight:350, gap:20}}>
          {/* <RichToolbar
              actions={[
                  actions.insertImage,
                  actions.setBold,
                  actions.setItalic,
                  actions.insertBulletsList,
                  actions.insertOrderedList,
                  actions.insertLink,
                  actions.keyboard,
                  actions.setStrikethrough,
                  actions.setUnderline,
                  actions.removeFormat,
                  actions.insertVideo,
                  actions.checkboxList,
                  actions.undo,
                  actions.redo
              ]}
              style={styles.bar}
              flatContainerStyle={styles.listStyle}
              selectedIconTint={'#FF9567'}
              editor={editorRef}
              disabled={false}
        />
        <RichEditor
            ref={editorRef}
            containerStyle={styles.editor}
            editorStyle={styles.content}
            placeholder='Whats on your mind?'
            onChange={onChange}
        /> */}
        <TextInput
        ref={editorRef}
        value={editorRef}
        style={styles.editor}
        multiline
        numberOfLines={4}
        onChangeText={onChange}
        placeholder="What's on your mind?"
        textAlignVertical="top"
      />
    </View>
  )
}

const styles = StyleSheet.create({
    bar:{
        // backgroundColor:'grey',
        // color:'white',
        marginTop:20,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        
    },
    editor:{
        minHeight:240,
        flex:1,
        marginTop:30,
        borderWidth:1.5,
        // borderTopWidth:0,
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
        borderColor:'#FF9567',
        padding:20
    },
    listStyle:{
        paddingHorizontal: 8,
        gap:5
    }
})



