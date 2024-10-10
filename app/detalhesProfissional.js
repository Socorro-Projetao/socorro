import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DetalhesProfissional() {
    const router = useRouter();

    const { profissional } = useLocalSearchParams();
    const professionalData = profissional ? JSON.parse(profissional) : null;
    console.log("Profile Picture URI: ", professionalData.profilePicture);

    const handlePhone = (telefone) => {
        const telefoneFormatado = telefone.replace(/[^\d]/g, ''); // retira os caracteres especiais
        const whatsappUrl = `https://wa.me/55${telefoneFormatado}`;
        Linking.openURL(whatsappUrl);
    }

    const handleInstagram = (instagram) => {
        const instagramUrl = `https://www.instagram.com/${instagram.replace('@', '')}`
        Linking.openURL(instagramUrl)
    }
    return (
        <View style={styles.container}>
            {professionalData ? (
                <>
                    <Image
                        source={{ uri: professionalData.profilePicture }}
                        style={styles.profilePicture}
                    />
                    <Text style={styles.label}>
                        <Text style={styles.bold}>Nome: </Text>{professionalData.username}
                    </Text>

                    <View style={styles.phoneInstagramContainer}>
                        <Text style={styles.bold}>Telefone (WhatsApp): </Text>
                        <TouchableOpacity onPress={() => handlePhone(professionalData.telefone)}>
                            <Text style={[styles.bold, styles.link]}>{professionalData.telefone}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.phoneInstagramContainer}>
                        <Text style={styles.bold}>Instagram: </Text>
                        <TouchableOpacity onPress={() => handleInstagram(professionalData.instagram)}>
                            <Text style={[styles.bold, styles.linkInstagram]}>{professionalData.instagram}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>

                        <Text style={styles.bold}>Localização: </Text>{professionalData.localizacao}
                    </Text>

                    <Text style={styles.label}>
                        <Text style={styles.bold}>Sexo: </Text>{professionalData.sexo}
                    </Text>

                    <Text style={styles.label}>

                        <Text style={styles.bold}>Especialidade: </Text>{professionalData.especialidade}

                    </Text>
                    <Text style={styles.label}>

                        <Text style={styles.bold}>Experiência: </Text>{professionalData.experiencia}
                    </Text>

                </>
            ) : (
                <Text>Erro ao carregar os dados do profissional.</Text>
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
        paddingTop: StatusBar.currentHeight,
        padding: 16,
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