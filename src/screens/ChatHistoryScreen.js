import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// --- Message Bubble Component (Updated) ---
const MessageBubble = ({ message }) => {
  const isSent = message.type === 'sent';

  const getStatusIcon = () => {
    if (!isSent) return null;
    switch (message.status) {
      case 'read': return <Ionicons name="checkmark-done" size={16} color="#34B7F1" />;
      case 'delivered': return <Ionicons name="checkmark-done" size={16} color="#667781" />;
      default: return <Ionicons name="checkmark" size={16} color="#667781" />;
    }
  };

  const renderContent = () => {
    if (message.voice) {
      return (
        <View style={styles.voiceMessageContainer}>
          <TouchableOpacity>
            <Ionicons name="play" size={28} color={isSent ? "#54656f" : "#075E54"} />
          </TouchableOpacity>
          <View style={styles.scrubber}>
            <View style={styles.scrubberLine} />
            <View style={styles.scrubberDot} />
          </View>
          <Text style={styles.voiceDuration}>{message.voice}</Text>
        </View>
      );
    }
    if (message.image) {
      return (
        <View>
          <Image source={{ uri: message.image }} style={styles.messageImage} />
          {message.text ? <Text style={[styles.messageText, styles.imageCaption]}>{message.text}</Text> : null}
        </View>
      );
    }
    return <Text style={styles.messageText}>{message.text}</Text>;
  };

  return (
    <View style={[styles.messageRow, isSent ? styles.sentRow : styles.receivedRow]}>
      <View style={[styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble]}>
        {renderContent()}
        <View style={[styles.timeContainer, (message.image && !message.text) && styles.timeContainerOnImage]}>
          <Text style={[styles.timeText, (message.image && !message.text) && styles.timeTextOnImage]}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </Text>
          {getStatusIcon()}
        </View>
      </View>
    </View>
  );
};


// --- Main Chat History Screen ---
export default function ChatHistoryScreen({ route, navigation }) {
  const { userName, userAvatar, contactId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const isFocused = useIsFocused();
  const flatListRef = useRef();

  const loadMessages = async () => {
    try {
      const chatKey = `chat_${contactId}`;
      const savedMessagesRaw = await AsyncStorage.getItem(chatKey);
      const savedMessages = savedMessagesRaw ? JSON.parse(savedMessagesRaw) : [];
      setMessages(savedMessages);
    } catch (error) {
      console.error("Failed to load messages.", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadMessages();
    }
  }, [isFocused]);

  const handleDeleteContact = async () => {
    try {
      // Delete from contacts list
      const existingContactsRaw = await AsyncStorage.getItem('my_contacts_list');
      let existingContacts = existingContactsRaw ? JSON.parse(existingContactsRaw) : [];
      const updatedContacts = existingContacts.filter(contact => contact.id !== contactId);
      await AsyncStorage.setItem('my_contacts_list', JSON.stringify(updatedContacts));
      
      // Delete chat history as well
      await AsyncStorage.removeItem(`chat_${contactId}`);

      Alert.alert('Success', `${userName} has been deleted.`);
      navigation.navigate('HomeTabs', { screen: 'Chats' });
    } catch (error) {
      console.error("Failed to delete contact.", error);
      Alert.alert('Error', 'Could not delete the contact.');
    }
  };

  const showDeleteConfirmation = () => {
    setMenuVisible(false);
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${userName}? This will also delete all messages.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteContact, style: 'destructive' },
      ]
    );
  };

  const handleEditContact = () => {
    setMenuVisible(false);
    navigation.navigate('NewContact', { contactIdToEdit: contactId });
  };

  const handleSend = () => {
    // This function now just shows an alert as per the requirement
    Alert.alert(
      "Add New Message",
      "To add a new message, please use the Chat Editor from the home screen's pencil icon.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        {userAvatar ? <Image source={{ uri: userAvatar }} style={styles.avatar} /> : <View style={styles.defaultAvatar}><Ionicons name="person" size={20} color="white"/></View>}
        <View style={styles.headerText}><Text style={styles.headerName}>{userName}</Text></View>
        <TouchableOpacity onPress={() => setMenuVisible(true)}><MaterialCommunityIcons name="dots-vertical" size={24} color="white" /></TouchableOpacity>
      </View>

      <ImageBackground
        source={{ uri: 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' }}
        style={styles.chatArea}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={styles.scrollView}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      </ImageBackground>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            <TouchableOpacity><MaterialCommunityIcons name="emoticon-outline" size={26} color="#54656f" style={styles.inputIcon}/></TouchableOpacity>
            <TextInput placeholder="Message" style={styles.textInput} value={inputText} onChangeText={setInputText} editable={false} />
            <TouchableOpacity><Ionicons name="camera-outline" size={26} color="#54656f" style={styles.inputIcon}/></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <MaterialCommunityIcons name="microphone" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {menuVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditContact}><Text style={styles.menuText}>Edit Contact</Text></TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={showDeleteConfirmation}><Text style={[styles.menuText, { color: '#D32F2F' }]}>Delete Contact</Text></TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// --- Naye, Behtar Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#075E54',
    paddingVertical: 10, paddingHorizontal: 12, elevation: 3,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10 },
  defaultAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  headerText: { flex: 1 },
  headerName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  chatArea: { flex: 1 },
  scrollView: { paddingHorizontal: 10, paddingTop: 10, paddingBottom: 10 },
  
  messageRow: { flexDirection: 'row', marginVertical: 4, },
  sentRow: { justifyContent: 'flex-end', },
  receivedRow: { justifyContent: 'flex-start', },

  messageBubble: {
    maxWidth: '80%', padding: 3, borderRadius: 8, elevation: 1,
  },
  sentBubble: {
    backgroundColor: '#E7FFDB',
    borderTopRightRadius: 0,
  },
  receivedBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 0,
  },
  
  messageImage: { width: 250, aspectRatio: 1, borderRadius: 6, },
  imageCaption: { paddingHorizontal: 8, paddingVertical: 6, },
  messageText: { fontSize: 16.5, color: '#111b21', paddingHorizontal: 8, paddingVertical: 6, lineHeight: 22 },
  
  voiceMessageContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, width: 200, },
  scrubber: { flex: 1, height: 3, backgroundColor: '#d3d3d3', borderRadius: 2, marginHorizontal: 10, justifyContent: 'center', },
  scrubberLine: { height: 3, backgroundColor: '#a0a0a0', width: '30%', borderRadius: 2, },
  scrubberDot: { position: 'absolute', left: '30%', width: 10, height: 10, borderRadius: 5, backgroundColor: '#075E54', },
  voiceDuration: { fontSize: 12, color: '#54656f', marginLeft: 5 },
  
  timeContainer: { flexDirection: 'row', alignSelf: 'flex-end', alignItems: 'center', paddingRight: 8, paddingBottom: 4, },
  timeContainerOnImage: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 10, paddingVertical: 2, paddingHorizontal: 6 },
  timeText: { fontSize: 11, color: '#667781', marginRight: 5, },
  timeTextOnImage: { color: 'white' },
  
  inputContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 10, backgroundColor: 'transparent' },
  inputBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 25, paddingHorizontal: 5, marginRight: 8, elevation: 2 },
  textInput: { flex: 1, paddingVertical: Platform.OS === 'ios' ? 10 : 8, fontSize: 16, marginHorizontal: 5, color: '#111b21' },
  inputIcon: { padding: 8 },
  actionButton: { backgroundColor: '#00A884', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, },
  menuContainer: { position: 'absolute', top: 5, right: 5, backgroundColor: 'white', borderRadius: 8, paddingVertical: 5, elevation: 5, },
  menuItem: { paddingHorizontal: 20, paddingVertical: 12, },
  menuText: { fontSize: 16, color: '#111b21', },
});