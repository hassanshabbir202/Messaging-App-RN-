import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const chatsData = [
  {
    id: '1',
    name: 'Besties',
    lastMessage: 'Sarah: For tn: 👟 or 👠?',
    time: '11:26 AM',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    isPinned: true,
  },
  {
    id: '2',
    name: 'Jonathan Miller',
    lastMessage: 'Sticker',
    time: '9:28 AM',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    unread: 4,
    hasStory: true,
    messageType: 'sticker',
  },
  {
    id: '3',
    name: 'Maya Townsend',
    lastMessage: 'Dinner soon? 🍷',
    time: '8:15 AM',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    readStatus: 'read',
  },
  {
    id: '4',
    name: 'Lillian Evaro',
    lastMessage: 'GIF',
    time: '8:03 AM',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    unread: 2,
    hasStory: true,
    messageType: 'gif',
  },
  {
    id: '5',
    name: 'Cristiano Alvés',
    lastMessage: 'pls tell me you follow SingleCatClu...',
    time: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/men/26.jpg',
    readStatus: 'read',
  },
  {
    id: '6',
    name: 'The Hendricks',
    lastMessage: 'Mom: How was this 10 yrs a...',
    time: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    messageType: 'media',
  },
  // --- Yahan se naya data add kiya gaya hai ---
  {
    id: '7',
    name: 'Work Group',
    lastMessage: 'Alex: Project deadline is tomorrow!',
    time: 'Yesterday',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    unread: 1,
  },
  {
    id: '8',
    name: 'Jessica Pearson',
    lastMessage: 'See you at the cafe.',
    time: 'Tuesday',
    avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
    readStatus: 'read',
  },
  {
    id: '9',
    name: 'David Chen',
    lastMessage: 'Sent you the files.',
    time: 'Tuesday',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    readStatus: 'read',
    messageType: 'media',
  },
  {
    id: '10',
    name: 'Emily Rose',
    lastMessage: 'Happy Birthday! 🎉',
    time: 'Monday',
    avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
    hasStory: true,
  },
];

const ChatItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress}>
    <View style={item.hasStory ? styles.statusRing : styles.avatarContainer}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
    </View>
    <View style={styles.chatInfo}>
      <View style={styles.chatHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={item.unread > 0 ? styles.timeUnread : styles.time}>
          {item.time}
        </Text>
      </View>
      <View style={styles.chatSubheader}>
        <View style={styles.messageContainer}>
          {item.readStatus === 'read' && (
            <Ionicons
              name="checkmark-done"
              size={16}
              color="#34b7f1"
              style={styles.readReceipt}
            />
          )}
          {item.messageType === 'sticker' && (
            <MaterialCommunityIcons
              name="sticker-emoji"
              size={16}
              color="#667781"
              style={styles.messageIcon}
            />
          )}
          {item.messageType === 'gif' && (
            <Text style={[styles.lastMessage, { fontWeight: '500' }]}>GIF</Text>
          )}
          {item.messageType === 'media' && (
            <MaterialIcons
              name="photo-camera"
              size={16}
              color="#667781"
              style={styles.messageIcon}
            />
          )}
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          {item.isPinned && (
            <MaterialCommunityIcons name="pin" size={18} color="#667781" />
          )}
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Chat App</Text>
        <View style={styles.headerIconsContainer}>
          <MaterialCommunityIcons
            name="camera-outline"
            size={26}
            color="#54656f"
            style={styles.icon}
          />
          <MaterialCommunityIcons
            name="dots-vertical"
            size={26}
            color="#54656f"
            style={styles.icon}
          />
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

      <View style={{ flex: 1 }}>
        <FlatList
          data={chatsData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ChatItem
              item={item}
              onPress={() =>
                navigation.navigate('ChatHistory', {
                  userName: item.name,
                  userAvatar: item.avatar,
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity style={styles.fab}
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
  chatInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: { fontSize: 17, fontWeight: '500', color: '#111b21' },
  time: { fontSize: 12, color: '#667781' },
  timeUnread: { fontSize: 12, color: '#25d366', fontWeight: 'bold' },
  chatSubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  messageContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  readReceipt: { marginRight: 5 },
  messageIcon: { marginRight: 5 },
  lastMessage: { fontSize: 14, color: '#667781', marginRight: 5 },
  badgeContainer: { alignItems: 'center', flexDirection: 'row' },
  unreadBadge: {
    backgroundColor: '#25d366',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 5,
  },
  unreadText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
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
});
