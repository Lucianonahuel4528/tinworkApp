import firestore from '@react-native-firebase/firestore';
import {createUser as create} from '../../AuthService';
import messaging from '@react-native-firebase/messaging';

export const createUser = async ({name, email, pass}) => {
  const auth = await create(name, email, pass);
  const token = await messaging().getToken();
  return firestore()
    .collection('Users')
    .add({
      name: name,
      email: email,
      uid: auth.user.uid,
      token: token,
      location: '',
      description: '',
      imageProfile: '',
      abilities: [],
      interestingOffers: [],
      uninterestingOffers: [],
      offersMatch: [],
      certifications: [] 
    })
    .then(result => {
      console.log('User added!');
      return result;
    })
    .catch(err => {
      console.log('Error', err);
      throw err;
    });
};

export const updateUser = async user => {
  await firestore()
    .collection('Users')
    .where('uid', '==', user.uid)
    .get()
    .then(response => {
      if (response.docs.length > 0) {
        response.docs.forEach(doc => doc.ref.update(user));
      }
    });
};

export const findByUid = async uid => {
  return await firestore()
    .collection('Users')
    .where('uid', '==', uid)
    .get()
    .then(response =>
      response.docs.length > 0 ? response.docs[0].data() : null,
    );
};


export const removeCertification = async (uid, certificationUrl) => {
  try {
    // Buscar al usuario en Firestore por UID
    const userDoc = await firestore()
      .collection('Users')
      .where('uid', '==', uid)
      .get();

    if (userDoc.docs.length === 0) {
      throw new Error('Usuario no encontrado.');
    }

    const userRef = userDoc.docs[0].ref; // Referencia al documento del usuario
    const userData = userDoc.docs[0].data(); // Datos actuales del usuario

    // Verificar si la certificación existe
    const currentCertifications = userData.certifications ?? [];
    if (!currentCertifications.includes(certificationUrl)) {
      throw new Error('La certificación no existe en el perfil del usuario.');
    }

    // Filtrar la certificación a eliminar
    const updatedCertifications = currentCertifications.filter(
      (cert) => cert !== certificationUrl
    );

    // Actualizar el campo certifications en Firestore
    await userRef.update({ certifications: updatedCertifications });

    console.log('Certificación eliminada exitosamente.');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar la certificación:', error);
    throw error;
  } }