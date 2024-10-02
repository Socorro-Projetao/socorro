import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAuth } from '../context/authContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import RNPickerSelect from 'react-native-picker-select';
import { especialidades } from './selectOptions';
import { sexoOpcoes } from './selectSexOptions';
import DateTimePicker from '@react-native-community/datetimepicker';
import PesquisaLocalizacao from './pesquisaLocalizacao';

export default function ProfileUpdate() {
  const { user, isAuthenticated, updateUserData } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profilePicture || null);
  const [selectedEspecialidade, setSelectedEspecialidade] = useState(user?.especialidade || "");
  const [experiencia, setExperiencia] = useState(user?.experiencia || "");
  const usernameRef = useRef(user?.username || "");
  const nomeFantasiaRef = useRef(user?.nomeFantasia || "");
  const [sexo, setSexo] = useState(user?.sexo || "");
  const [telefone, setTelefone] = useState(user?.telefone || "");
  const [instagram, setinstagram] = useState(user?.instagram || "");
  const [localizacao, setLocalizacao] = useState(user?.localizacao || "");
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  // Estado para a data de nascimento
  const [dataNascimento, setDataNascimento] = useState(user?.dataNascimento ? new Date(user.dataNascimento.toDate()) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("signIn");
    }
  }, [isAuthenticated]);

  const handleUpdate = async () => {
    const isFormValid = (

      ((user.role === 'profissional' || usernameRef.current || telefone || selectedEspecialidade || experiencia || sexo || instagram | localizacao) ||
        (user.role === 'anunciante' || nomeFantasiaRef.current !== user.nomeFantasia || profileImage !== user.profilePicture) ||
        (user.role === 'user' || usernameRef.current || telefone)
      )
    );

    if (!isFormValid) {
      Alert.alert('Atualizar Perfil', 'Por favor preencha todos os campos obrigatórios!');
      return false;
    }
    setLoading(true);

    try {
      let docRef;

      // Verifica se o usuário está na coleção 'users' ou 'professionals'
      if (user.role === 'profissional') {
        docRef = doc(db, "professionals", user.userId);
      } else if (user.role === 'anunciante') {
        docRef = doc(db, "anunciantes", user.userId);
      } else {
        docRef = doc(db, "users", user.userId);
      }

      // Converter a data para um formato compatível com o Firebase (Timestamp)
      const dataNascimentoFirebase = new Date(
        dataNascimento.getFullYear(),
        dataNascimento.getMonth(),
        dataNascimento.getDate()
      );

      // Atualiza os dados no Firestore
      await updateDoc(docRef, {
        ...(user.role === 'user' && {
          username: usernameRef.current,
          profilePicture: profileImage || user.profilePicture,
          telefone: telefone,
        }),
        ...(user.role === 'profissional' && {
          username: usernameRef.current,
          profilePicture: profileImage || user.profilePicture,
          telefone: telefone,
          especialidade: selectedEspecialidade,
          experiencia: experiencia,
          sexo: sexo,
          instagram: instagram,
          localizacao: localizacao,
          dataNascimento: dataNascimentoFirebase,
        }),
        ...(user.role === 'anunciante' && {
          nomeFantasia: nomeFantasiaRef.current,
          profilePicture: profileImage || user.profilePicture,
        }),
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

  const onChangeDataNascimento = (event, selectedDate) => {
    const currentDate = selectedDate || dataNascimento;
    setShowDatePicker(Platform.OS === 'ios');
    setDataNascimento(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <CustomKeyboardView>
      <View style={styles.container}>
        <Text style={styles.texto}>Atualize seus dados abaixo:</Text>

        <View style={styles.inputs}>
          {user.role === 'anunciante' ? (
            <>
              <TextInput
                defaultValue={user.nomeFantasia}
                onChangeText={value => nomeFantasiaRef.current = value}
                placeholder="Nome Fantasia"
                style={styles.textInput}
              />
              <TouchableOpacity onPress={pickImage}>
                <View style={styles.imagePicker}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  ) : (
                    <Text style={styles.imagePickerText}>Selecionar nova imagem de perfil</Text>
                  )}
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                defaultValue={user.username}
                onChangeText={value => usernameRef.current = value}
                placeholder="Nome"
                style={styles.textInput}
              />
              <TextInput
                defaultValue={user.telefone}
                onChangeText={value => setTelefone(value)}
                placeholder="Telefone"
                style={styles.textInput}
              />
              {user.role === 'profissional' && (
                <>
                  <TextInput
                    defaultValue={user.instagram}
                    onChangeText={value => setinstagram(value)}
                    placeholder="Instagram"
                    style={styles.textInput}
                  />

                  {/* Campo de Localização */}
                  <View style={styles.localizacaoContainer}>
                    {showLocationSearch ? (
                      <PesquisaLocalizacao setLocalizacao={setLocalizacao} />
                    ) : (
                      <TouchableOpacity onPress={() => setShowLocationSearch(true)}>
                        <TextInput
                          value={localizacao}
                          placeholder="Localização"
                          style={styles.textInput}
                          editable={false}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Selector de sexo */}
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      onValueChange={(value) => setSexo(value)}
                      placeholder={{ label: "Selecione seu sexo", value: null }}
                      items={sexoOpcoes}
                      style={pickerSelectStyles}
                      value={sexo}
                    />
                  </View>

                  {/* Selector de especialidade */}
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      onValueChange={(value) => setSelectedEspecialidade(value)}
                      placeholder={{ label: "Selecione sua especialidade", value: null }}
                      items={especialidades}
                      style={pickerSelectStyles}
                      value={selectedEspecialidade}
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

                  {/* Campo de Data de Nascimento */}
                  <View style={styles.inputs}>
                    <TouchableOpacity onPress={showDatepicker}>
                      <TextInput
                        placeholder="Data de Nascimento"
                        style={styles.textInput}
                        value={dataNascimento.toLocaleDateString()}
                        editable={false}
                      />
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={dataNascimento}
                        mode="date"
                        is24Hour={true}
                        display="default"
                        onChange={onChangeDataNascimento}
                      />
                    )}
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
            </>
          )}
        </View>
      </View>

      <View>
        {loading ? (
          <Loading style={styles.loading} />
        ) : (
          <View style={styles.button}>
            <TouchableOpacity onPress={() => router.push("profileScreen")} style={styles.buttonVoltar}>
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePress} style={styles.buttonAtualizar}>
              <Text style={styles.buttonText}>Atualizar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </CustomKeyboardView>
  );
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0F1626',
    paddingTop: hp('10%'),
    paddingBottom: hp('10%'),
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
  },
  localizacaoContainer: {
    width: wp('80%'),
    marginBottom: hp('3%'),
  },
  buttonAtualizar: {
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
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
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
