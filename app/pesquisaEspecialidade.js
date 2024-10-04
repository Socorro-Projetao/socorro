import { View, TextInput, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'
import { especialidades } from './selectOptions';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function pesquisaEspecialidade() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState(especialidades);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const savedSearch = await AsyncStorage.getItem('pesquisaEspecialidade');
        if (savedSearch) {
          setSearch(savedSearch);
          fetchFilteredProfessionals(savedSearch);
        }
      } catch (error) {
        console.error('Erro ao carregar pesquisa salva:', error);
      }
    };

    fetchProfessionals();
  }, []);

  const fetchFilteredProfessionals = async (especialidade) => {
    const q = query(
      collection(db, 'professionals'),
      where('especialidade', '==', especialidade)
    );

    try {
      const querySnapshot = await getDocs(q);
      const professionalsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFilteredProfessionals(professionalsList);
    } catch (error) {
      console.error('Erro ao buscar profissionais:', error);
    }
  };

  const filteredSuggestions = suggestions.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuggestionPress = async (especialidade) => {
    try {
      setSearch(especialidade.label);
      await AsyncStorage.setItem('pesquisaEspecialidade', especialidade.label);
      fetchFilteredProfessionals(especialidade.label);  
    } catch (error) {
      console.error('Erro ao salvar pesquisa:', error);
    }
  };

  const handleProfessionalPress = (professional) => {
    router.push({
      pathname: 'detalhesProfissional',
      params: { profissional: JSON.stringify(professional) },
    });
  };

  const renderProfessional = ({ item }) => (
    <TouchableOpacity
      style={styles.professionalCard}
      onPress={() => handleProfessionalPress(item)}
    >
      <Image
        source={{ uri: item.profilePicture }}
        style={styles.professionalImage}
      />
      <Text style={styles.professionalName}>{item.username}</Text>
    </TouchableOpacity>
  );

  const handleClearScreen = async () => {
    setSearch('');
    setFilteredProfessionals([]);
    try {
      await AsyncStorage.removeItem('pesquisaEspecialidade');
    } catch (error) {
      console.error('Erro ao limpar pesquisa salva:', error);
    }
  };

  const handleBackPress = async () => {
    await handleClearScreen(); 
    router.push("opcoesPesquisa");  
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
          placeholder='Ex.: pintor'
          autoCorrect={false}
          autoComplete='none'
          value={search}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={text => setSearch(text)}
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
            onPress={handleClearScreen}
            style={styles.iconClose} 
          />
        )}
      </View>

      {/* Exibir sugestões de especialidades */}
      {search.length > 0 && filteredSuggestions.length > 0 && filteredProfessionals.length === 0 && (
        <FlatList
          data={filteredSuggestions}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.suggestionItem} 
              onPress={() => handleSuggestionPress(item)} 
            >
              <Text style={styles.suggestionText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      {/* Exibir lista de profissionais filtrados */}
      {filteredProfessionals.length > 0 && (
        <FlatList
          data={filteredProfessionals}
          renderItem={renderProfessional}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum profissional encontrado</Text>}
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
    paddingHorizontal: wp(4),
    marginBottom: wp(3),
  },
  professionalCard: {
    backgroundColor: '#f0f0f0',
    margin: 4,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: wp(28),
  },
  professionalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  professionalName: {
    marginTop: wp(2),
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  vazio: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};
