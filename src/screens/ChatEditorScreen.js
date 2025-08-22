import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TextInput,
  TouchableOpacity, Switch, Image, Alert, Modal, FlatList, Platform
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// --- Contact Picker Modal Component ---
const ContactPickerModal = ({ visible, contacts, onSelect, onClose }) => (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select a Contact</Text>
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.contactItem} onPress={() => onSelect(item)}>
                            {item.avatar ? <Image source={{ uri: item.avatar }} style={styles.contactAvatar} /> : <View style={styles.defaultContactAvatar}><Ionicons name="person" size={20} color="white" /></View>}
                            <Text style={styles.contactName}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
                <TouchableOpacity style={styles.closeButton} onPress={onClose}><Text style={styles.closeButtonText}>Close</Text></TouchableOpacity>
            </View>
        </View>
    </Modal>
);

// --- Chat History Item Component ---
const HistoryItem = ({ item, onEdit }) => (
    <View style={styles.historyItem}>
        <View style={styles.historyMessage}>
            <Text style={styles.historyText} numberOfLines={2}>
                {item.text || (item.image && '[Image Message]') || (item.voice && `[Voice Message: ${item.voice}]`)}
            </Text>
            <Text style={styles.historyTime}>
                {new Date(item.timestamp).toLocaleString()}
            </Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#075E54" />
        </TouchableOpacity>
    </View>
);

// --- Main Chat Editor Screen Component ---
const ChatEditorScreen = ({ navigation }) => {
  const [allContacts, setAllContacts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  
  const [messageText, setMessageText] = useState('');
  const [isSent, setIsSent] = useState(true);
  const [readStatus, setReadStatus] = useState('sent');
  const [imageUri, setImageUri] = useState(null);
  const [voiceDuration, setVoiceDuration] = useState('');
  const [date, setDate] = useState(new Date());

  const [chatHistory, setChatHistory] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const isEditMode = !!editingMessageId;

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const contactsRaw = await AsyncStorage.getItem('my_contacts_list');
        setAllContacts(contactsRaw ? JSON.parse(contactsRaw) : []);
      } catch (error) { console.error("Failed to load contacts.", error); }
    };
    loadContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      loadChatHistory();
    } else {
      setChatHistory([]);
    }
  }, [selectedContact]);
  
  const loadChatHistory = async () => {
    if (!selectedContact) return;
    try {
        const chatKey = `chat_${selectedContact.id}`;
        const messagesRaw = await AsyncStorage.getItem(chatKey);
        setChatHistory(messagesRaw ? JSON.parse(messagesRaw) : []);
    } catch (error) { console.error("Failed to load chat history.", error); }
  };
  
  const resetForm = () => {
    setMessageText(''); setImageUri(null); setVoiceDuration('');
    setDate(new Date()); setIsSent(true); setReadStatus('sent');
    setEditingMessageId(null);
  };

  const handleEditPress = (message) => {
    setEditingMessageId(message.id);
    setMessageText(message.text || '');
    setIsSent(message.type === 'sent');
    setReadStatus(message.status || 'sent');
    setImageUri(message.image || null);
    setVoiceDuration(message.voice || '');
    setDate(new Date(message.timestamp));
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setIsModalVisible(false);
    resetForm(); // Contact badalne par form reset karein
  };

  const handleChooseImage = () => {
    launchImageLibrary({ noData: true }, (response) => {
      if (response.didCancel) return;
      if (response.error) Alert.alert('Error', 'Could not select image.');
      else if (response.assets && response.assets[0].uri) setImageUri(response.assets[0].uri);
    });
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      mode: 'datetime',
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) setDate(selectedDate);
      },
    });
  };

  const handleAddOrUpdateMessage = async () => {
    if (!selectedContact) return Alert.alert('Error', 'Please select a contact first.');
    if (!messageText && !imageUri && !voiceDuration) return Alert.alert('Error', 'Message cannot be empty.');

    const messageData = {
      text: messageText, type: isSent ? 'sent' : 'received', timestamp: date.toISOString(),
      status: isSent ? readStatus : null, image: imageUri, voice: voiceDuration || null,
    };

    try {
        const chatKey = `chat_${selectedContact.id}`;
        let updatedMessages;
        if (isEditMode) {
            updatedMessages = chatHistory.map(msg =>
                msg.id === editingMessageId ? { ...msg, ...messageData } : msg
            );
            Alert.alert('Success', 'Message updated!');
        } else {
            const newMessage = { id: Date.now().toString(), contactId: selectedContact.id, ...messageData };
            updatedMessages = [...chatHistory, newMessage];
            Alert.alert('Success', 'Message added!');
        }
        await AsyncStorage.setItem(chatKey, JSON.stringify(updatedMessages));
        resetForm();
        setChatHistory(updatedMessages); // UI ko foran refresh karein
    } catch (error) { console.error("Error saving message", error); }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="white" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Editor</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>1. Select Contact</Text>
        <TouchableOpacity style={styles.selectorButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.selectorButtonText}>{selectedContact ? selectedContact.name : 'Choose a contact...'}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{isEditMode ? '2. Edit Message' : '2. Create Message'}</Text>
        <TextInput style={styles.input} placeholder="Type your message here..." value={messageText} onChangeText={setMessageText} multiline/>
        <TouchableOpacity style={styles.selectorButton} onPress={showDatePicker}>
          <Ionicons name="calendar-outline" size={22} color="#075E54" />
          <Text style={styles.selectorButtonText}>Timestamp: {date.toLocaleString()}</Text>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Received</Text>
          <Switch onValueChange={() => setIsSent(prev => !prev)} value={!isSent} />
          <Text style={styles.switchLabel}>Sent</Text>
        </View>
        {isSent && (
          <View style={styles.statusContainer}>
            <Text style={styles.label}>Read Status:</Text>
            <TouchableOpacity onPress={() => setReadStatus('sent')} style={[styles.statusButton, readStatus === 'sent' && styles.activeStatus]}><MaterialCommunityIcons name="check" size={20} color={readStatus === 'sent' ? 'white' : 'gray'} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setReadStatus('delivered')} style={[styles.statusButton, readStatus === 'delivered' && styles.activeStatus]}><MaterialCommunityIcons name="check-all" size={20} color={readStatus === 'delivered' ? 'white' : 'gray'} /></TouchableOpacity>
            <TouchableOpacity onPress={() => setReadStatus('read')} style={[styles.statusButton, readStatus === 'read' && styles.activeStatus]}><MaterialCommunityIcons name="check-all" size={20} color={readStatus === 'read' ? 'white' : '#34B7F1'} /></TouchableOpacity>
          </View>
        )}
        <TouchableOpacity style={styles.selectorButton} onPress={handleChooseImage}>
          <Ionicons name="image-outline" size={22} color="#075E54" />
          <Text style={styles.selectorButtonText}>{imageUri ? 'Image Selected!' : 'Select Image'}</Text>
        </TouchableOpacity>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
        <TextInput style={[styles.input, {minHeight: 50}]} placeholder="Voice message duration (e.g., 0:25)" value={voiceDuration} onChangeText={setVoiceDuration} keyboardType="phone-pad"/>

        {selectedContact && (
            <>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>3. Chat History for {selectedContact.name}</Text>
                {chatHistory.length > 0 ? (
                    <FlatList data={chatHistory} keyExtractor={(item) => item.id} renderItem={({ item }) => <HistoryItem item={item} onEdit={handleEditPress} />} scrollEnabled={false}/>
                ) : ( <Text style={styles.noHistoryText}>No messages yet. Add one above!</Text> )}
            </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleAddOrUpdateMessage}>
          <Text style={styles.saveButtonText}>{isEditMode ? 'Update Message' : 'Add Message to Chat'}</Text>
        </TouchableOpacity>
        {isEditMode && (
          <TouchableOpacity style={styles.cancelButton} onPress={resetForm}><Text style={styles.cancelButtonText}>Cancel Edit</Text></TouchableOpacity>
        )}
      </View>
      
      <ContactPickerModal visible={isModalVisible} contacts={allContacts} onSelect={handleSelectContact} onClose={() => setIsModalVisible(false)}/>
    </SafeAreaView>
  );
};

export default ChatEditorScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#075E54', padding: 15, },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 20 },
  content: { padding: 20, paddingBottom: 120 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111b21', marginTop: 20, marginBottom: 10, },
  selectorButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f2f5', padding: 15, borderRadius: 8, marginBottom: 15, },
  selectorButtonText: { fontSize: 16, color: '#075E54', marginLeft: 10 },
  input: { backgroundColor: '#f0f2f5', padding: 15, borderRadius: 8, fontSize: 16, minHeight: 80, textAlignVertical: 'top', marginBottom: 15, },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10, },
  switchLabel: { fontSize: 16, fontWeight: '500', marginHorizontal: 10 },
  statusContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, },
  label: { fontSize: 16, marginRight: 10 },
  statusButton: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginHorizontal: 5, },
  activeStatus: { backgroundColor: '#075E54', borderColor: '#075E54' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: 'white', position: 'absolute', bottom: 0, left: 0, right: 0, },
  saveButton: { backgroundColor: '#00a884', padding: 15, borderRadius: 25, alignItems: 'center', },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', },
  previewImage: { width: 100, height: 100, borderRadius: 8, alignSelf: 'center', marginBottom: 15, },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', },
  modalContent: { backgroundColor: 'white', width: '85%', maxHeight: '70%', borderRadius: 10, padding: 20, },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  contactItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', },
  contactAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
  defaultContactAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', },
  contactName: { fontSize: 16 },
  closeButton: { marginTop: 20, backgroundColor: '#075E54', padding: 12, borderRadius: 8, alignItems: 'center', },
  closeButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 20 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 10, borderRadius: 8, marginBottom: 8, },
  historyMessage: { flex: 1, marginRight: 10 },
  historyText: { fontSize: 14, color: '#333' },
  historyTime: { fontSize: 11, color: 'gray', marginTop: 2 },
  editButton: { padding: 5 },
  noHistoryText: { textAlign: 'center', color: 'gray', marginVertical: 20 },
  cancelButton: { marginTop: 10, alignItems: 'center', },
  cancelButtonText: { color: '#D32F2F', fontSize: 14, fontWeight: '500' },
});