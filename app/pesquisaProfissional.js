import { View, TextInput, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'
import {collection, query, where, getDocs} from 'firebase/firestore'
import {db} from '../firebaseConfig'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function pesquisaProfissional() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const loadSearch = async () => {
      try {
        const savedSearch = await AsyncStorage.getItem('pesquisaProfissional');
        if (savedSearch) {
          setSearch(savedSearch);
          fetchProfessionals(savedSearch);
        }
      } catch (error) {
        console.error('Erro ao carregar pesquisa salva:', error);
      }
    };

    loadSearch();
  }, []);

  const fetchProfessionals = async (searchTerm) => {
    if (searchTerm.length === 0){
      setSuggestions([])
      setFilteredProfessionals([]);
      return
    }

    const q = query(
      collection(db, 'professionals'), 
      where('username', '>=', searchTerm), 
      where('username', '<=', searchTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    const professionalsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setSuggestions(professionalsList);
    setFilteredProfessionals(professionalsList);
  }

  const handleSuggestionPress = (professional) => {
    router.push({
      pathname: 'detalhesProfissional',
      params: { profissional: JSON.stringify(professional) },
    });
  }

  const handleClearSearch = async () => {
    setSearch('');
    setSuggestions([]);
    setFilteredProfessionals([]);
    await AsyncStorage.removeItem('pesquisaProfissional'); 
  };

  const handleBackPress = async () => {
    await handleClearSearch(); 
    router.push("home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <AntDesign 
          name='arrowleft' 
          size={25} 
          color='#0F1626' 
          onPress={handleBackPress} 
          style={styles.iconLeft} 
        />
        <TextInput
          style={styles.input}
          placeholder='Digite o nome do profissional'
          autoCorrect={false}
          autoComplete='none'
          value={search}
          onFocus={() => setIsFocused(true)}  // Quando o campo é focado
          onBlur={() => setIsFocused(false)}  // perde o foco
          onChangeText={(text) => {
            setSearch(text);
            fetchProfessionals(text)
            AsyncStorage.setItem('pesquisaProfissional', text);
          }}
        />
        {search.length === 0 && !isFocused && ( 
          <AntDesign
            name='search1'
            size={25}
            color='#49454F'
          />
        )}
        {search.length > 0 && (
          <AntDesign 
            name='close' 
            size={25} 
            color='#0F1626' 
            onPress={handleClearSearch}
            style={styles.iconClose} 
          />
        )}
      </View>
      {filteredProfessionals.length > 0 && (
        <FlatList
          data={filteredProfessionals}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.professionalCard} onPress={() => handleSuggestionPress(item)}>
              <Image source={{ uri: item.profilePicture }} style={styles.professionalImage} />
              <Text style={styles.professionalName}>{item.username}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer} 
        />
      )}
    </SafeAreaView>

  )
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: StatusBar.currentHeight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    margin: wp(5),
    paddingHorizontal: wp(2),
  },
  iconLeft: {
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
    color: '#0F1626',
  },
  iconClose: {
    marginLeft: wp(2),
  },
  suggestionItem: {
    backgroundColor: '#e0e0e0',
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  suggestionText: {
    fontSize: 16,
    color: '#000',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    marginBottom: wp(3),
  },
  professionalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  professionalCard: {
    backgroundColor: '#f0f0f0',
    margin: wp(2), 
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: wp(28),
    flex: 1, 
  },
  
  professionalName: {
    marginTop: wp('2.2%'),
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap', 
    minWidth: wp(25), 
    maxWidth: wp(28), 
    overflow: 'hidden', 
  },
  vazio: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatListContainer: {
    flexDirection: 'row',
    justifyContent: 'left', 
    padding: wp(5), 
  },
};