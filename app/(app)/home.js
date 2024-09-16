import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/authContext'
import { useRouter } from 'expo-router';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function Home() {
  const router = useRouter();

  //const { logout, user } = useAuth()

  // const handleLogout = async () => {
  //   await logout()
  // }
  //console.log("usuário: ", user)
  return (
    <View style={styles.container}>
      {/* <Text>Home</Text>
      <Pressable onPress={handleLogout}>
        <Text>Sair</Text>
      </Pressable> */}
      <TouchableOpacity onPress={() => router.push("profileSelection")} style={styles.button}>
        <Text style={styles.buttonText}>Cadastrar outro usuário</Text>
      </TouchableOpacity>
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