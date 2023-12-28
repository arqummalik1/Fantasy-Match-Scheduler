import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import { Calendar } from 'react-native-calendars';
import { connect } from 'react-redux';
import { addMatch } from '../redux/actions';

const ScheduleScreen = ({ navigation, matches, addMatch }) => {
  const [matchDetails, setMatchDetails] = useState({
    name: '',
    selectedDates: [],
    schedule: [],
    startDateTime: null,
    endDateTime: null,
  });

  const [openStartTimePicker, setOpenStartTimePicker] = useState(false);
  const [openEndTimePicker, setOpenEndTimePicker] = useState(false);

  useEffect(() => {

    loadMatches();
  }, []);

  const removeSlot = (index) => {
    const updatedSchedule = [...matchDetails.schedule];
    updatedSchedule.splice(index, 1);

    setMatchDetails({
      ...matchDetails,
      schedule: updatedSchedule,
    });
  };

  const showStartTimePicker = () => {
    setOpenStartTimePicker(true);
  };

  const showEndTimePicker = () => {
    setOpenEndTimePicker(true);
  };

  const hideTimePickers = () => {
    setOpenStartTimePicker(false);
    setOpenEndTimePicker(false);
  };

  const handleStartDateTimeConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const selectedTime = `${hours}:${minutes}`;

    showEndTimePicker();

    setMatchDetails({
      ...matchDetails,
      startDateTime: {
        date: formattedDate,
        time: selectedTime,
      },
    });
  };

  const handleEndDateTimeConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const selectedTime = `${hours}:${minutes}`;

    setMatchDetails({
      ...matchDetails,
      schedule: [
        ...matchDetails.schedule,
        ...matchDetails.selectedDates.map((selectedDate) => ({
          startDate: selectedDate,
          startTime: matchDetails.startDateTime.time,
          endDate: formattedDate,
          endTime: selectedTime,
        })),
      ],
      startDateTime: null,
      endDateTime: null,
    });

    hideTimePickers();
  };

  const handleDatePress = (day) => {
    const selectedDate = day.dateString;
    const isDateSelected = matchDetails.selectedDates.includes(selectedDate);

    if (isDateSelected) {
      setMatchDetails({
        ...matchDetails,
        selectedDates: matchDetails.selectedDates.filter((date) => date !== selectedDate),
      });
    } else {
      setMatchDetails({
        ...matchDetails,
        selectedDates: [...matchDetails.selectedDates, selectedDate],
      });
    }
  };

  const handleSelectAllDays = () => {
    const currentDate = new Date();
    const selectedDates = [];

    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      const formattedDate = nextDate.toISOString().split('T')[0];
      selectedDates.push(formattedDate);
    }

    setMatchDetails({
      ...matchDetails,
      selectedDates,
    });
  };

  const saveMatch = () => {
    const isOverlapping = checkForOverlappingTime(matchDetails.schedule);

    if (!isOverlapping) {
      const newMatch = { ...matchDetails, id: Date.now() };
      addMatch(newMatch);
      navigation.navigate('Home');
    } else {
      alert('Overlapping time slots detected. Please choose a different time.');
    }
  };

  const loadMatches = async () => {
    try {
      const existingMatches = await AsyncStorage.getItem('matches');
      if (existingMatches) {
        const matches = JSON.parse(existingMatches);
        console.log('Loaded Matches:', matches);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const checkForOverlappingTime = (schedule) => {
    const timeMap = {};
   
   
    for (const slot of schedule) {
      const startTime = slot.startTime;
      const startDate = slot.startDate;
   
   
      const key = `${startDate}-${startTime}`;
   
   
      if (timeMap[key]) {
        return true;
      }
      timeMap[key] = true;
    }
    return false; 
   };
   

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Match name here"
        placeholderTextColor="#fff"
        value={matchDetails.name}
        onChangeText={(text) => setMatchDetails({ ...matchDetails, name: text })}
      />
      <TouchableOpacity style={{padding:5,marginBottom:5}} onPress={handleSelectAllDays}>
        <Text style={{color:"#ccc"}}>Select All Days</Text>
      </TouchableOpacity>
       <Calendar
        markedDates={matchDetails.selectedDates.reduce((marked, date) => {
          marked[date] = { selected: true };
          return marked;
        }, {})}
        onDayPress={(day) => handleDatePress(day)}
      />

      <TouchableOpacity style={styles.button} onPress={showStartTimePicker}>
        <Text>Select Time</Text>
      </TouchableOpacity>

      <DatePicker
        modal
        mode="time"
        open={openStartTimePicker}
        date={new Date()} 
        onConfirm={handleStartDateTimeConfirm}
        onCancel={hideTimePickers}
      />
      <DatePicker
        modal
        mode="time"
        open={openEndTimePicker}
        date={new Date()} 
        onConfirm={handleEndDateTimeConfirm}
        onCancel={hideTimePickers}
      />

      <FlatList
        data={matchDetails.schedule}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.slotContainer}>
            <Text style={{ color: '#fff' }}>Date: {item.startDate}</Text>
            <Text style={{ color: '#fff' }}>
              Time Slot: {`${item.startTime} - ${item.endTime}`}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeSlot(index)}
            >
              <Text style={{ color: '#fd0101' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.buttonSave} onPress={saveMatch}>
        <Text>Save Match</Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = (state) => ({
  matches: state.matches,
});

const mapDispatchToProps = (dispatch) => ({
  addMatch: (match) => dispatch(addMatch(match)),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#040d62',
  },
  input: {
    height: 40,
    borderColor: '#f5f8fa',
    borderRadius: 9,
    borderBottomWidth: 1,
    color: '#fff',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#8d9abe',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonSave: {
    backgroundColor: '#fff614',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  slotContainer: {
    marginVertical: 5,
  },
  deleteButton: {
    backgroundColor: '#040d62',
    padding: 10,
    alignSelf: 'flex-end',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen);
