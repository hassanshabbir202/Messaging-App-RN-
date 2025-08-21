import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator, // Loading ke liye
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress}>
    <View style={item.hasStory ? styles.statusRing : styles.avatarContainer}>
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        // Agar contact ki image na ho to default icon dikhayein
        <View style={styles.defaultAvatar}>
          <Ionicons name="person" size={30} color="#FFFFFF" />
        </View>
      )}
    </View>
    <View style={styles.chatInfo}>
      <View style={styles.chatHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <View style={styles.chatSubheader}>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFocused = useIsFocused();

  const loadChats = async () => {
    try {
      // Abhi hum contacts ko hi chat samajh rahe hain
      const contactsRaw = await AsyncStorage.getItem('my_contacts_list');
      const contacts = contactsRaw ? JSON.parse(contactsRaw) : [];

      // Aage jakar, hum yahan chat ka data fetch karenge.
      // Abhi ke liye, har contact ko ek chat item bana dete hain.
      const formattedChats = contacts.map(contact => ({
        ...contact,
        lastMessage: 'Tap to start chatting...', // Dummy message
        time: '10:00 AM', // Dummy time
      }));

      setChats(formattedChats.reverse()); // Naya contact upar dikhe
    } catch (error) {
      console.error('Failed to load chats.', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      setIsLoading(true); // Har baar refresh hone par loading dikhayein
      loadChats();
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header, Search, aur Filters waise hi rahenge */}
      <View style={styles.header}>
        <Text style={styles.title}>WhatsApp</Text>
        <View style={styles.headerIconsContainer}>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="camera-outline"
              size={26}
              color="#54656f"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={26}
              color="#54656f"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchBarContainer}>
        <MaterialIcons name="search" size={22} color="#54656f" />
        <Text style={styles.searchInput}>Ask Meta AI or Search</Text>
      </View>
      <View style={styles.filters}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Groups</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#008069"
            style={{ marginTop: 50 }}
          />
        ) : chats.length > 0 ? (
          <FlatList
            data={chats}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ChatItem
                item={item}
                onPress={() =>
                  navigation.navigate('ChatHistory', {
                    userName: item.name,
                    userAvatar: item.avatar,
                    contactId: item.id, 
                  })
                }
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No Chats Found</Text>
            <Text style={styles.emptySubText}>
              Tap the button below to start a new chat.
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('NewContact')}
        >
          <MaterialCommunityIcons
            name="message-plus-outline"
            size={28}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#008069' },
  headerIconsContainer: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginLeft: 24 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: { color: '#54656f', marginLeft: 15, fontSize: 16 },
  filters: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 10 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
    marginRight: 8,
  },
  activeFilter: { backgroundColor: '#e7ffdb' },
  filterText: { color: '#54656f', fontSize: 14 },
  activeFilterText: { color: '#008069', fontWeight: 'bold', fontSize: 14 },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatarContainer: { width: 50, height: 50 },
  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    borderColor: '#25d366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  chatInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 17, fontWeight: '500', color: '#111b21' },
  time: { fontSize: 12, color: '#667781' },
  chatSubheader: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  lastMessage: { fontSize: 14, color: '#667781', marginRight: 5 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#00a884',
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  listContainer: { flex: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: '#54656f' },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
});
