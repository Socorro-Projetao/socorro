import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';

export default function SignUpConfirmation() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Cadastro realizado com sucesso!</Text>
      </View>
      <TouchableOpacity onPress={() => router.push('signIn')} style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F1626',
    //paddingTop: hp('20%'),
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: wp('10%'),
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    //padding: wp('10%')
  },
  button: {
    width: wp('60%'),
    marginBottom: hp('4%'),
    alignItems: 'center',
    backgroundColor: '#EFC51B',
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    marginTop: hp('6%'),
  
  },
  buttonText: {
    fontSize: hp(2.5),
    color: '#000000',
  }
}