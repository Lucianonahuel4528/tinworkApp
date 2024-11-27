import React from 'react';
import {Animated, Text, View} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Entypo';
import FormSubmitButton from '../form-submit-button';
import {styles} from './style';

export default function DefaultCard({ ...rest }) {
  return (
    <Animated.View style={[styles.container]} {...rest}>
      <View style={styles.shadow}>
        <View style={styles.card}>
          <Text
            style={[styles.title, {alignSelf:"center", paddingBottom: '5%', paddingTop: '5%'}]}>
            No hay más ofertas disponibles
          </Text>
        
          
          <Text style={styles.description}>
            Lo sentimos, ya no hay más ofertas disponibles para ti en este momento.
          </Text>
          <Text
            style={{
              textAlign: 'center',
              paddingTop: '5%',
              color: '#2E81FB',
            }}
            onPress={() => {/* Aquí podrías agregar una acción, como recargar las ofertas, o ir al inicio */}}>
            Volver al inicio
          </Text>
          <FormSubmitButton
           title={'Cargar más'}
           buttonStyle={{marginHorizontal: 15, marginVertical: 15}}
           onSubmit={() => {
          //  getAbilitiesByUidUser();
          //    findOffersByAbilities();
             showMessage({
              message: 'Ofertas Cargadas',
              type: 'success',
            });
           }}
         />
        </View>
      </View>
    </Animated.View>
  );
}
