import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Drawer } from 'expo-router/drawer'
import 'react-native-gesture-handler';
import HomeHeader from '../../components/HomeHeader'
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/authContext';

function CustomDrawerContent({ navigation, isClient }) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>SOCORRO!!</Text>
      </View>
      <View style={styles.drawerMenu}>
        <View style={styles.menuItem}>
          <MaterialIcons name="search" size={24} color="black" />
          <Text style={styles.menuItemText}>Buscar por:</Text>
        </View>
        <TouchableOpacity
          disabled={!isClient}
          onPress={() => isClient && navigation.navigate('pesquisaEspecialidade')}>
          <Text style={[styles.subMenuItemText, !isClient && styles.disabledText]}>
            Especialidade
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isClient}
          onPress={() => isClient && navigation.navigate('pesquisaProfissional')}>
          <Text style={[styles.subMenuItemText, !isClient && styles.disabledText]}>
            Profissional
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isClient}
          onPress={() => isClient && navigation.navigate('pesquisaLocalizacao')}>
          <Text style={[styles.subMenuItemText, !isClient && styles.disabledText]}>
            Localização
          </Text>
        </TouchableOpacity>

        <View style={styles.menuItem}>
          <MaterialIcons name="star" size={24} color="black" />
          <Text style={styles.menuItemText}>Meus avaliados</Text>
        </View>
      </View>
    </View>
  );
}

export default function _layout() {
  const { user, isAuthenticated } = useAuth(); 
  const isClient = isAuthenticated && user?.role === 'user';

  return (
    <Drawer
      drawerContent={props => <CustomDrawerContent {...props} isClient={isClient} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#e6e6e6',
          width: 240,
        },
      }}>
      <Drawer.Screen 
        name='home' 
        options={{
          drawerLabel: 'Home',
          headerTitle: 'Home',
          drawerIcon: ({ size, color}) => (
            <Ionicons name='home-outline' size={size} color={color}/>
          ),
          header: () => <HomeHeader />
        }}/>
    </Drawer>
  )
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#e6e6e6',
  },
  drawerHeader: {
    height: 150,
    backgroundColor: '#0D1321',
    padding: 20,
  },
  drawerHeaderText: {
    color: '#FFD700',
    fontSize: 29,
    fontWeight: 'bold',
    paddingTop: 20,
  },
  drawerMenu: {
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  menuItemText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subMenuItemText: {
    marginLeft: 34,
    fontSize: 16,
    marginVertical: 5,
    paddingBottom: 15,
  },
  disabledText: {
    color: 'gray',
  },
});