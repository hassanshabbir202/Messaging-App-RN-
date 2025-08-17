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
  Image, // Image component ko import karein
  Alert, // Alert dikhane ke liye
} from 'react-native';

// Nayi libraries ko import karein
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ContactDetailsScreen = ({ navigation }) => {
  // Input fields aur image ke liye state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Image URI ko store karega

  // Validations ke liye error states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // Function to handle image picking
  const handleChoosePhoto = () => {
    launchImageLibrary({ noData: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Something went wrong while picking the image.');
      } else if (response.assets && response.assets[0].uri) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  // Function to handle save with validations
  const handleSave = () => {
    // Pehle purane errors ko clear karein
    setFirstNameError('');
    setLastNameError('');
    
    let isValid = true;

    if (firstName.trim() === '') {
      setFirstNameError('First name is required.');
      isValid = false;
    }
    if (lastName.trim() === '') {
      setLastNameError('Last name is required.');
      isValid = false;
    }

    if (!isValid) {
      return; // Agar validation fail ho to aage na badhein
    }

    console.log('Saving contact:', { firstName, lastName, profileImage });
    navigation.popToTop();
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <View style={styles.content}>
          <View style={styles.profilePicContainer}>
            {/* Ab profile picture section clickable hai */}
            <TouchableOpacity style={styles.profilePic} onPress={handleChoosePhoto}>
              {profileImage ? (
                // Agar image select ho gayi hai to woh dikhayein
                <Image source={{ uri: profileImage }} style={styles.profileImageStyle} />
              ) : (
                // Warna default icon dikhayein
                <FontAwesome5 name="users" size={60} color="#c0c0c0" />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraIconContainer} onPress={handleChoosePhoto}>
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
            {/* Error message yahan dikhega */}
            {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

            <TextInput
              style={[styles.input, {marginTop: 15}]} // Thoda upar se margin
              placeholder="Last name"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
            {/* Error message yahan dikhega */}
            {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ContactDetailsScreen;

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
    marginVertical: 30,
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
  // Naya style
  profileImageStyle: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 90,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  // Naya style
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    padding: 20,
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