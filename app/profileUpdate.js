import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../context/authContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import { areas, services } from './selectOptions';


export default function ProfileUpdate() {
  const { user, isAuthenticated, updateUserData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profilePicture || null);
  const [selectedArea, setSelectedArea] = useState(user?.area || "");
  const [selectedService, setSelectedService] = useState(user?.service || "");
  const [experiencia, setExperiencia] = useState(user?.experiencia || "");
  const usernameRef = useRef(user?.username || "");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("signIn");
    }
  }, [isAuthenticated]);

  const handleUpdate = async () => {
    if (!usernameRef.current || (user.role === 'profissional' && (!selectedArea || !selectedService || !experiencia))) {
      Alert.alert('Atualizar Perfil', 'Por favor preencha todos os campos!');
      return false;
    }
    setLoading(true);

    try {
      let docRef;

      // Verifica se o usuário está na coleção 'users' ou 'professionals'
      if (user.role === 'profissional') {
        docRef = doc(db, "professionals", user.userId);
      } else {
        docRef = doc(db, "users", user.userId);
      }

      // Atualiza os dados no Firestore
      await updateDoc(docRef, {
        username: usernameRef.current,
        profilePicture: profileImage || user.profilePicture,
        ...(user.role === 'profissional' && {
          area: selectedArea,
          service: selectedService,
          experiencia: experiencia
        })
      });

      // Atualiza os dados no AuthContext
      await updateUserData(user.userId);

      setLoading(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      return true;
    } catch (error) {
      setLoading(false);
      console.error("Erro ao atualizar o perfil: ", error.message);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
      return false;
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.requestCameraPermissionsAsync();

    if (result.granted === false) {
      Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria para escolher uma imagem.");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfileImage(pickerResult.assets[0].uri);
    }
  };

  const handlePress = async () => {
    const success = await handleUpdate();
    if (success) {
      router.push("profileScreen");
    }
  };

  return (
    <CustomKeyboardView>
      <View style={styles.container}>
        <Text style={styles.texto}>Atualize seus dados abaixo:</Text>

        <View style={styles.inputs}>
          <TextInput
            defaultValue={user.username}
            onChangeText={value => usernameRef.current = value}
            placeholder="Nome do usuário"
            style={styles.textInput}
          />
        </View>

        {user.role === 'profissional' && (
          <>
            {/* Selector de área */}
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedArea(value)}
                placeholder={{ label: "Selecione a área de atuação", value: null }}
                items={areas}
                style={pickerSelectStyles}
                value={selectedArea}
              />
            </View>

            {/* Selector de serviço */}
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedService(value)}
                placeholder={{ label: "Selecione o serviço", value: null }}
                items={services}
                style={pickerSelectStyles}
                value={selectedService}
              />
            </View>

            <View style={styles.inputs}>
              <TextInput
                defaultValue={user.experiencia}
                onChangeText={value => setExperiencia(value)}
                placeholder="Experiência"
                style={styles.textInput}
              />
            </View>
          </>
        )}

        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imagePicker}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imagePickerText}>Selecionar nova imagem de perfil</Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {loading ? (
            <Loading style={styles.loading} />
          ) : (
            <View style={styles.button}>
              <TouchableOpacity onPress={handlePress}>
                <Text style={styles.buttonText}>Atualizar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={() => router.push("profileScreen")} style={styles.buttonVoltar}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </CustomKeyboardView>
  );
}
const styles = {
  container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#0F1626',
      paddingTop: hp('15%'),
  },
  texto: {
      color: '#FFFFFF',
      fontSize: hp(3),
      fontWeight: '600',
      fontStyle: 'italic',
      marginBottom: hp('6%'),
  },
  inputs: {
      width: wp('80%'),
  },
  textInput: {
      fontStyle: 'italic',
      width: '100%',
      padding: hp('2%'),
      backgroundColor: '#FFFFFF',
      color: '#000000',
      borderRadius: 10,
      marginBottom: hp('3%'),
  },
  pickerContainer: {
      width: wp('80%'),
      marginBottom: hp('3%'),
  },
  buttonContainer: {
      width: wp('60%'),
      alignItems: 'center',
      marginBottom: hp('4%'),
  },
  button: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: '#EFC51B',
      paddingVertical: hp('1.5%'),
      borderRadius: 10,
      marginBottom: hp('3%'),
  },
  buttonText: {
      fontSize: hp(2.5),
      color: '#000000',
  },
  imagePicker: {
      width: wp('80%'),
      height: hp('15%'),
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      marginBottom: hp('3%'),
  },
  imagePickerText: {
      color: '#000000',
      fontSize: hp(2),
      fontWeight: '600',
  },
  profileImage: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
  },
  bottom: {
      flexDirection: 'row',
  },
  bottomText: {
      fontSize: hp(1.8),
      color: '#FFFFFF',
  },
  bottomTextSignIn: {
      fontSize: hp(1.8),
      color: '#EFC51B',
      fontWeight: '600',
  },
  loading: {
      // estilos adicionais se necessário
  },
};

const pickerSelectStyles = {
  inputIOS: {
      fontSize: hp(2),
      width: '100%',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: '#000000',
      backgroundColor: '#FFFFFF',
      marginBottom: hp('3%'),
      fontStyle: 'italic',
  },
  inputAndroid: {
      fontSize: hp(2),
      width: '100%',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 10,
      color: '#000000',
      backgroundColor: '#FFFFFF',
      marginBottom: hp('3%'),
      fontStyle: 'italic',
  },
  placeholder: {
      fontStyle: 'italic',
      color: 'gray',
  },
};
