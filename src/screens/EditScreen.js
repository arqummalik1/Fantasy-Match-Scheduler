import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { updateMatch } from '../redux/actions';
import { TouchableOpacity } from 'react-native-gesture-handler';

const EditScreen = ({ navigation, route, updateMatch }) => {
  const { match } = route.params;
  const [editedMatch, setEditedMatch] = useState({ ...match });

  const saveEditedMatch = () => {
    updateMatch(editedMatch);
    navigation.navigate('Home');
  };

  const renderScheduleItems = () =>
    editedMatch.schedule.map((item, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.cardTitle}>Edit Schedule Item</Text>

        {['startDate', 'startTime', 'endTime'].map((type) => (
          <TextInput
            key={type}
            style={styles.input}
            placeholder={type === 'startDate' ? 'Start Date' : type === 'startTime' ? 'Start Time' : 'End Time'}
            value={item[type]}
            onChangeText={(text) => {
              const updatedSchedule = editedMatch.schedule.map((scheduleItem) =>
                scheduleItem === item ? { ...scheduleItem, [type]: text.trim() } : scheduleItem
              );
              setEditedMatch({ ...editedMatch, schedule: updatedSchedule });
            }}
          />
        ))}
      </View>
    ));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>Edit Match</Text>
      {renderScheduleItems()}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSave} onPress={saveEditedMatch}>
          <Text style={{color:"#000"}}>
          Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateMatch: (match) => dispatch(updateMatch(match)),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#040d62',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color:"#fff"
  },
  card: {
    borderWidth: 1,
    borderColor: '#f2f6f7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#081b4e',
    
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#fff"
  },
  input: {
    height: 40,
    borderColor: '#f5f8fa',
    borderRadius:9,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderBottomWidth:1,
    color:"#fff"
  },
  buttonContainer: {
    marginBottom: 30,
  },
  buttonSave:{
    backgroundColor: '#fff614',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderTopLeftRadius:10,
    borderBottomRightRadius:10
  }
});

export default connect(null, mapDispatchToProps)(EditScreen);
