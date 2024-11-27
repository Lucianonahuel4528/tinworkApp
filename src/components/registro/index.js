import {Button, Input} from '@rneui/base';
import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {size} from 'lodash';
import {showMessage} from 'react-native-flash-message';

import {validateEmail} from '../../utils/helpers';
import {colors} from '../../constants/colors';
import {createUser} from '../../services/UserService';

export default function Registro({navigation}) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorNombre, setErrorNombre] = useState('');
  const [errorApellido, setErrorApellido] = useState('');
  const [errorCorreo, setErrorCorreo] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');
  const [errorConfirm, setErrorConfirm] = useState('');

  var numeros = '0123456789';

  const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text});
  };

  const registerUser = async () => {
    if (!validateData()) {
      return;
    }

    const user = {
      name: `${formData.nombre} ${formData.apellido}`,
      email: formData.correo,
      pass: formData.password,
    };

    try {
      const userSaved = await createUser(user);
      if (userSaved) {
        navigation.navigate('Habilidades');
      }
    } catch (error) {
      showMessage({
        message:
          error.code === 'auth/email-already-in-use'
            ? 'Ya existe un usuario con ese mail. Pruebe iniciando sesion'
            : 'Ups, hubo un error. Intente nuevamente',
        type: 'danger',
      });
    }
  };

  const tiene_numeros = texto => {
    for (let i = 0; i < texto.length; i++) {
      if (numeros.indexOf(texto.charAt(i), 0) != -1) {
        return true;
      }
    }
    return false;
  };

  const validateData = () => {
    setErrorNombre('');
    setErrorApellido('');
    setErrorCorreo('');
    setErrorContrasena('');
    setErrorConfirm('');
    let isValid = true;

    if (!validateEmail(formData.correo)) {
      setErrorCorreo('Debes ingresar un correo válido');
      isValid = false;
    }

    if (size(formData.nombre) < 3) {
      setErrorNombre('Debes ingresar un nombre de al menos 3 caracteres');
      isValid = false;
    }

    if (tiene_numeros(formData.nombre)) {
      setErrorNombre('Debes ingresar un nombre válido');
      isValid = false;
    }

    if (size(formData.apellido) < 3) {
      setErrorApellido('Debes ingresar un apellido de al menos 3 caracteres');
      isValid = false;
    }

    if (tiene_numeros(formData.apellido)) {
      setErrorApellido('Debes ingresar un apellido válido');
      isValid = false;
    }

    if (size(formData.password) < 6) {
      setErrorContrasena(
        'Debes ingresar una contraseña de al menos 6 caracteres',
      );
      isValid = false;
    }

    if (size(formData.confirm < 6)) {
      setErrorConfirm(
        'Debes ingresar una confirmacion de contraseña de al menos 6 caracteres',
      );
      isValid = false;
    }

    if (formData.confirm !== formData.password) {
      setErrorContrasena('La contraseña y la confirmación deben ser iguales');
      setErrorConfirm('La contraseña y la confirmación deben ser iguales');
      isValid = false;
    }

    return isValid;
  };

  return (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../images/tinwork-logo.png')}
          resizeMode="contain"
          style={styles.image}
        />
      </View>
      <View style={styles.form}>
        <Input
          placeholder="Nombre"
          containerStyle={styles.input}
          onChange={e => onChange(e, 'nombre')}
          errorMessage={errorNombre}
          defaultValue={formData.nombre}
        />
        <Input
          placeholder="Apellido"
          containerStyle={styles.input}
          onChange={e => onChange(e, 'apellido')}
          errorMessage={errorApellido}
          defaultValue={formData.apellido}
        />
        <Input
          placeholder="Correo electrónico"
          containerStyle={styles.input}
          onChange={e => onChange(e, 'correo')}
          keyboardType="email-address"
          errorMessage={errorCorreo}
          defaultValue={formData.correo}
        />
        <Input
          placeholder="Contraseña"
          containerStyle={styles.input}
          password={true}
          secureTextEntry={!showPassword}
          onChange={e => onChange(e, 'password')}
          rightIcon={
            <Icon
              name={showPassword ? 'eyeo' : 'eye'}
              size={22}
              style={styles.ojo}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          errorMessage={errorContrasena}
          defaultValue={formData.password}
        />
        <Input
          placeholder="Repetir contraseña"
          containerStyle={styles.input}
          password={true}
          secureTextEntry={!showPassword}
          onChange={e => onChange(e, 'confirm')}
          rightIcon={
            <Icon
              name={showPassword ? 'eyeo' : 'eye'}
              size={22}
              style={styles.ojo}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          errorMessage={errorConfirm}
          defaultValue={formData.confirm}
        />
        <Button
          title={'Registrate'}
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={() => registerUser()}
        />
      </View>
      <View style={styles.login}>
        <Text>
          Ya tienes una cuenta?{'  '}
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.btnLogin}>Iniciar sesion</Text>
          </TouchableWithoutFeedback>
        </Text>
      </View>
    </>
  );
}

const defaultFormValues = () => {
  return {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    confirm: '',
  };
};

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    height: 150,
    width: '60%',
    marginBottom: 20,
  },
  form: {
    alignItems: 'center',
    width: '100%',
  },
  input: {
    width: '95%',
  },
  btnContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  login: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  btnLogin: {
    color: colors.tinworkBlue,
    fontWeight: 'bold',
  },
  ojo: {
    color: '#c1c1c1',
  },
});
