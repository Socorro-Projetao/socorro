import { View, TextInput, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'
import {collection, query, where, getDocs} from 'firebase/firestore'
import {db} from '../firebaseConfig'

export default function pesquisaProfissional() {
  const router = useRouter();

  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = suggestions.filter(item =>
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  // função para buscar profissionais
  const fetchProfessionals = async (searchTerm) => {
    if (searchTerm.length === 0){
      setSuggestions([])
      return
    }

    const q = query(collection(db, 'professionals'), where('username', '>=', searchTerm), where('username', '<=', searchTerm + '\uf8ff'));

    const querySnapshot = await getDocs(q);
    const professionalsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    setSuggestions(professionalsList);
  }

  const handleSuggestionPress = (professional) => {
    router.push({
      pathname: 'detalhesProfissional',
      params: { profissional: JSON.stringify(professional) },
    });
  }

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
          placeholder='Digite o nome do profissional'
          autoCorrect={false}
          autoComplete='none'
          value={search}
          onFocus={() => setIsFocused(true)}  // Quando o campo é focado
          onBlur={() => setIsFocused(false)}  // perde o foco
          onChangeText={(text) => {
            setSearch(text);
            fetchProfessionals(text)
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
            onPress={() => {
              setSearch('');
              setSuggestions([]);
            }} 
            style={styles.iconClose} 
          />
        )}
      </View>
      {search.length > 0 && (
        <FlatList
          data={filteredSuggestions}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSuggestionPress(item)}>
              <Text style={styles.suggestionText}>{item.username}</Text>
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