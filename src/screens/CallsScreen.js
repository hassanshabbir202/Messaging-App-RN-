import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView, 
    FlatList, 
    Image, 
    TouchableOpacity,
    StatusBar
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const contactsData = [
  { id: '1', name: 'Alina Smith', status: 'Hey there! I am using WhatsApp.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '2', name: 'Brian O\'Conner', status: 'At the movies', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '3', name: 'Catherine Zeta', status: 'Busy', avatar: null },
  { id: '4', name: 'David Chen', status: 'Available', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
  { id: '5', name: 'Emily Rose', status: 'Sleeping', avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { id: '6', name: 'Frank Miller', status: 'Work work work...', avatar: 'https://randomuser.me/api/portraits/men/6.jpg' },
  { id: '7', name: 'Grace Lee', status: 'Let\'s connect!', avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
  { id: '8', name: 'Henry Ford', status: 'Driving', avatar: null }
];

const ContactItem = ({ name, status, avatar }) => (
    <TouchableOpacity style={styles.contactItem}>
        <View style={styles.avatarContainer}>
            {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
                <MaterialCommunityIcons name="account-circle" size={50} color="#E0E0E0" />
            )}
        </View>
        <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{name}</Text>
            <Text style={styles.contactStatus}>{status}</Text>
        </View>
        <View style={styles.callIcons}>
            <TouchableOpacity>
                <Ionicons name="call" size={24} color="#075E54" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }}>
                <Ionicons name="videocam" size={24} color="#075E54" />
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
);

const ListHeader = () => (
   <View style={styles.listHeaderContainer}>
        <Text style={styles.sectionTitle}>Favourites</Text>
        <TouchableOpacity style={styles.optionItem}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="heart" size={26} color="black" />
            </View>
            <Text style={styles.optionText}>Add favourite</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Recent</Text>
   </View>
);

const CallsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
      
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Calls</Text>
            <View style={styles.headerIcons}>
                <TouchableOpacity>
                    <MaterialIcons name="search" size={26} color="#54656f" />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 20 }}>
                    <MaterialCommunityIcons name="dots-vertical" size={26} color="#54656f" />
                </TouchableOpacity>
            </View>
        </View>

        <FlatList
            data={contactsData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ContactItem {...item} />}
            ListHeaderComponent={ListHeader}
        />
    </SafeAreaView>
  );
};

export default CallsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    elevation: 4,
  },
  headerTitle: {
    color: '#111b21',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  listHeaderContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#111b21',
    marginTop: 10,
    marginBottom: 6,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#25D366',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111b21',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#111b21',
  },
  contactStatus: {
    fontSize: 14,
    color: '#667781',
  },
  callIcons: {
    flexDirection: 'row',
  },
});