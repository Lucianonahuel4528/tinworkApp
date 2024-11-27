import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import {findUserAuthenticated} from '../../../AuthService';
import {findByUid} from '../../services/UserService';
import {CARD, FONT_SIZE, FUENTES, fuentes} from '../../utils/constants';
import offerMaletin from '../../../src/assets/images/maletin.png'
const MatchList = () => {
  const [matchs, setMatchs] = useState([]);

  const setUser = async () => {
    let userAuthenticated = findUserAuthenticated();
    const {offersMatch} = await findByUid(userAuthenticated.uid);
    setMatchs(offersMatch);
  };

  useEffect(() => {
    setUser();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={{fontSize: 35, padding: 15}}>Mis Matchs</Text>
      {matchs.map((match,index) => (
        <View style={styles.matchContainer} key={`${match.id}-${index}`}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.img}
              source={offerMaletin}
            />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.jobTitle}>{match.title}</Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  marginRight: 15,
                }}>
                <Icon name={'location-pin'} size={15} />
                <Text style={{flexGrow: 5}}>
                  {match.province}, {match.country}
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Icon name={'briefcase'} size={15} />
                <Text style={{flexGrow: 3}}> {match.workDay}</Text>
              </View>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginTop: 2,
              }}>
              <Icon name={'briefcase'} size={15} />
              <Text style={{flexGrow: 2}}> Hace 1 mes</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  matchContainer: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  jobTitle: {
    fontFamily: FUENTES.BOLD,
    fontSize: FONT_SIZE.xl,
    color: '#000',
  },
  company: {
    fontSize: 16,
    color: 'gray',
  },
  imageContainer: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  img: {
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default MatchList;
