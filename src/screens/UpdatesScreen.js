import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const statusData = [
  {
    id: '1',
    name: 'Alina Smith',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: "Brian O'Conner",
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '3',
    name: 'David Chen',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: '4',
    name: 'Emily Rose',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
  },
];

const channelsData = [
  {
    id: '1',
    name: 'React Native Devs',
    avatar: 'https://reactnative.dev/img/tiny_logo.png',
    message: 'New update available for React Navigation!',
    time: '11:30 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'National Geographic',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/The_Verge_logo.svg/1024px-The_Verge_logo.svg.png',
    message: 'Photo of the Day: A lioness in Serengeti.',
    time: '10:15 AM',
    unread: 0,
  },
  {
    id: '3',
    name: 'TechCrunch',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/TechCrunch_logo.svg/1200px-TechCrunch_logo.svg.png',
    message: 'Apple announces new M4 chip details.',
    time: 'Yesterday',
    unread: 1,
  },
  {
    id: '4',
    name: 'Marvel Entertainment',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1200px-Marvel_Logo.svg.png',
    message: 'New trailer for the upcoming movie is out!',
    time: 'Yesterday',
    unread: 0,
  },
  {
    id: '5',
    name: 'SpaceX',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/TechCrunch_logo.svg/1200px-TechCrunch_logo.svg.png',
    message: 'Starship launch scheduled for next week.',
    time: 'Tuesday',
    unread: 5,
  },
  {
    id: '6',
    name: 'The Verge',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/The_Verge_logo.svg/1024px-The_Verge_logo.svg.png',
    message: 'Hands-on review of the new Pixel phone.',
    time: 'Tuesday',
    unread: 0,
  },
  {
    id: '7',
    name: 'WhatsApp',
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png',
    message: 'New privacy features are now live.',
    time: '08/11/2024',
    unread: 1,
  },
];

const StatusCircle = ({ name, avatar, isMe }) => (
  <TouchableOpacity style={styles.statusCircleContainer}>
    <View style={styles.statusRing}>
      <Image source={{ uri: avatar }} style={styles.statusAvatar} />
    </View>
    <Text style={styles.statusName} numberOfLines={1}>
      {name}
    </Text>
    {isMe && (
      <View style={styles.plusIcon}>
        <Text style={styles.plusText}>+</Text>
      </View>
    )}
  </TouchableOpacity>
);

const ChannelItem = ({ name, avatar, message, time, unread }) => (
  <TouchableOpacity style={styles.channelItem}>
    <Image source={{ uri: avatar }} style={styles.channelAvatar} />
    <View style={styles.channelInfo}>
      <Text style={styles.channelName}>{name}</Text>
      <Text style={styles.channelMessage} numberOfLines={1}>
        {message}
      </Text>
    </View>
    <View style={styles.channelMeta}>
      <Text style={styles.channelTime}>{time}</Text>
      {unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unread}</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const UpdatesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Updates</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={26}
            color="#54656f"
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusList}
          >
            <StatusCircle
              name="My status"
              avatar="https://randomuser.me/api/portraits/men/1.jpg"
              isMe
            />
            {statusData.map(item => (
              <StatusCircle key={item.id} {...item} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Channels</Text>
            <TouchableOpacity>
              <Ionicons name="add" size={28} color="#54656f" />
            </TouchableOpacity>
          </View>
          {channelsData.map(item => (
            <ChannelItem key={item.id} {...item} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, styles.fabPencil]}>
          <MaterialCommunityIcons name="pencil" size={22} color="#075E54" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.fab, styles.fabCamera]}>
          <Ionicons name="camera" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UpdatesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111b21' },
  section: { paddingVertical: 10 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111b21',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  statusList: { paddingLeft: 15 },
  statusCircleContainer: { alignItems: 'center', marginRight: 15, width: 70 },
  statusRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusAvatar: { width: 60, height: 60, borderRadius: 30 },
  statusName: { marginTop: 5, fontSize: 12, color: '#54656f' },
  plusIcon: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    backgroundColor: '#25D366',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  plusText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 8 },
  channelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  channelAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  channelInfo: { flex: 1, marginRight: 10 },
  channelName: { fontSize: 17, fontWeight: '500', color: '#111b21' },
  channelMessage: { fontSize: 14, color: '#667781' },
  channelMeta: { alignItems: 'flex-end' },
  channelTime: { fontSize: 12, color: '#667781' },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 6,
  },
  unreadText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabPencil: {
    backgroundColor: '#E7FCE8',
    marginBottom: 15,
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  fabCamera: { backgroundColor: '#075E54' },
});
