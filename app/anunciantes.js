import { View, Text } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function anunciantes() {
    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Anunciantes</Text>
        </View>
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
        marginBottom: hp('6%'),
    },
}