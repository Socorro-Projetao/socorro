import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function profileScreen() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu perfil</Text>
      <TouchableOpacity onPress={() => router.push("profileRead")} style={[styles.button]}>
          <Text style={styles.buttonText}>Visualizar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("profileUpdate")} style={[styles.button]}>
          <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("profileDelete")} style={[styles.buttonRemover]}>
          <Text style={styles.buttonText}>Remover</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("home")} style={[styles.buttonVoltar]}>
          <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
    backgroundColor: '#0F1626',
  },
  title: {
    fontSize: hp(3),
    //marginBottom: hp(3),
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: hp('6%'),
  },
  button: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    marginBottom: hp('3%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: hp(2.5),
    color: '#000000',
  },
  buttonRemover: {
    width: '80%',
    backgroundColor: '#E58B8B',
    marginBottom: hp('3%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonVoltar: {
    width: '80%',
    backgroundColor: '#EFC51B',
    marginTop: hp('5%'),
    marginBottom: hp('3%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextVoltar: {

  }
});