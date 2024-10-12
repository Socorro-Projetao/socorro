import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, SectionList } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { useRouter } from 'expo-router';


const Item = ({ image, name, role, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={image} style={styles.image} resizeMode="cover" />
    <Text numberOfLines={2}>{name}</Text>
    <Text numberOfLines={1}>{role}</Text>
  </TouchableOpacity>
);


const Anuncio = ({ profilePicture }) => (
  <TouchableOpacity style={styles.cardAnuncio}>
    {profilePicture && (
      <Image source={{ uri: profilePicture }} style={styles.adImage} resizeMode="cover" />
    )}
  </TouchableOpacity>
);

const Home = () => {
  const router = useRouter();
  const [isUserAllowed, setIsUserAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [randomAnuncio, setRandomAnuncio] = useState({});
  const [professionals, setProfessionals] = useState([]);
  const [anunciantes, setAnunciantes] = useState([]);

  useEffect(() => {
    if (anunciantes.length > 0) { 
        const randomIndex = Math.floor(Math.random() * anunciantes.length);
        setRandomAnuncio(anunciantes[randomIndex]);
    }
  }, [anunciantes]); 

  useEffect(() => {
    const intervalId = setInterval(() => {
        if (anunciantes.length > 0) { 
            const randomIndex = Math.floor(Math.random() * anunciantes.length);
            setRandomAnuncio(anunciantes[randomIndex]);
        }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [anunciantes]);

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
    fetchAnunciantes();
  }, []);


  const fetchAnunciantes = async () => {
    setLoading(true);
    try {
      const db = getFirestore();
      const anunciantesCollection = collection(db, 'anunciantes');
      const anunciantesSnapshot = await getDocs(anunciantesCollection);
      const anunciantesList = anunciantesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        };
      });
      setAnunciantes(anunciantesList);
    } catch (error) {
      console.error('Erro ao buscar anunciantes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    const db = getFirestore();
    const professionalsCollection = collection(db, 'professionals');
    const professionalsSnapshot = await getDocs(professionalsCollection);
    const professionalsList = professionalsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });
    setProfessionals(professionalsList);
  };

  const listEspecialidades = [...new Set(professionals.map(prof => prof.especialidade))];

  const sections = [
    {
      title: 'Anúncios',
      data: [randomAnuncio],
    }
  ];

  const pedreiros = professionals.filter(prof => prof.especialidade === 'Pedreiro');
  const encanadores = professionals.filter(prof => prof.especialidade === 'Encanador');
  const eletricistas = professionals.filter(prof => prof.especialidade === 'Eletricista');
  const intercalado = [];

  const maxLength = Math.max(pedreiros.length, encanadores.length, eletricistas.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < pedreiros.length) intercalado.push(pedreiros[i]);
    if (i < encanadores.length) intercalado.push(encanadores[i]);
    if (i < eletricistas.length) intercalado.push(eletricistas[i]);
  }

  sections.push({
    title: 'Principais Especialidades',
    data: [intercalado],
  });

  listEspecialidades.forEach(especialidade => {
    sections.push({
      title: especialidade,
      data: [professionals.filter(prof => prof.especialidade === especialidade)],
    });
  });

  const handleProfessionalPress = (professional) => {
    router.push({
      pathname: 'detalhesProfissional',
      params: { profissional: JSON.stringify(professional) },
    });
  };


  const renderHorizontalFlatList = (filteredData) => (
    <FlatList
      data={filteredData}
      renderItem={({ item }) => (
        <Item
          key={item.id}
          name={item.username}
          role={<Text style={{ fontWeight: 'bold' }}>{item.especialidade}</Text>}
          image={{ uri: item.profilePicture }}
          onPress={() => handleProfessionalPress(item)}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );

  const renderSection = ({ section }) => {
    if (section.title === 'Anúncios') {
        // Verificar se `randomAnuncio` existe e se contém `profilePicture`
        if (loading) {
            return <Text>Carregando anúncios...</Text>;
        } else if (section.data.length > 0 && section.data[0] && section.data[0].profilePicture) {
            return (
                <Anuncio
                    key={section.data[0].id}
                    profilePicture={section.data[0].profilePicture}
                />
            );
        } else {
            // Caso não haja dados ou o `profilePicture` esteja ausente
            return <Text>Nenhum anúncio disponível</Text>;
        }
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
<View style={styles.containerInicial}>
  <Image 
    source={require('../../assets/images/logo-SOCORRO.png')} 
    style={styles.imageInicial} 
    resizeMode="contain" 
  />
</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerInicial: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  imageInicial: {
    width: '100%', 
    height: '100%', 
  },
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
  adImage: {
    width: '100%', 
    height: '100%', 
    borderRadius: 10,
    resizeMode: 'contain',
  },
  noAccessText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default Home;