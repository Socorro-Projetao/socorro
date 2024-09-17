import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';

export default function ProfileRead() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated === undefined) {
    return <Text>Carregando...</Text>;
  }

  if (!isAuthenticated) {
    return <Text>Usuário não logado</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Olá, {user.username}</Text>
      <Text style={styles.email}>E-mail: {user.email}</Text>
      
      {/* Verifica o tipo de usuário e exibe informações específicas */}
      {user.role === 'profissional' && (
        <>
          <Text style={styles.service}>Especialidade: {user.service}</Text>
          <Text style={styles.experiencia}>Experiência: {user.experiencia}</Text>
        </>
      )}

      {user.profilePicture && (
        <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
      )}

      <TouchableOpacity onPress={() => router.push("profileScreen")} style={styles.button}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    marginBottom: 16,
    color: '#000000',
    fontSize: hp(4),
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: hp('4%'),
  },
  email: {
    fontSize: 20,
    marginBottom: hp('3%'),
  },
  area: {
    fontSize: 20,
    marginBottom: hp('3%'),
  },
  service: {
    fontSize: 20,
    marginBottom: hp('3%'),
  },
  experiencia: {
    fontSize: 20,
    marginBottom: hp('3%'),
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#EFC51B',
  },
  button: {
    width: '80%',
    backgroundColor: '#EFC51B',
    marginBottom: hp('3%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: hp(2.5),
    color: '#000000',
  }
});
