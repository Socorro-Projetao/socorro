import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useAuth } from '../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import moment from 'moment';

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
      {user.profilePicture && (
        <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
      )}

      <View style={styles.infoContainer}>
        {/* Condições pra profissional */}
        {user.role === 'profissional' && (
          <>
            <Text style={styles.label}>
              <Text style={styles.bold}>Nome: </Text>{user.username}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>E-mail: </Text>{user.email}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Telefone: </Text>{user.telefone}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Instagram: </Text>{user.instagram}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Localização: </Text>{user.localizacao}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Data de Nascimento: </Text>{moment(user.dataNascimento.toDate()).format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Sexo: </Text>{user.sexo}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Especialidade: </Text>{user.especialidade}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Experiência: </Text>{user.experiencia}
            </Text>
          </>
        )}

        {/* Pra anunciante */}
        {user.role === 'anunciante' && (
          <>
            <Text style={styles.label}>
              <Text style={styles.bold}>Nome Fantasia: </Text>{user.nomeFantasia}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>E-mail: </Text>{user.email}
            </Text>
          </>
        )}

        {/* Pra cliente */}
        {user.role !== 'profissional' && user.role !== 'anunciante' && (
          <>
            <Text style={styles.label}>
              <Text style={styles.bold}>Nome: </Text>{user.username}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Telefone: </Text>{user.telefone}
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => router.push("profileScreen")} style={styles.buttonVoltar}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("profileUpdate")} style={styles.buttonEditar}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  infoContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: wp('3%'),
    marginBottom: hp('5%'),
  },
  label: {
    fontSize: 20,
    marginBottom: hp('3%'),
  },
  bold: {
    fontWeight: 'bold',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#EFC51B',
    alignSelf: 'center',
    marginBottom: hp('3%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  buttonEditar: {
    width: '50%',
    backgroundColor: '#EFC51B',
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonVoltar: {
    width: '50%',
    backgroundColor: '#D9D9D9',
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp('8%'),
  },
  buttonText: {
    fontSize: hp(2.5),
    color: '#000000',
  }
});
