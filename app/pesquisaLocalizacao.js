import React, { useState } from 'react';
import { View, Text, Image, StatusBar, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

export default function PesquisaLocalizacao({ setLocalizacao }) {
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [profissionais, setProfissionais] = useState([]);

  const fetchLocations = async (input) => {
    const apiKey = 'AIzaSyCxzN0sraj4AJtLGMO0YQr2Kpx6B76HRp8';
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=geocode&language=pt_BR&components=country:BR&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      if (response.data.status === 'OK') {
        setSuggestions(response.data.predictions.map(prediction => prediction.description));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProfissionalPorLocalizacao = async (location) => {
    const db = getFirestore()
    const professionalsCollection = collection(db, 'professionals')
    const q = query(professionalsCollection, where('localizacao', '==', location))

    try {
      const querySnapshot = await getDocs(q)
      const professionalsList = querySnapshot.docs.map(doc => doc.data())
      setProfissionais(professionalsList)
    } catch (error) {
      console.error('Erro ao buscar profissionais: ', error)
    }
  }

  const handleSearchChange = (text) => {
    setSearch(text);
    if (text.length > 2) { //busca a partir de 2 caracteres inseridos
      fetchLocations(text);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSuggestionSelect = (suggestion) => {
    console.log(`Selecionado: ${suggestion}`);
    setSearch(suggestion);
    setSuggestions([]);

    if (setLocalizacao) {
      setLocalizacao(suggestion);
    }
    fetchProfissionalPorLocalizacao(suggestion)
  };

  const renderProfessional = ({ item }) => (
    <TouchableOpacity 
      style={styles.professionalCard}
      onPress={() => {
        console.log('PROFISSIONAL SELECIONADO: ', item);
        router.push({
          pathname: "detalhesProfissional",
          params: { profissional: JSON.stringify(item) },
        });
      }}
    >
      <Image 
        source={{ uri: item.profilePicture }} 
        style={styles.professionalImage} 
      />
      <Text style={styles.professionalName}>{item.username}</Text>
    </TouchableOpacity>
  );

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
          <TouchableOpacity onPress={() => handleSuggestionSelect(item)}>
            <Text style={styles.suggestionText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      {/* lista de profissionais */}
      <FlatList
        data={profissionais}
        renderItem={renderProfessional}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}  
        columnWrapperStyle={styles.row}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum profissional encontrado</Text>}
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
  suggestionText: {
    fontSize: 16,
    color: '#000',
    paddingLeft: 20

  },
  row: {
    justifyContent: 'flex-start', 
    paddingHorizontal: wp(2), 
    marginBottom: wp(3),
  },
  professionalCard: {
    backgroundColor: '#f0f0f0',
    margin: 4,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: wp(30),
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
  flatListContainer: {
    paddingTop: 0,
    flexGrow: 1,
  },
  vazio: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
};
