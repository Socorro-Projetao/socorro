import { View, Text, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useRef, useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import Loading from '../components/Loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function SignIn() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();

    const emailRef = useRef("");
    const passwordRef = useRef("");

    const handleLogin = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Entrar', 'Por favor preencha todos os campos!');
            return
        }

        setLoading(true);
        const response = await login(emailRef.current, passwordRef.current);
        setLoading(false);
        print( 'Entrar: ', response);
        if (response.success) {
            router.push("home");
        }else{
            Alert.alert('Entrar', response.msg);
        }
    }
    return (
        <CustomKeyboardView>
            <View style={styles.container}>
                <Text style={styles.texto}>Fazer login</Text>

                {/* inputs */}
                <View style={styles.inputs}>
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
                </View>
                <Text style={styles.textLembrar}>Lembrar-me</Text>
                <Text style={styles.textSenha}>Esqueci minha senha</Text>

                <View style={styles.buttonsContainer}>
                    {
                        loading ? (

                            <Loading style={styles.loading} />

                        ) : (
                            <View style={styles.button}>
                                <TouchableOpacity onPress={handleLogin} >
                                    <Text style={styles.buttonText}>Entrar</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }


                    <TouchableOpacity onPress={() => router.push("profileSelection")} style={[styles.button, styles.buttonCadastrar]}>
                        <Text style={styles.buttonText}>Cadastrar-se</Text>
                    </TouchableOpacity>
                </View>
                <Image source={require('../assets/images/logo-bottom.png')}
                    style={styles.image} />
            </View>
        </CustomKeyboardView>
    )
}

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#0F1626',
        paddingTop: hp('20%'),
    },

    texto: {
        color: '#FFFFFF',
        fontSize: hp(4),
        fontWeight: '600',
        fontStyle: 'italic',
        marginBottom: hp('6%'),
    },
    image: {
        width: wp('30%'),
        height: hp('15%'),
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
    textLembrar: {
        fontStyle: 'italic',
        color: '#FFFFFF',
        fontSize: hp(1.5),
        alignItems: 'right',
        marginBottom: hp('4%'),
    },
    textSenha: {
        fontStyle: 'italic',
        color: '#FFFFFF',
        fontSize: hp(2),
        alignItems: 'right',
        marginBottom: hp('4%'),
    },
    buttonsContainer: {
        width: wp('60%'),
        alignItems: 'center',
        marginBottom: hp('4%'),
    },
    button: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: hp('1.5%'),
        borderRadius: 10,
        marginBottom: hp('3%'), // Espaçamento entre os botões
    },
    buttonText: {
        fontSize: hp(2.5),
        color: '#000000',
    },
    buttonCadastrar: {
        // Estilo adicional, se necessário
    },
    loading: {
        // width: wp('20%'),
        // height: hp('10%'), 
    },
}