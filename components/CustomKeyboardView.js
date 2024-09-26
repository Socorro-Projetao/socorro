import {KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const isIOS = Platform.OS == 'ios'

export default function CustomKeyboardView({children}) {
  return (
    <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        style={styles.container}
    >
        <KeyboardAwareScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            enableOnAndroid={true}
            extraScrollHeight={100}
        >
         {children}
        </KeyboardAwareScrollView>
        {/* <ScrollView
            style={styles.scrollView}
            bounces= {false}
            showsVerticalScrollIndicator={false}
        > */}
    </KeyboardAvoidingView>
  )
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: '#0F1626',
    },
    scrollView: {
        flex: 1,
    }
}