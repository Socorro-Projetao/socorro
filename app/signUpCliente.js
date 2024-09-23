import { View, Text, Image, TextInput, TouchableOpacity, Alert, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import * as ImagePicker from 'expo-image-picker';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function SignUpCliente() {

    const router = useRouter();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [telefone, setTelefone] = useState(null);

    const usernameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");

    const handleRegister = async () => {
        if (!emailRef.current || !passwordRef.current || !usernameRef.current || !telefone) {
            //não é necessário inserir imagem de perfil no ato do cadastro
            Alert.alert('Cadastro', 'Por favor preencha todos os campos!');
            return false
        }
        setLoading(true)

        let response = await register(emailRef.current, passwordRef.current, usernameRef.current, profileImage, telefone)
        setLoading(false)

        //console.log('resultado: ', response)
        if (!response.success) {
            Alert.alert('Cadastrar', response.msg)
            return false
        }
        return true

        // processo de registro
    }

    const handlePress = async () => {
        const success = await handleRegister()
        if (success) {  // Primeira função
            router.push("signUpConfirmation");  // Segunda função
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.requestCameraPermissionsAsync();

        //solicitar permissão para acessar galeria
        if (result.granted === false) {
            Alert.alert("Permissão necessária", "é necessário permitir o acesso à galeria para escolher uma imagem.")
            return
        }

        //abrir a galeria
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        })

        if (!pickerResult.canceled) {
            setProfileImage(pickerResult.assets[0].uri)
        }
    }

    return (
        <CustomKeyboardView>
            <View style={styles.container}>
                <Text style={styles.texto}>Preencha os campos abaixo:</Text>

                {/* inputs */}
                <View style={styles.inputs}>
                    <TextInput
                        onChangeText={value => usernameRef.current = value}
                        placeholder="Nome"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => emailRef.current = value}
                        placeholder="E-mail"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => setTelefone(value)}
                        placeholder="Telefone"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => passwordRef.current = value}
                        secureTextEntry
                        placeholder="Senha"
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
                    {
                        loading ? (

                            <Loading style={styles.loading} />

                        ) : (

                            <TouchableOpacity onPress={handlePress} style={styles.button}>
                                <Text style={styles.buttonText}>Cadastrar-se</Text>
                            </TouchableOpacity>

                        )
                    }
                </View>

                <View style={styles.bottom}>
                    <Text style={styles.bottomText}>Já possui uma conta? </Text>
                    <Pressable onPress={() => router.push("signIn")}>
                        <Text style={styles.bottomTextSignIn}>Faça seu login.</Text>
                    </Pressable >
                </View>
            </View>
        </CustomKeyboardView>
    )
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0F1626',
        paddingTop: hp('10%'),
    },

    texto: {
        color: '#FFFFFF',
        fontSize: hp(3),
        fontWeight: '600',
        fontStyle: 'italic',
        marginBottom: hp('6%'),
    },
    inputs: {
        //height: hp(7),
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
        marginTop: hp('6%'),
        marginBottom: hp('3%'), // Espaçamento entre os botões
    },
    buttonText: {
        fontSize: hp(2.5),
        //fontWeight: '600',
        color: '#000000',
    },
    bottom: {
        flexDirection: 'row',
        // Estilo adicional, se necessário
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
        // width: wp('20%'),
        // height: hp('10%'), 
    },
}