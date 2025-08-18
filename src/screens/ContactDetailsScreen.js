import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  ScrollView,
} from 'react-native';

import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CreateNewContactScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [about, setAbout] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const [firstNameError, setFirstNameError] = useState('');

  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, response => {
      if (response.didCancel) return;
      if (response.error) {
        Alert.alert('Error', 'Something went wrong while picking the image.');
      } else if (response.assets && response.assets[0].uri) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleSave = () => {
    setFirstNameError('');

    if (firstName.trim() === '') {
      setFirstNameError('First name is required.');
      return;
    }

    const newContact = {
      id: Date.now().toString(),
      firstName,
      lastName,
      about: about || 'Hey there! I am using WhatsApp.',
      profileImage,
    };

    console.log('Saving contact:', newContact);
    Alert.alert('Success', 'Contact saved successfully!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#075E54" barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New contact</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <View style={styles.profilePicContainer}>
              <TouchableOpacity
                style={styles.profilePic}
                onPress={handleChoosePhoto}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImageStyle}
                  />
                ) : (
                  <FontAwesome5 name="user-alt" size={60} color="#c0c0c0" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cameraIconContainer}
                onPress={handleChoosePhoto}
              >
                <Ionicons name="camera" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputSection}>
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="#888"
                value={firstName}
                onChangeText={setFirstName}
              />
              {firstNameError ? (
                <Text style={styles.errorText}>{firstNameError}</Text>
              ) : null}

              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#888"
                value={lastName}
                onChangeText={setLastName}
              />

              <TextInput
                style={styles.input}
                placeholder="About"
                placeholderTextColor="#888"
                value={about}
                onChangeText={setAbout}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 4,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 25,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageStyle: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: '28%',
    backgroundColor: '#00a884',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  inputSection: {
    marginTop: 20,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  buttonContainer: {
    padding: 20,
    justifyContent: 'flex-end',
  },
  saveButton: {
    backgroundColor: '#00a884',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
