import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SectionList } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import HomeProfissonal from "../(app)/homeProfissional"

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
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [randomAnuncio, setRandomAnuncio] = useState([]);
  const [professionals, setProfessionals] = useState([]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * publicidade.length);
    const newRandomAnuncio = publicidade.slice(randomIndex, randomIndex + 1);
    setRandomAnuncio(newRandomAnuncio);
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;
      const userDocRef = doc(db, 'users', uid);
      getDoc(userDocRef).then((docSnap) => {
        setIsUserAllowed(docSnap.exists());
        setLoading(false);
      }).catch((error) => {
        console.error("Error getting user document:", error);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    const db = getFirestore();
    const professionalsCollection = collection(db, 'professionals');
    const professionalsSnapshot = await getDocs(professionalsCollection);
    const professionalsList = professionalsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProfessionals(professionalsList);
  };

  const listEspecialidades = [...new Set(professionals.map(prof => prof.especialidade))];

  const sections = [
    {
      title: 'Anúncios',
      data: [randomAnuncio],
    },
    {
      title: 'Principais Especialidades',
      data: [professionals],
    },
  ];

  listEspecialidades.forEach(especialidade => {
    sections.push({
      title: especialidade,
      data: [professionals.filter(prof => prof.especialidade === especialidade)],
    });
  });

  const renderHorizontalFlatList = (filteredData) => (
    <FlatList
      data={filteredData}
      renderItem={({ item }) => <Item key={item.id} name={item.username} role={item.especialidade} image={require('../../assets/images/icon_perfil.png')} />}
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

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      {isUserAllowed ? (
        <>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item + index}
            renderSectionHeader={({ section: { title } }) => {
              let titleStyle = styles.title;
              if (title === 'Principais Especialidades' || title === 'Anúncios') {
                titleStyle = styles.title;
              } else if (listEspecialidades.includes(title)) {
                titleStyle = styles.subTitle;
              }

              return (
                <Text style={titleStyle}>{title}</Text>
              );
            }}
            renderItem={renderSection}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </>
      ) : (
        <HomeProfissonal/>
        )}
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
      justifyContent: 'flex-end',
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
      noAccessText: {
        textAlign: 'center',
      fontSize: 18,
      color: 'red',
      marginTop: 20,
  },
});

      export default Home;