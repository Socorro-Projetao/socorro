import { View, Text, Image, TextInput, TouchableOpacity, Alert, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import * as ImagePicker from 'expo-image-picker';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';
import RNPickerSelect from 'react-native-picker-select';
import { especialidades } from './selectOptions';

export default function SignUpProfissional() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [selectedEspecialidade, setselectedEspecialidade] = useState(null)
    const [experiencia, setExperiencia] = useState(null);
    const [sexo, setSexo] = useState(null);
    const [telefone, setTelefone] = useState(null);
    const [redeSocial, setRedeSocial] = useState(null);
    const [localizacao, setLocalizacao] = useState(null);
    const usernameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const { registerProfessional } = useAuth();

    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !selectedEspecialidade || !experiencia) {
            Alert.alert('Cadastro', 'Por favor preencha todos os campos!');
            return false;
        }

        setLoading(true);
        const response = await registerProfessional(emailRef.current, passwordRef.current, usernameRef.current, profileImage, selectedEspecialidade, sexo, telefone, redeSocial, experiencia, localizacao);
        setLoading(false);

        if (!response.success) {
            Alert.alert('Cadastro', response.msg);
            return false;
        }
        //router.push("signUpConfirmation");
        return true;
    }

    const handlePress = () => {
        if (handleRegister()) {  // Primeira função
            router.push("signUpConfirmation");  // Segunda função
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
    }

    return (
        <CustomKeyboardView>
            <View style={styles.container}>
                <Text style={styles.texto}>Preencha os campos abaixo:</Text>

                {/* Inputs */}
                <View style={styles.inputs}>
                    <TextInput
                        onChangeText={value => usernameRef.current = value}
                        placeholder="Nome do usuário"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => emailRef.current = value}
                        placeholder="E-mail"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => passwordRef.current = value}
                        secureTextEntry
                        placeholder="Senha"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => setSexo(value)}
                        placeholder="Sexo"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => setTelefone(value)}
                        placeholder="Telefone"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => setRedeSocial(value)}
                        placeholder="Rede social"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => setLocalizacao(value)}
                        placeholder="Localização"
                        style={styles.textInput}
                    />
                </View>

                {/* Selector de área */}
                <View style={styles.pickerContainer}>
                    <RNPickerSelect
                        onValueChange={(value) => setselectedEspecialidade(value)}
                        placeholder={{ label: "Selecione sua especialidade", value: null }}
                        items={especialidades}
                        style={pickerSelectStyles}
                    />
                </View>

                {/* Campo de experiência */}
                <View style={styles.inputs}>
                    <TextInput
                        onChangeText={value => setExperiencia(value)}
                        placeholder="Experiência"
                        style={styles.textInput}
                    />
                </View>

                {/* Campo para selecionar a imagem de perfil */}
                <TouchableOpacity onPress={pickImage}>
                    <View style={styles.imagePicker}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Text style={styles.imagePickerText}>Selecionar imagem de perfil</Text>
                        )}
                    </View>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    {loading ? (
                        <Loading style={styles.loading} />
                    ) : (
                        <View style={styles.button}>
                            <TouchableOpacity onPress={handlePress}>
                                <Text style={styles.buttonText}>Cadastrar-se</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.bottomText}>Já possui uma conta? </Text>
                    <Pressable onPress={() => router.push("signIn")}>
                        <Text style={styles.bottomTextSignIn}>Faça seu login.</Text>
                    </Pressable>
                </View>
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
