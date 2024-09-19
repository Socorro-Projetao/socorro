import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/authContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { getAuth, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore'; // Importe se usar o Firestore

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
              const userToDelete = auth.currentUser;
              if (userToDelete) {
                // 1. Exclui o usuário do Firebase Authentication
                await deleteUser(userToDelete);
                
                // 2. Exclui outros dados do usuário 
                if (db) { // Verifica se o Firestore está sendo usado
                  const userDocRef = doc(db, 'users', user.userId); 
                  let userDoc = await getDoc(userDocRef);
                  if (userDoc.exists()){
                    await deleteDoc(userDocRef);
                  }else{
                    await deleteDoc(doc(db, 'professionals', user.userId));
                }
                }
                // Adicione a lógica para excluir dados de outras coleções, se necessário

                // 3. Faça logout do usuário
                logout();

                // 4. Redirecione para a tela de login
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
        <Text style={styles.label}>
          <Text style={styles.bold}>Nome: </Text>{user.username}
        </Text>
        <Text style={styles.label}>
          <Text style={styles.bold}>E-mail: </Text>{user.email}
        </Text>

        {user.role === 'profissional' && (
          <>
            <Text style={styles.label}>
              <Text style={styles.bold}>Especialidade: </Text>{user.especialidade}
            </Text>
            <Text style={styles.label}>
              <Text style={styles.bold}>Experiência: </Text>{user.experiencia}
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
        <TouchableOpacity onPress={handleDelete} style={styles.buttonExcluir}>
          <Text style={styles.buttonText}>Excluir Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (estilos existentes) ...

  buttonExcluir: {
    width: '50%',
    backgroundColor: 'red', // Cor vermelha para indicar ação destrutiva
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});