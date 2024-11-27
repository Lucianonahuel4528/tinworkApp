import React, {useState, useEffect, useCallback} from 'react';
import {
  ImageBackground,
  Image,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList, 
  Modal,
  TouchableOpacity
} from 'react-native';
import {Card} from '@rneui/themed';
import {showMessage} from 'react-native-flash-message';
import storage from '@react-native-firebase/storage';
import {Picker} from '@react-native-picker/picker';
import {firebase} from '@react-native-firebase/auth';
import {findUserAuthenticated} from '../../../AuthService';
import {findByUid, removeCertification, updateUser} from '../../services/UserService';
import AptitudeOffer from '../aptitudeOffer';
import ButtonMoreAbilities from '../buttonMoreAbilities';
import {styles} from './styles';
import FormSubmitButton from '../form-submit-button';
import {todasProvincias} from '../../services/ProvinceService';
import * as ImagePicker from 'react-native-image-picker';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util'

import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de importar el ícono

export default function Profile({navigation}) {
  const [userAuth, setUserAuth] = useState();
  const [expandAptitude, setExpandAptitude] = useState(false);
  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState();
  const [userDescription, setUserDescription] = useState();
  const [uploading, setUploading] = useState(false);

  const [filename, setFilename] = useState();
  const [image, setImage] = useState(
    userAuth
      ? userAuth.imageProfile
      : {uri: 'https://w7.pngwing.com/pngs/223/244/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-rectangle-black.png'},
  );

  const [cvFile, setCvFile] = useState(null); // Estado para el CV
  const [cvName, setCvName] = useState(''); // Estado para el nombre del CV
  const [cvUrl, setCvUrl] = useState(null);  // Estado para la URL del CV (PDF)
  const [certifications, setCertifications] = useState([]);
  const [dataCertifications, setDataCertifications] =useState([])
 
  // Método para seleccionar y subir una certificación
  const handleCertificationPicker = async () => {
    try {
      
      const result = await ImagePicker.launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
      }); 
      const uri = result?.assets[0]?.uri; 
      const filename = `certification_${Date.now()}`;
      const blob = await (await fetch(uri)).blob();
      const ref = storage().ref(`/certifications/${filename}`);
      await ref.put(blob);
      const url = await ref.getDownloadURL();
      setCertifications((prevCerts) => [...prevCerts, url]);
      console.log('Certificación subida:', url);

    } catch (error) {
      console.error('Error al seleccionar o subir certificación:', error);
    }
  };

  const saveCertifications = async () => {   
    console.log("certifications desde save",certifications)
    try {
      // Evitar múltiples ejecuciones
      if (certifications.length === 0) {
        showMessage({
          message: 'No hay certificaciones para guardar.',
          type: 'warning',
        });
        return;
      }
  
      // Obtener las certificaciones actuales del usuario autenticado
      const currentCertifications = userAuth.certifications ?? [];
  
      // Evitar agregar certificaciones repetidas
      const uniqueCertifications = certifications.filter(
        (cert) => !currentCertifications.includes(cert)
      );
  
      if (uniqueCertifications.length === 0) {
        showMessage({
          message: 'No hay nuevas certificaciones para guardar.',
          type: 'info',
        });
        return;
      }
  
      // Combinar certificaciones únicas con las existentes
      const updatedCertifications = [...currentCertifications, ...uniqueCertifications];
  
      // Crear el objeto con solo el campo que quieres actualizar
      const user = {
        uid: userAuth.uid, // UID para identificar al usuario
        certifications: updatedCertifications, // Certificaciones actualizadas
      };
      
      
      // Llamar a tu función para actualizar al usuario
      await updateUser(user);
  
      // Actualizar el estado local de userAuth (si es necesario)
      setUserAuth((prev) => ({
        ...prev,
        certifications: updatedCertifications,
      }));
      
      // Mostrar un mensaje de éxito
      showMessage({
        message: 'Certificaciones guardadas exitosamente.',
        type: 'success',
      });
      
      // // Limpia el estado de certificaciones
      setCertifications([]);
      // setDataCertifications(updatedCertifications);
    } catch (error) {
      console.error('Error al guardar certificaciones:', error);
      showMessage({
        message: `Error al guardar certificaciones: ${error.message}`,
        type: 'danger',
      });
    }
  };
  
  const handleRemoveCertification = async (url) => {
    try {
      const uid = userAuth.uid; // UID del usuario autenticado
      console.log("uid",uid)
      
      await removeCertification(uid, url);

      setDataCertifications(prevCertifications => 
        prevCertifications.filter(cert => cert !== url)
      );
      setUserAuth((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert !== url),
    }));
      showMessage({ message: 'Certificación eliminada exitosamente.', type: 'success' });
    } catch (error) {
      showMessage({ message: `Error al eliminar la certificación: ${error.message}`, type: 'danger' });
    }
  };
  //*********************************************** */

  useEffect(() => {
    if (userAuth?.imageProfile) {
      setImage({uri: userAuth?.imageProfile});
    }
    if (userAuth?.description) {
      setUserDescription(userAuth?.description);
    }
    if (userAuth?.cv){
      setCvUrl(userAuth?.cv);
    }
    if (userAuth?.certifications) {
      setDataCertifications(userAuth?.certifications)
    }
   
  }, [userAuth]);

 

  const handleImageUser = () => {
    Alert.alert(
      'Seleccione',
      'Seleccione de donde quiere obtener la foto de perfil',
      [
        {
          text: 'Galeria',
          onPress: () => pickImage(),
          style: 'default',
        },
        {
          text: 'Cámara',
          onPress: () => pickImageCamera(),
          style: 'default',
        },
        {
          cancelable: true,
          text: 'Cancelar',
          onDismiss: () => console.log('tratar despues...'),
        },
      ],
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('Se canceló la carga de imagen');
    } else if (result.errorCode) {
      console.log('Error: ', result.errorMessage);
    } else if (result?.assets) {
      let source = {uri: result.assets[0].uri};
      console.log(result.assets);
      setFilename(result.assets[0].fileName);
      setImage(source);
    }
  };

  const pickImageCamera = async () => {
    const result = await ImagePicker.launchCamera({
      mediaType: 'photo',
      saveToPhotos: false,
      cameraType: 'front',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('Se canceló la carga de imagen');
    } else if (result.errorCode) {
      console.log('Error: ', result.errorMessage);
    } else if (result?.assets) {
      let source = {uri: result.assets[0].uri};
      setImage(source);
    }
  };

  const uploadImage = async () => {
    setUploading(true);
    const response = await fetch(image.uri);
    const blob = await response.blob();
    const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
    var ref = firebase.storage().ref('/perfil').child(filename).put(blob);

    try {
      await ref;
    } catch (e) {
      console.log(e);
    }
    setUploading(false);
    const url = await storage()
      .ref('perfil/' + filename)
      .getDownloadURL();
    onSubmit(url);
  };

  // Función para seleccionar el CV
  const handleCvPicker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Limitar a archivos PDF
      });
      setCvFile(result); // Guardar el archivo seleccionado
      setCvName(result[0].name); // Guardar el nombre del archivo
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Carga de CV cancelada');
      } else {
        console.error('Error al seleccionar CV:', err);
      }
    }
  };

  // Función para subir el archivo CV a Firebase Storage
  const uploadCvFile = async () => {
    if (!cvFile) return;

    setUploading(true);
    const response = await fetch(cvFile[0].uri);
    const blob = await response.blob();
    const filename = cvFile[0].name;

    const ref = firebase.storage().ref('/cv').child(filename).put(blob);

    try {
      await ref;
    } catch (e) {
      console.log(e);
    }
    setUploading(false);

    // Obtener la URL del archivo subido
    const url = await storage().ref('cv/' + filename).getDownloadURL();
    setCvUrl(url)
    return url;
  };

  useEffect(() => {
    const getAbilitiesByUidUser = async () => {
      let userAuthenticated = await findUserAuthenticated();
      let user = await findByUid(userAuthenticated.uid);
      setUserAuth(user);
    };
    getAbilitiesByUidUser();
  }, []);

  const findAllProvinces = async () => {
    const prov = await todasProvincias();
    setProvincias(prov);
  };

  useEffect(() => {
    findAllProvinces();
  }, []);

  const onSubmit = useCallback(
   async url => {
     //const cvUrl = await uploadCvFile();
     
     const user = {
       uid: uid,
       location: selectedProvince + ', Argentina',
       description: userDescription,
       imageProfile: url,
       //cv: cvUrl, // Almacenar la URL del CV en el perfil del usuario
       
      };
      console.log("user",user)
      updateUser(user);
      showMessage({
        message: 'Usuario Actualizado',
        type: 'success',
      });
    },
    [selectedProvince, image, userDescription],
  );

  let uid = userAuth?.uid;

  let minAbilities = userAuth?.abilities.length - 5;
  const [pdfPath, setPdfPath] = useState(null); // Declara setPdfPath aquí
  const [showPdf, setShowPdf] = useState(false);

  // Función para descargar y renderizar el PDF
  const renderPDF = async () => {
    try {
      const res = await ReactNativeBlobUtil.config({
        fileCache: true,
        path: ReactNativeBlobUtil.fs.dirs.DocumentDir + '/my-pdf.pdf', // Ruta donde guardar el PDF
      })
      .fetch('GET', cvUrl);

      setPdfPath(res.path()); // Actualiza el estado con la ruta del PDF
    } catch (error) {
      console.error('Error al renderizar el PDF:', error);
    }
  };

  const handleCvView = async () => {
    if (!showPdf && cvUrl) {
      try {
        const res = await ReactNativeBlobUtil.config({
          fileCache: true,
          path: ReactNativeBlobUtil.fs.dirs.DocumentDir + '/my-pdf.pdf',
        }).fetch('GET', cvUrl);
        setPdfPath(res.path());
      } catch (error) {
        console.error('Error al renderizar el PDF:', error);
      }
    }
    setShowPdf(!showPdf); // Alterna entre mostrar y ocultar
  };
  

  const handleCvUpload = async () =>{
    try{
     const cvUrl = await uploadCvFile();  
     const user = {
       uid: uid,
       cv: cvUrl, // Almacenar la URL del CV en el perfil del usuario
       
      };
      updateUser(user);
      showMessage({
        message: 'Currículum subido',
        type: 'success',
      });
    }catch (err){
      console.log("error al subir Currículum")
    }
  }
  
// useEffect para llamar a renderPDF cuando cvUrl esté disponible
// useEffect(() => {
//   if (cvUrl) {
//     const pdfPath = renderPDF(); // Llama a renderPDF si cvUrl está disponible
//     if (pdfPath) {
//       // Aquí puedes usar pdfPath para mostrar el PDF
//     }
//   }
// }, [cvUrl]);




const confirmDelete = (url) => {
  Alert.alert(
    "Eliminar Certificación",
    "¿Estás seguro de que quieres eliminar esta certificación?",
    [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", onPress: () => handleRemoveCertification(url) },
    ]
  );
};

const renderCertification = ({ item }) => (
  <Pressable onPress={() => /*confirmDelete(item*/ openImageModal(item)}  style={styles.certificationContainer}  >
    <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.trashIcon}>
            <Icon name="trash" size={20} color="red" />
          </TouchableOpacity>
    <Image
      source={{ uri: item }}
      style={styles.certificationImage}
      resizeMode="cover"
    />
  </Pressable>
);

const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);

  // Función para abrir la modal con la imagen seleccionada
  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  // Función para cerrar la modal
  const closeImageModal = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };


  return (
    <View>
      <Text style={{fontSize: 35, padding: 20}}>Mi Perfil</Text>
      <Card>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            alignContent: 'space-around',
          }}>
          <View style={styles.container}>
            <View style={styles.imageContainer}>
              <Pressable onPress={handleImageUser}>
                <ImageBackground style={styles.img} source={image}>
                  <Text style={styles.textoImagen}>Cambiar Foto</Text>
                </ImageBackground>
              </Pressable>
            </View>
            <View style={styles.locationContainer}>
              <View style={styles.tituloyBoton}>
                <Text style={styles.titulos}>Ubicación</Text>
              </View>
              <Picker
                selectedValue={selectedProvince}
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedProvince(itemValue)
                }>
                {provincias.map(provincia => (
                  <Picker.Item
                    key={provincia?.id}
                    label={`${provincia?.nombre}`}
                    value={`${provincia?.nombre}`}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.datosContainer}>
            <Text style={styles.titulos}>Nombre Completo</Text>
            <Text style={styles.datos}>{userAuth?.name || ''}</Text>
            <Text style={styles.titulos}>Correo electrónico</Text>
            {console.log("userAuth",userAuth)}
            <Text style={styles.datos}>{userAuth?.email || ''}</Text>
          </View>
          <View style={styles.abilitiesContainer}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.titulos}>Habilidades</Text>
              <Text
                style={{
                  color: '#2E81FB',
                }}
                onPress={() => navigation.navigate('Habilidades')}>
                Editar
              </Text>
            </View>
            <View style={styles.datos}>
              <View style={styles.buttonsContainer}>
                {userAuth?.abilities.slice(0, 3).map((ability, index) => (
                  <AptitudeOffer title={ability} key={index} />
                ))}
                {!expandAptitude
                  ? userAuth?.abilities.length > minAbilities && (
                      <ButtonMoreAbilities
                        buttonStyle={false}
                        titleStyle={false}
                        title={/*`+${minAbilities}`*/"Ver mas"}
                        onPress={() => setExpandAptitude(true)}
                      />
                    )
                  : userAuth?.abilities
                      .slice(2, userAuth?.abilities.length)
                      .map((ability, index) => (
                        <AptitudeOffer title={ability} key={index} />
                      ))}
                {expandAptitude && (
                  <ButtonMoreAbilities
                    buttonStyle={false}
                    titleStyle={false}
                    title={`Ver Menos`}
                    onPress={() => setExpandAptitude(false)}
                  />
                )}
              </View>
            </View>
          </View>
          <View style={styles.descriptionContainer}>
  <View style={styles.tituloyBoton}>
    <Text style={styles.titulos}>Descripción</Text>
  </View>
  <TextInput
    style={styles.textInput}
    onChangeText={setUserDescription}
    value={userDescription}
    multiline={true} // Permitir múltiples líneas
    numberOfLines={4} // Número de líneas visibles
    textAlignVertical="top" // Alinear el texto al inicio
    placeholder="Escribe tu descripción aquí..." // Placeholder para mejorar la UX
  />
</View>
<FormSubmitButton title={uploading ? "Actualizando..." : "Actualizar perfil"} onSubmit={uploadImage} />

{uploading ? (
            <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
          ) :<View style={styles.cvContainer}>
           
          <Text style={styles.titulo}>Currículum Vitae</Text>
    
            <Pressable style={styles.cvButton} onPress={handleCvPicker}>
              <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail" >{cvName ? cvName : "Seleccionar CV"}</Text>
            </Pressable>
    
          
                    <View style={styles.buttonsContainer}>

          <Pressable style={styles.cvButton} onPress={handleCvView}>
              <Text style={styles.buttonText}>  {showPdf ? 'Ocultar CV' : 'Ver CV'}</Text>
            </Pressable>
          <Pressable style={styles.cvButton} onPress={handleCvUpload}>
              <Text style={styles.buttonText} numberOfLines={1} ellipsizeMode="tail" >{"Subir CV"}</Text>
            </Pressable>
            </View>

                   
          {showPdf && pdfPath && (
            <View style={styles.pdfContainer}>
              <Pdf
                source={{ uri: pdfPath, cache: false }}
                style={styles.pdf}
                onLoad={() => console.log('PDF rendered successfully')}
                onError={(error) => console.error('Cannot render PDF', error)}
              />
            </View>
          )}
        </View>} 
        <View style={styles.cvContainer}> 
        <Pressable onPress={handleCertificationPicker}>
        <Text style={{ color: '#2E81FB', fontSize: 18, padding: 10 }}>Añadir Certificación</Text>
      </Pressable>
      
      <Pressable onPress={()=>saveCertifications() }>
        <Text style={{ color: '#2E81FB', fontSize: 18, padding: 10 }}>Guardar Certificación</Text>
      </Pressable>
      {uploading && <ActivityIndicator size="large" color="#0000ff" />}
        <Text style={{ fontSize: 18, paddingVertical: 10 }}>Mis Certificaciones</Text>
      <FlatList


        data={[...certifications, ...dataCertifications] }
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderCertification}
        horizontal
      />
        </View>    
        

      
       {/* Modal para mostrar la imagen seleccionada en grande */}
       <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal} // Para que cierre al tocar fuera en Android
      >
        <TouchableOpacity style={styles.modalContainer} onPress={closeImageModal} activeOpacity={1}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullSizeImage}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
    
      </Modal>
           
        </View>
      </Card>
  
    </View>
  );
}
