import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { getDocs } from 'firebase/firestore';  
import { professionalsRef } from '../firebaseConfig'; 

export default function profissionais() {
    const [profissionais, setProfissionais] = useState([]);
    const [loading, setLoading] = useState(true); 
    const router = useRouter();

    useEffect(() => {
        const fetchProfessionals = async () => {
            try {
                const snapshot = await getDocs(professionalsRef);
                const professionalList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProfissionais(professionalList);
            } catch (error) {
                console.error("Erro ao buscar profissionais: ", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchProfessionals();
    }, []);

    const renderProfessional = ({ item }) => (
        <TouchableOpacity
            style={styles.professionalContainer}
            onPress={() => router.push({ pathname: 'detalhesProfissional', params: { profissional: JSON.stringify(item) } })}
        >
            <Text style={styles.professionalName}>{item.username}</Text>
            <Text style={styles.professionalSpecialty}>{item.especialidade}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profissionais</Text>
            {loading ? ( 
                <Text style={styles.loadingText}>Carregando...</Text>
            ) : (
                <FlatList
                    data={profissionais}
                    keyExtractor={item => item.id}
                    renderItem={renderProfessional}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum profissional encontrado.</Text>}
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
    professionalContainer: {
        backgroundColor: '#1F2633',
        padding: wp('4%'),
        marginBottom: hp('2%'),
        borderRadius: 10,
    },
    professionalName: {
        color: '#FFFFFF',
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
    },
    professionalSpecialty: {
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
