import React, { useState } from 'react';
import { View, Text, StatusBar, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function pesquisaLocalizacao() {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false); 


  const fetchLocations = async (input) => {
    const apiKey = 'AIzaSyCxzN0sraj4AJtLGMO0YQr2Kpx6B76HRp8'; 
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&language=pt_BR&components=country:BR&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        setSuggestions(response.data.predictions.map(prediction => prediction.description));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    if (text.length > 2) { //busca a partir de 2 caracteres inseridos
      fetchLocations(text); 
    } else {
      setSuggestions([]);
    }
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
          placeholder='Digite a localização'
          autoCorrect={false}
          autoComplete='none'
          value={search}
          onFocus={() => setIsFocused(true)}  // Quando o campo é focado
          onBlur={() => setIsFocused(false)}  // perde o foco
          onChangeText={handleSearchChange}
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

      <FlatList
        data={suggestions}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.suggestionItem}>
            <Text style={styles.suggestionText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
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
};
