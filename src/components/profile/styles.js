import {StyleSheet} from 'react-native';
import {FONT_SIZE, FUENTES, fuentes} from '../../utils/constants';
import {colors} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageContainer: {
    display: 'flex',
    height: 120,
    width: 120,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: '#000',
    overflow: 'hidden',
    alignItems: 'center',
    flexBasis: 121,
  },
  abilitiesContainer: {
    marginVertical: 10

  },
  locationContainer: {
    flexBasis: 198,
  },
  descriptionContainer: {
    marginVertical: 10,
    padding: 16, // Padding para evitar que el texto toque los bordes
    backgroundColor: '#f9f9f9', // Fondo claro para diferenciar la sección
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',

  },
  title: {
    fontFamily: FUENTES.BOLD,
    fontSize: FONT_SIZE.xl2,
    color: '#000',
  },
  vistaGeneral: {display: 'flex'},
  descripcion: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  datosContainer: {},
  titulos: {
    fontSize: 20,
    color: 'black',
    marginVertical: 5,
  },
  tituloSecun: {
    marginTop: 10,
    fontSize: 15,
  },
  datos: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
    marginLeft: -5,
  },
  img: {
    height: 120,
    width: 120,
    marginHorizontal: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#000',
  },

  textoImagen: {
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: 'rgb(0, 0, 0)',
    opacity: 0.8,
    color: 'white',
    top: '83%',
  },
  ubicacion: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  texto: {},
  mismatchs: {
    fontSize: 35,
    color: '#000',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
  },
  textInput: {
    height: 100, // Altura suficiente para múltiples líneas
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10, // Padding interno
    fontSize: 16, // Tamaño de fuente adecuado
    color: '#333', // Color de texto
    backgroundColor: '#fff', // Fondo blanco para el TextInput
    textAlignVertical: 'top', // Alinear el texto al inicio
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginTop: 8,
  },
  botonEditar: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: colors.tinworkBlue,
  },
  tituloyBoton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cvContainer: {
    marginVertical: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    //backgroundColor: '#f9f9f9',
  },
  cvButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  cvText: {
    fontSize: 16,
    color: '#333',
  },
  pdfContainer: {
    marginTop: 20,
    height: 300,  // Altura del visor PDF
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  cvContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonsContainer: {
     flexDirection: 'row',
  flexWrap: 'wrap', // Permite que los botones se ajusten a nuevas líneas
  justifyContent: 'flex-start', // Alinea los botones a la izquierda
  marginVertical: 5,
  },
  cvButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pdfContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pdf: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  certificationContainer: {
    position: 'relative', // Para que el ícono se posicione relativo a este contenedor
    margin: 5,
  },
  trashIcon: {
    position: 'absolute', // Posiciona el ícono de forma absoluta
    top: 5, // Ajusta la distancia desde la parte superior
    right: 5, // Ajusta la distancia desde la derecha
    zIndex: 1, // Asegura que el ícono esté por encima de la imagen
  },
  certificationImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  }
});
