import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function OpcoesPesquisa() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("pesquisaLocalizacao")} style={styles.button}>
        <Text style={styles.buttonText}>Pesquisar por localização</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("pesquisaEspecialidade")} style={styles.button}>
        <Text style={styles.buttonText}>Pesquisar por especialidade</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("pesquisaProfissional")} style={styles.button}>
        <Text style={styles.buttonText}>Pesquisar por profissional</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = {
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f0f0', 
  },
  button: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: '#EFC51B',
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    marginBottom: hp('3%'), // Espaçamento entre os botões
  },
  buttonText: {
    fontSize: hp(2.5),
    color: '#000000',
  },
}