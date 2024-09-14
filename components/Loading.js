import { View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

export default function Loading({ style }) {
  return (
    <View style={[styles.loading, style]}>
      <LottieView style={styles.animation} source={require('../assets/images/loading.json')} autoPlay loop/>
    </View>
  )
}

const styles = {
  loading: {
    aspectRatio: 1,

    alignItems: 'center',
 
  },
  animation: {
    width: '50%',
    height: '50%',
  }
}