import { View, Text, ActivityIndicator, Image} from 'react-native'
import React from 'react'


export default function HomeProfissional () {
    return(
        <View style={styles.container}>
            <Image source={require('../../assets/images/logo-SOCORRO.png')}
            style={styles.image}/>
        </View>
    )
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F1626', // Cor de fundo
    },
    image: {
        width: 430, // Largura da imagem
        height: 407.06, // Altura da imagem
        marginBottom: 20, // Espaço abaixo da imagem
    },
}