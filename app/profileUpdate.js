import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, Platform,FlatList, SafeAreaView } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
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
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import s3 from './aws-config';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

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
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [localizacao, setLocalizacao] = useState(user?.localizacao || "");
  const [showLocationSearch, setShowLocationSearch] = useState(false);

  // Estado para a data de nascimento
  const [dataNascimento, setDataNascimento] = useState(user?.dataNascimento ? new Date(user.dataNascimento.toDate()) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("signIn");
    }
  }, [isAuthenticated]);
  const fetchLocations = async (input) => {
    const apiKey = 'AIzaSyCxzN0sraj4AJtLGMO0YQr2Kpx6B76HRp8';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=geocode&language=pt_BR&components=country:BR&key=${apiKey}`;
    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            setSuggestions(response.data.predictions.map(prediction => prediction.description));
        }
    } catch (error) {
        console.error(error);
    }
};

const handleSearchChange = (text) => {
    setSearch(text);
    if (text.length > 2) { 
        fetchLocations(text);
    } else {
        setSuggestions([]);
    }
};



const handleSuggestionSelect = (suggestion) => {
    console.log(`Selecionado: ${suggestion}`);
    setSearch(suggestion);
    setSuggestions([]);

    if (setLocalizacao) {
        setLocalizacao(suggestion);
    }
};


  const handleUpdate = async () => {
    const isFormValid = (

      ((user.role === 'profissional' || usernameRef.current || telefone || selectedEspecialidade || experiencia || sexo || instagram | localizacao) ||
        (user.role === 'anunciante' || nomeFantasiaRef.current !== user.nomeFantasia || profileImage !== user.profilePicture) ||
        (user.role === 'user' || usernameRef.current || telefone)
      )
    );
     // Verificação da data de nascimento
  const today = new Date();
  const idadeMinima = 18; 
  const dataNascimentoValida = dataNascimento instanceof Date && !isNaN(dataNascimento);
  const idade = today.getFullYear() - dataNascimento.getFullYear();
  
  
  if (!dataNascimentoValida || idade < idadeMinima) {
    Alert.alert('Você deve ter pelo menos 18 anos e fornecer uma data de nascimento válida.');
    return false;
  }

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

      const uploadImageToS3 = async (imageUri) => {
        try {
          const response = await fetch(imageUri);
          const blob = await response.blob();
          const fileType = imageUri.split('.').pop();
          const fileName = `${uuidv4()}.${fileType}`;
          
          const params = {
            Bucket: 'socorroprojeto',
            Key: fileName,
            Body: blob,
            ContentType: blob.type,
          };

          const data = await s3.upload(params).promise();
          return data.Location;
        } catch (error) {
          console.log('Erro no upload: ', error);
          throw new Error('Falha ao fazer o upload da imagem');
        }
      };

      let profileImageUrl = user.profilePicture;
      if (profileImage && profileImage !== user.profilePicture) {
        profileImageUrl = await uploadImageToS3(profileImage);
      }

      await updateDoc(docRef, {
        ...(user.role === 'user' && {
          username: usernameRef.current,
          profilePicture: profileImageUrl,
          telefone: telefone,
        }),
        ...(user.role === 'profissional' && {
          username: usernameRef.current,
          profilePicture: profileImageUrl,
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
          profilePicture: profileImageUrl || user.profilePicture,
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
              <TextInputMask
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99)'
                }}
                onChangeText={value => setTelefone(value)}
                placeholder="Telefone"
                style={styles.textInput}
                value={telefone}
              />
              {user.role === 'profissional' && (
                <>
                  <TextInput
                    onChangeText={(value) => {
                      if (!value.startsWith('@')) {
                        setInstagram(`@${value.replace('@', '')}`);
                      } else {
                        setInstagram(value);
                      }
                    }}
                    value={instagram}
                    placeholder="Instagram"
                    style={styles.textInput}
                  />
                  {/* <TextInput
                    defaultValue={user.instagram}
                    onChangeText={value => setinstagram(value)}
                    placeholder="Instagram"
                    style={styles.textInput}
                  /> */}

                  {/* Campo de Localização */}
                  <View style={styles.localizacaoContainer}>
                    {showLocationSearch ? (
                      <SafeAreaView style={styles.containerLOC}>
                        <View style={styles.searchBar}>
                          <TextInput
                            style={styles.input}
                            placeholder='Digite a localização'
                            //autoCorrect={false}
                            //autoComplete='none'
                            value={search}
                            onFocus={() => setIsFocused(true)}  // Quando o campo é focado
                            onBlur={() => setIsFocused(false)}  // perde o foco
                            onChangeText={handleSearchChange}
                          />
                         
                          {search.length > 0 && (
                            <AntDesign
                              name='close'
                              size={25}
                              color='#0F1626'
                              onPress={() => {
                                setSearch('');
                                setSuggestions([]);
                              }}
                              style={styles.iconClose}
                            />
                          )}
                        </View>

                        <FlatList
                          data={suggestions}
                          renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSuggestionSelect(item)}>
                              <Text style={styles.suggestionText}>{item}</Text>
                            </TouchableOpacity>
                          )}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </SafeAreaView>
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

                  {/* Selector de experiência */}
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
    marginRight: wp('5%'),
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginLeft: wp('10%'),
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
  containerLOC: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    marginBottom: wp(5),
    borderRadius: 10
},
searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    margin: wp(2),
    padding: wp(0)
},
input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#0F1626',
    margin: wp(1)
},
iconClose: {
    marginLeft: wp(2),
},
suggestionItem: {
    backgroundColor: '#e0e0e0',
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
suggestionText: {
    fontSize: 16,
    color: '#000',
    margin: wp(2),
    paddingLeft: 3
},
loading: {
    width: wp('20%'),
    height: hp('10%'), 
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
