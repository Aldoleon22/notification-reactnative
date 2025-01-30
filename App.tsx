import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  Alert,
  Platform
} from 'react-native';
import messaging from '@react-native-firebase/messaging';

async function requestPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('✅ Permission des notifications accordée.');
    } else {
        console.log('❌ Permission refusée.');
        Alert.alert("Permission refusée", "Activez les notifications dans les paramètres.");
    }
}

async function getToken() {
    try {
        const token = await messaging().getToken();
        console.log('🔹 FCM Token:', token); // Affichage du token dans la console
        return token;
    } catch (error) {
        console.error("⚠️ Erreur lors de la récupération du token:", error);
    }
}

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const [token, setToken] = useState('');

    useEffect(() => {
        if (Platform.OS === 'android') {
            requestPermission();
        }

        async function fetchToken() {
            const fcmToken = await getToken();
            if (fcmToken) {
                setToken(fcmToken);
                console.log("📲 FCM Token Stocké:", fcmToken); // Vérification du stockage du token
            }
        }

        fetchToken();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDarkMode ? 'black' : 'white' }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <Text style={{ fontSize: 18 }}>📲 Mon Token FCM:</Text>
            <Text style={{ fontSize: 14, color: 'blue', marginTop: 10 }}>{token ? token : "En attente..."}</Text>
        </SafeAreaView>
    );
}

export default App;
