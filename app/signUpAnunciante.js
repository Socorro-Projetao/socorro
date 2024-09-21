import { View, Text, TouchableOpacity, Pressable, TextInput } from 'react-native'
import React, { useState, useRef } from 'react'
import { useAuth } from '../context/authContext'
import { useRouter } from 'expo-router'
import CustomKeyboardView from '../components/CustomKeyboardView';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function signUpAnunciante() {
    const router = useRouter()
    const { register } = useAuth()
    const [loading, setLoading] = useState(false)

    const nomeFantasiaRef = useRef("")
    const emailAnuncianteRef = useRef("")
    const passwordRef = useRef("")

    const handleRegister = async () => {
        if (!emailAnuncianteRef.current || !passwordRef.current || !nomeFantasiaRef.current) {
            Alert.alert('Cadastro', 'Por favor preencha todos os campos!');
            return false
        }
        setLoading(true)

        let response = await register(emailAnuncianteRef.current, passwordRef.current, nomeFantasiaRef.current)
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
                </View>

                <View style={styles.buttonContainer}>
                    {
                        loading ? (

                            <Loading style={styles.loading} />

                        ) : (
                            <View style={styles.button}>
                                <TouchableOpacity onPress={handlePress} >
                                    <Text style={styles.buttonText}>Cadastrar-se</Text>
                                </TouchableOpacity>
                            </View>
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