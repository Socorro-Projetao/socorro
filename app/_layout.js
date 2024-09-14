import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from "expo-router";
import "../global.css";
import { useAuth } from "../context/authContext"
import { AuthContextProvider } from '../context/authContext';
import { MenuProvider } from 'react-native-popup-menu';

const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (typeof isAuthenticated == "undefined") return;
        const inApp = segments[0] == "(app)";
        //router.replace("startPage");

        if (isAuthenticated && !inApp) {
            setTimeout(() => {
                router.replace("home");
            }, 1000);
        } else if (isAuthenticated == false) {
            setTimeout(() => {
                router.replace("signIn");
            }, 1000);
        }
    }, [isAuthenticated])

    return <Slot />
}

export default function RootLayout() {
    return (
        <MenuProvider>
            <AuthContextProvider>
                <MainLayout />
            </AuthContextProvider>
        </MenuProvider>

    )
}