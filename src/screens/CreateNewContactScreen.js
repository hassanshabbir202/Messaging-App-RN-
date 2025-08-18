import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const contactsData = [
  {
    id: '1',
    name: 'Abby',
    status: 'Hey there! I am using WhatsApp.',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
  },
  {
    id: '2',
    name: 'Angie Nondorf',
    status: 'Hey there! I am using WhatsApp.',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
  },
  {
    id: '3',
    name: 'Ash',
    status: 'Hey there! I am using WhatsApp.',
    avatar: null, 
  },
  {
    id: '4',
    name: 'Christy',
    status: 'Miss Congeniality/2nd runner up to Miss...',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
  {
    id: '5',
    name: 'Daniel Nondorf',
    status: '¡Hola! Estoy usando WhatsApp.',
    avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
  },
  {
    id: '6',
    name: 'Jennifer Nondorf',
    status: 'Hey there! I am using WhatsApp.',
    avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
  },
  {
    id: '7',
    name: 'Mike Weston',
    status: 'Hey there! I am using WhatsApp.',
    avatar: null,
  },
  {
    id: '8',
    name: 'Nick Pratt',
    status: 'Available',
    avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
  },
];

const ListHeader = ({ navigation }) => (
  <>
    <TouchableOpacity style={styles.actionRow}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="users" size={20} color="white" />
      </View>
      <Text style={styles.actionText}>New group</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.actionRow}
      onPress={() => navigation.navigate('ContactDetails')}
    >
      <View style={styles.iconContainer}>
        <FontAwesome5 name="user-plus" size={18} color="white" />
      </View>
      <Text style={styles.actionText}>New contact</Text>
    </TouchableOpacity>
  </>
);

const ContactItem = ({ item }) => (
  <TouchableOpacity style={styles.contactRow}>
    {item.avatar ? (
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
    ) : (
      <View style={styles.defaultAvatar}>
        <Ionicons name="person" size={24} color="white" />
      </View>
    )}
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactStatus}>{item.status}</Text>
    </View>
  </TouchableOpacity>
);

const CreateNewContactScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Select contact</Text>
          <Text style={styles.headerSubtitle}>
            {contactsData.length} contacts
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <MaterialIcons
            name="search"
            size={24}
            color="white"
            style={{ marginRight: 20 }}
          />
          <MaterialIcons name="more-vert" size={24} color="white" />
        </View>
      </View>

      {/* Contacts ki List */}
      <FlatList
        data={contactsData}
        renderItem={({ item }) => <ContactItem item={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={<ListHeader navigation={navigation} />}
        showsVerticalScrollIndicator={true}
      />
    </SafeAreaView>
  );
};

export default CreateNewContactScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    padding: 15,
    elevation: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 12,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  defaultAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  contactStatus: {
    fontSize: 14,
    color: 'gray',
  },
});
