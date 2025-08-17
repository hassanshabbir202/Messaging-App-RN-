import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MessageBubble = ({ message }) => {
  const renderMessageContent = () => {
    if (message.type === 'text') {
      return <Text style={styles.messageText}>{message.content}</Text>;
    }
    return null;
  };

  return (
    <View style={styles.messageBubble}>
      {renderMessageContent()}
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{message.time}</Text>
        <Ionicons name="checkmark-done" size={16} color="#53bdeb" />
      </View>
    </View>
  );
};

export default function ChatHistoryScreen({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  const { userName, userAvatar } = route.params;

  const handleSend = () => {
    if (inputText.trim() === '') {
      return;
    }

    const newMessage = {
      id: Date.now().toString(),
      type: 'text',
      content: inputText.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{userName}</Text>
        </View>
        <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
      </View>

      <ImageBackground
        source={{
          uri: 'https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg',
        }}
        style={styles.chatArea}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollView}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              <MaterialCommunityIcons name="lock" size={13} color="#54656f" />{' '}
              Messages are end-to-end encrypted. No one outside of this chat can
              read them.
            </Text>
          </View>

          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </ScrollView>
      </ImageBackground>

      <View style={styles.inputContainer}>
        <View style={styles.inputBox}>
          <MaterialCommunityIcons
            name="emoticon-outline"
            size={24}
            color="#54656f"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Message"
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
          />
          <MaterialCommunityIcons
            name="paperclip"
            size={24}
            color="#54656f"
            style={styles.inputIcon}
          />
          <Ionicons
            name="camera"
            size={24}
            color="#54656f"
            style={styles.inputIcon}
          />
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
          {inputText.trim() !== '' ? (
            <MaterialCommunityIcons name="send" size={24} color="white" />
          ) : (
            <MaterialCommunityIcons name="microphone" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ECE5DD' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    paddingVertical: 10,
    paddingHorizontal: 12,
    elevation: 3,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  headerText: { flex: 1 },
  headerName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  chatArea: { flex: 1 },
  scrollView: { padding: 10, paddingBottom: 20 },
  noticeBox: {
    backgroundColor: '#FEFDEA',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: 'center',
    width: '95%',
  },
  noticeText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#54656f',
    lineHeight: 18,
  },
  messageBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    maxWidth: '80%',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  messageText: { fontSize: 16, color: '#111b21' },
  timeContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginTop: 5,
  },
  timeText: { fontSize: 11, color: '#667781', marginRight: 5 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#ECE5DD',
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 5,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    marginHorizontal: 5,
  },
  inputIcon: { marginHorizontal: 8 },
  actionButton: {
    backgroundColor: '#128C7E',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
