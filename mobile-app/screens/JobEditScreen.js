import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {gql, useMutation} from '@apollo/client';
import TextInputCustom from '../Components/TextInputCustom';
import Icon from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';

function JobDetailsScreen(props) {
  const CompanyLogo =
    'https://www.freepnglogos.com/uploads/google-logo-png/google-logo-icon-png-transparent-background-osteopathy-16.png';
  const CompName = 'Google';
  const CompLocation = '📍 Mumbai, IN';
  const JobName = 'Software Developer Engineer';
  const JobDescription =
    'Occaecat in tempor aliquip consectetur irure ad ea cillum aliquip aliquip laborum do occaecat eu. Et veniam est eiusmod aute aliquip veniam irure irure elit. Ullamco eu dolor sint duis laboris sunt in nulla excepteur. Duis dolor officia velit ipsum cillum deserunt Lorem adipisicing reprehenderit laboris ut commodo in ullamco. Veniam minim aute non occaecat ex. Lorem velit cupidatat ipsum non do mollit mollit quis cupidatat fugiat.\n\nSit ea culpa eiusmod tempor dolore ea eiusmod veniam officia amet fugiat. Et eu reprehenderit cillum nisi magna sunt. Occaecat eiusmod velit mollit labore tempor laboris laborum sunt enim tempor. Aute Lorem reprehenderit aute dolore culpa laborum eu. Aute amet eu aliquip sit eu non est in elit qui est non nisi.';
  const JobReq = [
    'Consequat',
    'ullamco',
    'labore',
    'nostrud',
    'aliquip',
    'consectetur.',
  ];
  return (
    <View style={{backgroundColor: '#EAEEF1', flex: 1}}>
      <View
        style={{
          paddingHorizontal: 20,
          backgroundColor: '#497AD7',
          paddingVertical: 15,
          elevation: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 30,
              backgroundColor: '#EAEEF199',
              padding: 5,
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="contain"
              source={{uri: CompanyLogo}}
            />
          </View>
          <View style={{marginLeft: 15}}>
            <Text style={{color: '#fff', fontSize: 25, fontWeight: 'bold'}}>
              {CompName}
            </Text>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '400'}}>
              {CompLocation}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView style={{flex: 3.2, paddingTop: 20, paddingHorizontal: 20}}>
        <Text
          style={{
            fontSize: 20,
            letterSpacing: 0.1,
            textDecorationLine: 'underline',
            fontWeight: 'bold',
          }}>
          {JobName}
        </Text>
        <Text style={{marginTop: 25, fontSize: 16, fontWeight: 'bold'}}>
          Job Description
        </Text>
        <Text style={{marginTop: 10, fontSize: 16, textAlign: 'justify'}}>
          {JobDescription}
        </Text>
        <Text style={{marginTop: 25, fontSize: 16, fontWeight: 'bold'}}>
          Requirements :
        </Text>
        {JobReq.map((item, ind) => {
          return (
            <Text
              key={`${item}${ind}`}
              style={{marginTop: 10, fontSize: 16, textAlign: 'justify'}}>
              {ind + 1}. {item}
            </Text>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={{width: '100%', height: 40, backgroundColor: '#497AD7'}}>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          allowFontScaling
          style={{
            width: '100%',
            height: '100%',
            textAlign: 'center',
            textAlignVertical: 'center',
            fontSize: 20,
            paddingVertical: 5,
            color: '#fff',
            fontWeight: 'bold',
          }}>
          Apply Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default JobDetailsScreen;

const styles = StyleSheet.create({
  cardStyle: {
    width: '90%',
    height: 100,
    alignSelf: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  logoStyle: {
    width: '18%',
    paddingHorizontal: 5,
    height: '100%',
    borderRightWidth: 1,
    borderColor: '#00000050',
    marginLeft: 10,
    justifyContent: 'center',
  },
});
