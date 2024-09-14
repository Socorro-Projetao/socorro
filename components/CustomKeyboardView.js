import {KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React from 'react'

const isIOS = Platform.OS == 'ios'

export default function CustomKeyboardView({children}) {
  return (
    <KeyboardAvoidingView
        behavior={isIOS ? 'padding' : 'height'}
        style={styles.container}
    >
        <ScrollView
            style={styles.scrollView}
            bounces= {false}
            showsVerticalScrollIndicator={false}
        >
            {children}
        </ScrollView>
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