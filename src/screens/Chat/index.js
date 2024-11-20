import React, { useState, useEffect } from 'react';
import { View, Text,Image, TextInput, Button, FlatList,ScrollView, StyleSheet,TouchableOpacity,KeyboardAvoidingView  } from 'react-native';
import { findUserAuthenticated } from '../../../AuthService';
import { findByUid } from '../../services/UserService';
import {CARD, FONT_SIZE, FUENTES, fuentes} from '../../utils/constants';
import Icon from 'react-native-vector-icons/Entypo';
import IconSend from 'react-native-vector-icons/Ionicons';
import {  useRoute } from '@react-navigation/native';
import IconUser from 'react-native-vector-icons/FontAwesome';
import { createMessage, listenForMessages } from '../../services/ChatService';


const Chat = ({route}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const imgProfileRecrutier = route.params.recrutier.imageProfile
  const uidRecrutier = route.params.recrutier.uid
 

  const handleSubmit = () => {
    if (message && user) {
      /*user.uid corresponde al id del chat que es el uid del candidato*/
      createMessage(message, user.uid,user.uid, user.name);
      setMessage('');  // Limpiar el campo del mensaje
    }
  };
  
  useEffect(()=>{
    const getUser = async () => {
    let userAuthenticated = findUserAuthenticated();
    let user = await findByUid(userAuthenticated.uid);
    setUser(user)
    console.log("user auth",user.imageProfile === '')
    }
    getUser()
    },[])
    
    useEffect(() => {
      if (user?.uid) { // Asegúrate de que el candidato está seleccionado
        const unsubscribe = listenForMessages(user.uid, setMessages); // Escuchar mensajes del chat de este candidato
    
        return () => {
          unsubscribe(); // Limpia la suscripción cuando se cierra la modal o cambia de candidato
        };
      }
    }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.messageRow}>
      <Image
        source={{ uri: item.senderUId === item.chatId ? (user.imageProfile ? user.imageProfile : null) : imgProfileRecrutier }}
        style={styles.avatar}
      />
      <View style={styles.messageContent}>
        <Text style={styles.senderName}>{item.senderName}</Text>
        <Text style={styles.messageText}>{item.content}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      
      <View style={styles.header}>
      
        <Text style={styles.title}>Chat</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messageArea}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
          <IconSend name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
  },
  header: {
    marginTop:5,
    backgroundColor: '#007bff',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatar: {
    width: 45,                     // Tamaño de la imagen de perfil
    height: 45,
    borderRadius: 22.5,            // Forma circular
    marginHorizontal: 10,          // Espacio entre el avatar y el mensaje
    borderColor: '#ccc',
    borderWidth: 1,
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  img: {
    height: 40,
    width: 50,
    borderRadius: 10,
  },
  messageArea: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nameContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e6e6e6',
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    
  },
  nameText: {
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',  // Alinear el avatar con el inicio del mensaje
    padding: 10,
    marginVertical: 5,
  },
  messageContent: {
    flex: 1,  // Para que ocupe todo el espacio disponible
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    color: '#333',
    fontSize: 14,
  }
});

export default Chat;