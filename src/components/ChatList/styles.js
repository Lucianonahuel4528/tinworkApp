import {StyleSheet} from 'react-native';
import {FONT_SIZE, FUENTES, fuentes} from '../../utils/constants';

export const styles = StyleSheet.create({
  containerrrr: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
  img: {
    height: 45,
    width: 45,
    marginHorizontal: 5,
  },
  ubicacion: {
    marginTop: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  texto: {
    marginHorizontal: 5,
  },
  mismatchs: {
    fontSize: 35,
    color: '#000',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 5,
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
  img: {
    height: 120,
    width: 120,
    marginHorizontal: 5,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#000',
  },
});
