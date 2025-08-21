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
  KeyboardAvoidingView,
  Platform,
  Alert, // <-- Alert ko import karna zaroori hai
} from 'react-native';

// Naye imports
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MessageBubble = ({ message }) => {
  // Is component ko abhi ke liye simple rakha gaya hai
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
  // route.params se contact ki details lein (contactId bhi)
  const { userName, userAvatar, contactId } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef();

  // Menu ko control karne ke liye state
  const [menuVisible, setMenuVisible] = useState(false);

  // --- DELETE FUNCTIONALITY ---
  const handleDeleteContact = async () => {
    try {
      const existingContactsRaw = await AsyncStorage.getItem('my_contacts_list');
      let existingContacts = existingContactsRaw ? JSON.parse(existingContactsRaw) : [];

      // Us contact ko filter karke nikal dein jiski ID match hoti hai
      const updatedContacts = existingContacts.filter(contact => contact.id !== contactId);
      
      await AsyncStorage.setItem('my_contacts_list', JSON.stringify(updatedContacts));
      
      Alert.alert('Success', `${userName} has been deleted.`);
      
      // Delete karne ke baad, seedha main 'Chats' screen par jayein
      navigation.navigate('HomeTabs', { screen: 'Chats' });

    } catch (error) {
      console.error("Failed to delete contact.", error);
      Alert.alert('Error', 'Could not delete the contact.');
    }
  };

  const showDeleteConfirmation = () => {
    setMenuVisible(false); // Pehle menu ko band karein
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${userName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteContact, style: 'destructive' },
      ]
    );
  };

  // --- EDIT FUNCTIONALITY ---
  const handleEditContact = () => {
    setMenuVisible(false); // Menu band karein
    // 'NewContact' screen par jayein aur contactId saath bhejein
    navigation.navigate('NewContact', { contactIdToEdit: contactId });
  };

  const handleSend = () => {
    // Iski functionality hum agle steps mein banayenge
    if (inputText.trim() === '') return;
    // ...
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        {userAvatar ? (
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.defaultAvatar}>
            <Ionicons name="person" size={20} color="white" />
          </View>
        )}
        
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{userName}</Text>
        </View>

        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg' }}
        style={styles.chatArea}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollView}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>
              <MaterialCommunityIcons name="lock" size={13} color="#54656f" />{' '}
              Messages are end-to-end encrypted. No one outside of this chat can
              read them.
            </Text>
          </View>
          {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}
        </ScrollView>
      </ImageBackground>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View style={styles.inputContainer}>
            <View style={styles.inputBox}>
                <MaterialCommunityIcons name="emoticon-outline" size={24} color="#54656f" style={styles.inputIcon}/>
                <TextInput
                    placeholder="Message"
                    style={styles.textInput}
                    value={inputText}
                    onChangeText={setInputText}
                />
                <MaterialCommunityIcons name="paperclip" size={24} color="#54656f" style={styles.inputIcon}/>
                <Ionicons name="camera" size={24} color="#54656f" style={styles.inputIcon}/>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
                {inputText.trim() !== '' ? (
                    <MaterialCommunityIcons name="send" size={24} color="white" />
                ) : (
                    <MaterialCommunityIcons name="microphone" size={24} color="white" />
                )}
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      
      {menuVisible && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditContact}>
              <Text style={styles.menuText}>Edit Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={showDeleteConfirmation}>
              <Text style={[styles.menuText, { color: '#D32F2F' }]}>Delete Contact</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
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
  defaultAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 10, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
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
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 10,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#111b21',
  },
});