import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet,Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { editMatch, deleteMatch } from '../redux/actions';

const HomeScreen = ({ navigation, matches, editMatch, deleteMatch }) => {
  useEffect(() => {
  }, []);

  const showDeleteConfirmation = (matchId) => {
    Alert.alert(
      'Delete Match',
      'Are you sure you want to delete this match?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteMatch(matchId) },
      ],
      { cancelable: true }
    );
  };

  const renderScheduleItem = ({ item }) => {
    return (
      <View style={styles.scheduleItem}>
        <Text style={styles.matchName}>{item.name}</Text>
        <Text style={styles.scheduleTitle}>Schedule:</Text>
        {item.schedule.map((slot, index) => (
          <View style={styles.slotContainer} key={index}>
            <Text style={styles.slotDetails}>
              <Text style={{color:"#8d9abe"}}>Date: </Text>
               {slot.startDate}</Text>
            <Text style={styles.slotDetails}>
              <Text style={{color:"#8d9abe"}}>Time Slot: </Text>
              {`${slot.startTime} - ${slot.endTime}`}</Text>
          </View>
        ))}
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('Edit', {  match: item  })}
        >
          <Text style={{color:"#fff614"}}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => showDeleteConfirmation(item.id)}
        >
          <Text style={{color:"#fd0101"}}>Delete</Text>
        </TouchableOpacity>
        </View>
        
      </View>
    );
  };

  const ListEmptyComponent = () => (
    <View style={{flex:1, justifyContent:"center",alignItems:"center",padding:30,marginTop:30}}>
      <Text style={{color:"#8d9abe"}}>No upcoming matches</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{flexDirection:"row", justifyContent:"space-between",alignItems:"center",margin:12}}>
        <Text style={{color:"#fff",fontSize:24,fontWeight:"500"}}>Welcome</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Schedule')} style={styles.scheduleButton}> 
        <Text style={{color:"#081b4e",padding:10}}>Schedule a Match</Text>
      </TouchableOpacity>
      </View>
      <View style={{marginTop:20}}>
      <Text style={styles.sectionTitle}>Upcomming</Text>
      <FlatList data={matches} renderItem={renderScheduleItem} contentContainerStyle={styles.flatListContainer} 
      ListEmptyComponent={ListEmptyComponent}/>
      </View> 
    </View>
  );
};

const mapStateToProps = (state) => ({
  matches: state.matches,
});

const mapDispatchToProps = (dispatch) => ({
  editMatch: (match) => dispatch(editMatch(match)),
  deleteMatch: (matchId) => dispatch(deleteMatch(matchId)),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#040d62',
    paddingBottom:80
  },
  flatListContainer: {
    flexGrow: 1,
    paddingBottom:80
    
  },
  scheduleButton:{
  alignSelf:"center",
  backgroundColor:"#fff614",
  borderTopLeftRadius:10,
  borderBottomRightRadius:10,
  margin:20
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 18,
    color:"#8d9abe"
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color:"#fff"
  },
  matchName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color:"#fff",
    borderBottomWidth:0.5,
    borderColor:"#8d9abe",
    paddingBottom:5
  },
  scheduleItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    backgroundColor: '#081b4e',
    borderTopLeftRadius:18,
    borderBottomRightRadius:18
  },
  slotContainer: {
    marginVertical: 5,
    flexDirection:"row",
    justifyContent:"space-between"
  },
  slotDetails:{
    color:"#fff"
  },
  editButton: {
   // backgroundColor: '#fff614',
    borderColor:"#fff614",
  //borderWidth:1,
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
    borderRadius:25
  },
  deleteButton: {
   // backgroundColor: '#fd0101',
    padding: 10,
    alignItems: 'center',
    marginVertical: 5,
    borderRadius:25,
    borderColor:"#fd0101",
   // borderWidth:1,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

