import { View, TextInput, SafeAreaView, StatusBar, FlatList, TouchableOpacity, Text } from 'react-native'
import React, { useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons'

export default function pesquisaEspecialidade() {
  const router = useRouter();

  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([
    'Pintor',
    'Encanador',
    'Pedreiro',
    'Eletricista',
    'Marceneiro',
    'Serralheiro',
    'Gesseiro',
    'Instalador de ar-condicionado',
    'Montador de móveis',
    'Vidraceiro',
    'Calheiro',
    'Dedetizador',
    'Hidrojatista',
    'Técnico em manutenção de eletrodomésticos'
  ])
  const [isFocused, setIsFocused] = useState(false);
  const filteredSuggestions = suggestions.filter(item =>
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
      <AntDesign 
          name='arrowleft' 
          size={25} 
          color='#0F1626' 
          onPress={() => router.push("home")} 
          style={styles.iconLeft} 
        />
        <TextInput
          style={styles.input}
          placeholder='Ex.: pintor'
          autoCorrect={false}
          autoComplete='none'
          value={search}
          onFocus={() => setIsFocused(true)}  // Quando o campo é focado
          onBlur={() => setIsFocused(false)}  // perde o foco
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
            <TouchableOpacity style={styles.suggestionItem}>
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
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