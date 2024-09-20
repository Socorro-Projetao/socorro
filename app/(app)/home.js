import React, { useState, useEffect, Drawer } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SectionList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';

const data = [
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
  const router = useRouter();

  // Garante a aleatoriedade dos anuncios
  const [randomAnuncio, setRandomAnuncio] = useState([]);
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * publicidade.length);
    const newRandomAnuncio = publicidade.slice(randomIndex, randomIndex + 1);
    setRandomAnuncio(newRandomAnuncio);
  }, []);

  // Dados para a SectionList
  const sections = [
    {
      title: 'Últimos Contratados',
      data: [data],
    },
    {
      title: 'Anúncios',
      data: [randomAnuncio],
    },
    {
      title: 'Principais Especialidades',
      data: [data],
    },
    {
      title: 'Pedreiro',
      data: [data],
    },
    {
      title: 'Vidraceiro',
      data: [data],
    },
  ];

  const renderHorizontalFlatList = (filteredData) => (
    <FlatList
      data={filteredData}
      renderItem={({ item }) => <Item name={item.name} role={item.role} image={item.image} />}
      keyExtractor={(item) => item.id.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );

  const renderSection = ({ section }) => {
    if (section.title === 'Anúncios') {
      return section.data[0].map(anuncio => (
        <Anuncio key={anuncio.id} texto={anuncio.texto} />
      ));
    } else {
      return renderHorizontalFlatList(section.data[0]);
    }
  };

  return (

    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={25}
          color='#0F1626'
          style={styles.menuIcon}
        />
        <AntDesign
          name='search1'
          size={25}
          color='#0F1626'
          style={styles.searchIcon}
          onPress={() => router.push("opcoesPesquisa")}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderSectionHeader={({ section: { title } }) => {
          let titleStyle = styles.title;
          if (title === 'Últimos Contratados' || title === 'Principais Especialidades' || title === 'Anúncios'){
            titleStyle = styles.title;
          }
          else if (title === 'Pedreiro' || title === 'Vidraceiro'){
            titleStyle = styles.subTitle;
          } 

          return (
            <Text style={titleStyle}>{title}</Text>
          )
        }}        
        renderItem={renderSection}
        stickySectionHeadersEnabled={false}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    marginVertical: 10,
    marginLeft: wp(2),
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'left',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: wp(2),
  },
  card: {
    backgroundColor: '#f0f0f0',
    margin: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: 120,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
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
    marginRight: wp(2),
  },
});

export default Home;