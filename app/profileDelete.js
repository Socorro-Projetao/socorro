import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc, getDoc } from 'firebase/firestore'; // Adicionei getDoc
import moment from 'moment';

export default function ProfileDelete() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  if (isAuthenticated === undefined) {
    return <Text>Carregando...</Text>;
  }

  if (!isAuthenticated) {
    return <Text>Usuário não logado</Text>;
  }

  const handleDelete = () => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir seu perfil? Esta ação é irreversível.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const auth = getAuth();
              const db = getFirestore();
              const userToDelete = auth.currentUser;
              if (userToDelete) {
                const userId = userToDelete.uid; // UID está correto

                // 1. Excluir o documento do usuário da coleção 'users'
                const userDocRef = doc(db, 'users', userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                  await deleteDoc(userDocRef);
                } else {
                  // 2. Excluir o documento do usuário da coleção 'professionals' se não estiver na coleção 'users'
                  const professionalDocRef = doc(db, 'professionals', userId);
                  const professionalDoc = await getDoc(professionalDocRef);

                  if (professionalDoc.exists()) {
                    await deleteDoc(professionalDocRef);
                  } else {
                    console.log('Usuário não encontrado em nenhuma coleção.');
                    throw new Error('Usuário não encontrado nas coleções.');
                  }
                }

                // 3. Excluir o usuário do Firebase Authentication
                await deleteUser(userToDelete);

                // 4. Fazer logout e redirecionar para a tela de login
                logout();
                router.push('/signIn');
              }
            } catch (error) {
              console.error('Erro ao excluir perfil:', error);
              Alert.alert('Erro', 'Ocorreu um erro ao excluir o perfil. Tente novamente mais tarde.');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {user.profilePicture && (
        <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
      )}

      <View style={styles.infoContainer}>
        {user.role === 'anunciante' ? (
          <>
            <Text style={styles.label}>
              <Text style={styles.bold}>Nome Fantasia: </Text>{user.nomeFantasia}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>E-mail: </Text>{user.email}
            </Text>
          </>
        ) : (
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

            {user.role === 'profissional' && (
              <>
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
      <TouchableOpacity onPress={handleDelete} style={styles.buttonExcluir}>
        <Text style={styles.buttonText}>Excluir Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0F1626',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: hp('2%'),
    borderWidth: 2,
    borderColor: '#EFC51B',
  },
  infoContainer: {
    width: '100%',
    paddingHorizontal: wp('5%'),
    //alignItems: 'left',
    //marginLeft: hp('10%'),
    marginBottom: hp('5%'),
  },
  label: {
    fontSize: hp('2%'),
    marginBottom: hp('1%'),
    color: '#fff',
    flexWrap: 'wrap',
    width: '100%',
  },
  bold: {
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('2%')
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
  buttonEditar: {
    width: '50%',
    backgroundColor: '#EFC51B',
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonExcluir: {
    width: '50%',
    backgroundColor: '#E58B8B',
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: hp(2.5),
  },
});