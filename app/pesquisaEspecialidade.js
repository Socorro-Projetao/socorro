import { View, TextInput, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'
import { especialidades } from './selectOptions';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function pesquisaEspecialidade() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState(especialidades);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const fetchProfessionals = async () => {
      if (search.length > 0) {
        const q = query(
          collection(db, 'professionals'),
          where('especialidade', '==', search)
        );

        const querySnapshot = await getDocs(q);
        const professionalsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFilteredProfessionals(professionalsList);
      } else {
        setFilteredProfessionals([]);
      }
    };

    fetchProfessionals();
  }, [search]); 

  const filteredSuggestions = suggestions.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuggestionPress = (especialidade) => {
    setSearch(especialidade.label);
  };

  const handleProfessionalPress = (professional) => {
    router.push({
      pathname: 'detalhesProfissional',
      params: { profissional: JSON.stringify(professional) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <AntDesign 
          name='arrowleft' 
          size={25} 
          color='#0F1626' 
          onPress={() => router.push("opcoesPesquisa")} 
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
            onPress={() => {
              setSearch('');
              setFilteredProfessionals([]);
            }} 
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
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.suggestionItem} 
              onPress={() => handleProfessionalPress(item)} 
            >
              <Text style={styles.suggestionText}>{item.especialidade}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
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
}