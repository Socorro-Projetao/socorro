import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';

export default function admin() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.texto}>BEM-VINDO, ADMINISTRADOR</Text>
            <TouchableOpacity onPress={() => router.push("clientes")} style={styles.button}>
                <Text style={styles.buttonText}>Clientes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("profissionais")} style={styles.button}>
                <Text style={styles.buttonText}>Profissionais</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("anunciantes")} style={styles.button}>
                <Text style={styles.buttonText}>Anunciantes</Text>
            </TouchableOpacity>
        </View>
    )
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
        marginBottom: hp('6%'),
    },
    button: {
        width: '80%',
        alignItems: 'center',
        backgroundColor: '#EFC51B',
        paddingVertical: hp('1.5%'),
        borderRadius: 10,
        marginBottom: hp('3%'), // Espaçamento entre os botões
    },
    buttonText: {
        fontSize: hp(2.5),
        color: '#000000',
    },
}