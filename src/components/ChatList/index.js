import React, { useState, useEffect } from 'react';
import { View, Text , ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { findUserAuthenticated } from '../../../AuthService';
import { findByUid } from '../../services/UserService';
import { FONT_SIZE, FUENTES } from '../../utils/constants';
import Icon from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';  // Importa useNavigation


const ChatList = () => {
  const [recrutiersData, setRecrutiersData] = useState([]);
  const navigation = useNavigation();
  const setRecruiter = async () => {
    let userAuthenticated = findUserAuthenticated();
    const { offersMatch } = await findByUid(userAuthenticated.uid);
    const recruiterUids = offersMatch.map(offer => offer.uid);

    const recruiterDataPromises = recruiterUids.map(uid => findByUid(uid));
    const recruitersData = await Promise.all(recruiterDataPromises);

    const uniqueRecruitersData = recruitersData.filter((recruiter, index, self) =>
      index === self.findIndex((r) => r.uid === recruiter.uid)
    );

    setRecrutiersData(uniqueRecruitersData);
    

  };

  useEffect(() => {
    setRecruiter();
  }, []);


  const handlePress = (recrutier) => { navigation.navigate('Chat', { recrutier }) };


  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={{ fontSize: 35, padding: 15 }}>Mis chats</Text>
        {recrutiersData.map((recrutier, index) => (
          <TouchableOpacity
            key={`${recrutier.uid}-${index}`}
            onPress={() => handlePress(recrutier)} 
          >
            <View style={styles.recrutierContainer} key={`${recrutier.uid}-${index}`}>
              <View style={styles.imageContainer}>

                <Image
                  source={{ uri: recrutier.imageProfile }}
                  style={styles.avatar}
                />
              </View>
              <View style={styles.detailContainer}>
                <Text style={styles.jobTitle}><Text style={styles.name}>{recrutier.name}</Text></Text>
                <Icon name="chat" size={24} style={styles.icon} />


              </View>
            </View>
          </TouchableOpacity>

        ))}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  recrutierContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobTitle: {
    fontFamily: FUENTES.BOLD,
    fontSize: FONT_SIZE.xl,
    color: '#000',
  },
  name: {
    fontFamily: FUENTES.REGULAR,
    fontSize: FONT_SIZE.lg,
    color: '#333',
  },
  company: {
    fontSize: 16,
    color: 'gray',
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  avatar: {
    width: 45,                     // Tamaño de la imagen de perfil
    height: 45,
    borderRadius: 22.5,            // Forma circular
    marginHorizontal: 10,          // Espacio entre el avatar y el mensaje
    borderColor: '#ccc',
    borderWidth: 1,
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10
  },
  icon: {
    marginLeft: "80%",
  },
});
export default ChatList;
