import { View, Text, TouchableOpacity, Pressable, TextInput, Alert, Image } from 'react-native'
import React, { useState, useRef } from 'react'
import { useAuth } from '../context/authContext'
import { useRouter } from 'expo-router'
import CustomKeyboardView from '../components/CustomKeyboardView';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '../components/Loading';
import * as ImagePicker from 'expo-image-picker';
import s3 from './aws-config'; 
import 'react-native-get-random-values'; 
import { v4 as uuidv4 } from 'uuid'; 

export default function signUpAnunciante() {
    const router = useRouter()
    const { registerAnunciante } = useAuth()
    const [loading, setLoading] = useState(false)

    const nomeFantasiaRef = useRef("")
    const emailAnuncianteRef = useRef("")
    const passwordRef = useRef("")
    const [profileImage, setProfileImage] = useState(null);

    const uploadImageToS3 = async (imageUri) => {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            const fileType = imageUri.split('.').pop();
            const fileName = `${uuidv4()}.${fileType}`;
            
            const params = {
                Bucket: 'socorroprojeto', // Substitua pelo nome do bucket
                Key: fileName,
                Body: blob,
                ContentType: blob.type,
               // ACL: 'public-read',
            };

            const data = await s3.upload(params).promise();
            return data.Location; // Retorna a URL pública da imagem
        } catch (error) {
            console.log('Erro no upload: ', error);
            throw new Error('Falha ao fazer o upload da imagem');
        }
    };

    const handleRegister = async () => {
        if (!emailAnuncianteRef.current || !passwordRef.current || !nomeFantasiaRef.current || !profileImage) {
            Alert.alert('Cadastro', 'Por favor preencha todos os campos!');
            return false
        }
        setLoading(true)

        let imageUrl = null;
        
        if (profileImage) {
            try {
                imageUrl = await uploadImageToS3(profileImage);
            } catch (error) {
                setLoading(false);
                Alert.alert('Erro', 'Não foi possível fazer o upload da imagem.');
                return false;
            }
        }

        let response = await registerAnunciante(emailAnuncianteRef.current, passwordRef.current, nomeFantasiaRef.current, imageUrl)
        setLoading(false)

        if (!response.success) {
            Alert.alert('Cadastrar', response.msg)
            return false
        }
        return true
    }

    const handlePress = async () => {
        const success = await handleRegister()
        if (success) {
            router.push("signUpConfirmation");
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

                <View style={styles.inputs}>
                    <TextInput
                        onChangeText={value => nomeFantasiaRef.current = value}
                        placeholder="Nome Fantasia"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => emailAnuncianteRef.current = value}
                        placeholder="E-mail Corpotativo"
                        style={styles.textInput}
                    />
                    <TextInput
                        onChangeText={value => passwordRef.current = value}
                        secureTextEntry
                        placeholder="Senha"
                        style={styles.textInput}
                    />
                    <TouchableOpacity onPress={pickImage}>
                    <View style={styles.imagePicker}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <Text style={styles.imagePickerText}>Selecionar imagem de perfil</Text>
                        )}
                    </View>
                </TouchableOpacity>
                </View>

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
        marginBottom: hp('3%'),
    },
    buttonText: {
        fontSize: hp(2.5),
        color: '#000000',
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
}