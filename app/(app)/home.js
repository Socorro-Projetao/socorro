import React, { useState, useEffect, Drawer } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const data = [
  // Dados fictícios para os cards
  { id: 1, name: 'João Silva', role: 'Pedreiro', image: require('../../assets/images/icon_perfil.png') },
  { id: 2, name: 'Maria Oliveira', role: 'Vidraceiro', image: require('../../assets/images/icon_perfil.png') },
  { id: 3, name: 'Sandro Ferreira', role: 'Eletricista', image: require('../../assets/images/icon_perfil.png') },
  { id: 4, name: 'Pedro Lima', role: 'Encanador', image: require('../../assets/images/icon_perfil.png') },
  { id: 5, name: 'Ana Souza', role: 'Pintor', image: require('../../assets/images/icon_perfil.png') },
];

const publicidade = [
  { id: 1, texto: 'anuncie aqui 1' },
  { id: 2, texto: 'anuncie aqui 2' },
  { id: 3, texto: 'anuncie aqui 3' },
];


const Item = ({ image, name, role }) => (
  <TouchableOpacity style={styles.card}>
    <Image source={image} style={styles.image} />
    <Text numberOfLines={2}>{name}</Text>
    <Text numberOfLines={1}>{role}</Text>
  </TouchableOpacity>
);

const Anuncio = ({ texto }) => (
  <TouchableOpacity style={styles.cardAnuncio}>
    <Text style={styles.textAnuncio}>{texto}</Text>
  </TouchableOpacity>
);

const Home = () => {


  // Garante a aleatoriedade dos anuncios
  const [randomAnuncio, setRandomAnuncio] = useState([]);
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * publicidade.length);
    const newRandomAnuncio = publicidade.slice(randomIndex, randomIndex + 1);
    setRandomAnuncio(newRandomAnuncio);
  }, []);

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="menu" size={25} color='#0F1626' style={styles.menuIcon} />
        <AntDesign name='search1' size={25} color='#0F1626' style={styles.searchIcon} />
      </View>
      <ScrollView Style={styles.container}>
        <Text style={styles.title}>Últimos Contratados</Text>

        <FlatList
          data={data}
          renderItem={({ item }) => <Item name={item.name} role={item.role} image={item.image} />}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <FlatList
          data={randomAnuncio}
          renderItem={({ item }) => <Anuncio texto={item.texto} />}
          keyExtractor={(item) => item.id}
        />
        <Text style={styles.title}>Principais Especialidades</Text>
        <Text style={styles.subTitle}>Pedreiro</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => <Item name={item.name} role={item.role} image={item.image} />}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
        <Text style={styles.subTitle}>Vidraceiro</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => <Item name={item.name} role={item.role} image={item.image} />}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />

        <FlatList
          data={randomAnuncio}
          renderItem={({ item }) => <Anuncio texto={item.texto} />}
          keyExtractor={(item) => item.id}
        />

        <Text style={styles.subTitle}>Eletricista</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => <Item name={item.name} role={item.role} image={item.image} />}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />

        <Text style={styles.subTitle}>Pintor</Text>
        <FlatList
          data={data}
          renderItem={({ item }) => <Item name={item.name} role={item.role} image={item.image} />}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />

        <FlatList
          data={randomAnuncio}
          renderItem={({ item }) => <Anuncio texto={item.texto} />}
          keyExtractor={(item) => item.id}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    backgroundColor: '#fff',
    //padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
    
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,

  },
  card: {
    backgroundColor: '#f0f0f0',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cardAnuncio: {
    backgroundColor: '#f0f0f0',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    textAlign: 'center',
    height: 100,
  },
  textAnuncio: {
    textAlign: 'center',

  },
  searchIcon: {
    position: 'absolute',
    right: wp(2),
    bottom: 5,


  },
});

export default Home;