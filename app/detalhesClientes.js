import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function detalhesClientes() {
    const router = useRouter();

    const { cliente } = useLocalSearchParams();
    const clienteData = cliente ? JSON.parse(cliente) : null;
    console.log("Profile Picture URI: ", clienteData.profilePicture);

    const handlePhone = (telefone) => {
        const telefoneFormatado = telefone.replace(/[^\d]/g, '');
        const whatsappUrl = `https://wa.me/55${telefoneFormatado}`;
        Linking.openURL(whatsappUrl);
    }

    return (
        <View style={styles.container}>
            {clienteData ? (
                <>
                    <Image
                        source={{ uri: clienteData.profilePicture }}
                        style={styles.profilePicture}
                    />
                    <Text style={styles.label}>
                        <Text style={styles.bold}>Nome: </Text>{clienteData.username}
                    </Text>

                    <View style={styles.phoneInstagramContainer}>
                        <Text style={styles.bold}>Telefone (WhatsApp): </Text>
                        <TouchableOpacity onPress={() => handlePhone(clienteData.telefone)}>
                            <Text style={[styles.bold, styles.link]}>{clienteData.telefone}</Text>
                        </TouchableOpacity>
                    </View>
                   
                </>
            ) : (
                <Text>Erro ao carregar os dados do cliente.</Text>
            )}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.buttonVoltar}>
                    <Text style={styles.buttonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 30,
    },
    label: {
        fontSize: 20,
        marginBottom: hp('3%'),
    },
    bold: {
        fontSize: hp('2.8%'),
        fontWeight: 'bold',
    },
    link: {
        color: '#25D366',
        width: wp('50%'), 
        fontSize: hp('2.2%'), 
    },
    linkInstagram: {
        fontSize: 20,
        color: '#B3279A',
    },
    phoneInstagramContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        marginBottom: hp('3%'),
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#EFC51B',
        alignSelf: 'center',
        marginBottom: hp('3%'),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    buttonText: {
        fontSize: hp(2.5),
        color: '#000000',
    },
    buttonVoltar: {
        width: '50%',
        backgroundColor: '#EFC51B',
        paddingVertical: hp('1.5%'),
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
})