import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { getDocs } from 'firebase/firestore';
import { userRef } from '../firebaseConfig';

export default function clientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const snapshot = await getDocs(userRef);
                const clientesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setClientes(clientesList);
            } catch (error) {
                console.error("Erro ao buscar clientes: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    const renderClientes = ({ item }) => (
        <TouchableOpacity
            style={styles.clienteContainer}
            onPress={() => router.push({ pathname: 'detalhesClientes', params: { cliente: JSON.stringify(item) } })}
        >
            <Text style={styles.clienteName}>{item.username}</Text>
            <Text style={styles.clienteTelefone}>{item.telefone}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clientes</Text>
            {loading ? (
                <Text style={styles.loadingText}>Carregando...</Text>
            ) : (
                <FlatList
                    data={clientes}
                    keyExtractor={item => item.id}
                    renderItem={renderClientes}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhum Cliente encontrado.</Text>}
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
    clienteContainer: {
        backgroundColor: '#1F2633',
        padding: wp('4%'),
        marginBottom: hp('2%'),
        borderRadius: 10,
    },
    clienteName: {
        color: '#FFFFFF',
        fontSize: hp('2.5%'),
        fontWeight: 'bold',
    },
    clienteTelefone: {
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
