import { collection, addDoc, query, where, onSnapshot } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

// Crear mensaje en Firestore
export const createMessage = async (message, chatId,userUId,userName) => {
  try {
    await firestore().collection('Messages').add({
      chatId: chatId, //corresponde al sender Id del candidato
      content: message,
      senderUId: userUId, //en este caso no se necesita senderId ya que es igual al chatId 
      senderName: userName,
      timestamp: new Date() // Timestamp para ordenar los mensajes
    });
    console.log('Mensaje guardado exitosamente');
  } catch (error) {
    console.error('Error al enviar el mensaje: ', error);
  }
};

// Escuchar mensajes de Firestore
export const listenForMessages = (chatId, setMessages) => {
  const q = firestore().collection('Messages').where('chatId', '==', chatId);

  const unsubscribe = q.onSnapshot((querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ ...doc.data(), id: doc.id });
    });

    if (messages.length > 0) {
      const orderedMessages = messages.sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate());
      setMessages(orderedMessages);
    } else {
      setMessages(messages);
    }
  });

  return unsubscribe; // Para limpiar la suscripción si es necesario
};
