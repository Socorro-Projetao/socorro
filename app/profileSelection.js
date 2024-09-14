import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';


export default function profileSelection() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione seu perfil</Text>
      <TouchableOpacity onPress={() => router.push("signUpCliente")} style={styles.option}>
        <Text style={styles.optionText}>Cliente</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("signUpProfissional")} style={styles.option}>
        <Text style={styles.optionText}>Profissional</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0F1626',
    paddingTop: hp('20%'),
  },
  title: {
    color: '#FFFFFF',
    fontSize: hp(3),
    fontWeight: '600',
    marginBottom: hp('6%'),
  },
  option: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: hp('3%'),
    width: wp('60%'),
  },
  optionText: {
    color: '#000000',
    textAlign: 'center',
    fontSize: hp(2.5),
  }
}