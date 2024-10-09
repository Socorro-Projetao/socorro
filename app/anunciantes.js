import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { getDocs } from 'firebase/firestore';
import { anunciantesRef } from '../firebaseConfig'; 

export default function anunciantes() {
    const [anunciantes, setAnunciantes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const router = useRouter();

    useEffect(() => {
        const fetchAnunciantes = async () => {
            try {
                const snapshot = await getDocs(anunciantesRef);
                const anunciantesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAnunciantes(anunciantesList);
            } catch (error) {
                console.error("Erro ao buscar anunciantes: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnunciantes();
    }, []);

    const renderAnunciantes = ({ item }) => (
        <TouchableOpacity
            style={styles.anuncianteContainer}
            onPress={() => router.push({ pathname: 'detalhesAnunciantes', params: { anunciante: JSON.stringify(item) } })}
        >
            <Text style={styles.anuncianteName}>{item.nomeFantasia}</Text>
            <Text style={styles.anuncianteTelefone}>{item.email}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Anunciantes</Text>
            {loading ? (
                <Text style={styles.loadingText}>Carregando...</Text>
            ) : (
                <FlatList
                    data={anunciantes}
                    keyExtractor={item => item.id}
                    renderItem={renderAnunciantes}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum Anunciante encontrado.</Text>}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F1626',
        paddingTop: hp('5%'),
        paddingHorizontal: wp('5%'),
    },
    title: {
        color: '#FFFFFF',
        fontSize: hp('4%'),
        fontWeight: '600',
        marginBottom: hp('3%'),
        textAlign: 'center',
    },
    list: {
        paddingBottom: hp('5%'),
    },
    anuncianteContainer: {
        backgroundColor: '#1F2633',
        padding: wp('4%'),
        marginBottom: hp('2%'),
        borderRadius: 10,
    },
    anuncianteName: {
        color: '#FFFFFF',
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
    },
    anuncianteTelefone: {
        color: '#EFC51B',
        fontSize: hp('2%'),
        marginTop: hp('0.5%'),
    },
    emptyText: {
        color: '#FFFFFF',
        fontSize: hp('2.5%'),
        textAlign: 'center',
        marginTop: hp('10%'),
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: hp('2.5%'),
        textAlign: 'center',
        marginTop: hp('10%'),
    },
});
