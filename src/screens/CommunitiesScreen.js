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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const communitiesData = [
  {
    id: '1',
    name: '',
    avatar:
      'https://i.pinimg.com/736x/2d/3a/75/2d3a7536d7a402283a049d5a932999ca.jpg',
    groups: [
      {
        id: '1a',
        type: 'announcement',
        name: 'Announcements',
        sender: 'You',
        message: 'Welcome to the community!',
        time: '16/11/2022',
      },
      {
        id: '1b',
        type: 'group',
        name: 'Batch 10 (React)',
        sender: 'Zia Khan',
        message: 'Next class mein hota...',
        time: 'Yesterday',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      {
        id: '1c',
        type: 'group',
        name: 'Freelance Help',
        sender: 'You',
        message: 'you were added',
        time: '04/11/2022',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      },
    ],
  },
  {
    id: '2',
    name: 'Family & Friendships',
    avatar:
      'https://i.pinimg.com/originals/a2/36/23/a2362391216d7c8659226d97793893a9.jpg',
    groups: [
      {
        id: '2a',
        type: 'announcement',
        name: 'Announcements',
        sender: 'Admin',
        message: 'Family dinner this Friday',
        time: 'Tuesday',
      },
    ],
  },
];

const GroupItem = ({ item }) => (
  <TouchableOpacity style={styles.itemContainer}>
    {item.type === 'announcement' ? (
      <View style={[styles.itemIconContainer, { backgroundColor: '#E7FCE8' }]}>
        <MaterialCommunityIcons
          name="bullhorn-outline"
          size={24}
          color="#1E8873"
        />
      </View>
    ) : (
      <Image source={{ uri: item.avatar }} style={styles.itemAvatar} />
    )}
    <View style={styles.itemTextContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemMessage} numberOfLines={1}>
        {item.message}
      </Text>
    </View>
    <Text style={styles.itemTime}>{item.time}</Text>
  </TouchableOpacity>
);

const CommunitySection = ({ community }) => (
  <View style={styles.sectionContainer}>
    {community.groups.map(item => (
      <GroupItem key={item.id} item={item} />
    ))}
  </View>
);

const CommunitiesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Communities</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={26}
            color="#54656f"
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <TouchableOpacity style={styles.newCommunityButton}>
          <View style={styles.newCommunityIconContainer}>
            <MaterialIcons name="groups" size={30} color="#FFFFFF" />
            <View style={styles.plusIcon}>
              <Text style={styles.plusText}>+</Text>
            </View>
          </View>
          <Text style={styles.newCommunityText}>New community</Text>
        </TouchableOpacity>

        {communitiesData.map(community => (
          <CommunitySection key={community.id} community={community} />
        ))}
        {communitiesData.map(community => (
          <CommunitySection key={community.id} community={community} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CommunitiesScreen;

// --- Styles for Light Theme ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111b21',
  },
  newCommunityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  newCommunityIconContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    position: 'absolute',
    bottom: -4,
    right: -4,
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
  newCommunityText: {
    fontSize: 17,
    marginLeft: 15,
    fontWeight: '500',
    color: '#111b21',
  },
  sectionContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 10,
    marginBottom: 10,
  },
  communityAvatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 15,
  },
  communityName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#111b21',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  itemIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25, 
    marginRight: 15,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111b21',
  },
  itemMessage: {
    color: '#54656f',
    fontSize: 14,
  },
  itemTime: {
    color: '#54656f',
    fontSize: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20, 
    paddingVertical: 10,
  },
  viewAllText: {
    color: '#54656f',
    marginLeft: 45,
    fontSize: 15,
    fontWeight: '500',
  },
});
