import React, { useState } from 'react';
import { View, Text, Alert, TextInput, Pressable, StyleSheet } from 'react-native';

const TimerApp = () => {
  const [timers, setTimers] = useState(
    Array.from({ length: 5 }, (_, index) => ({
      id: index,
      time: 60, // default 60 seconds
      isRunning: false,
      intervalId: null
    }))
  );

  const handleStart = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id && !timer.isRunning) {
          const intervalId = setInterval(() => {
            setTimers((timers) =>
              timers.map((t) => {
                if (t.id === id && t.time > 0) {
                  return { ...t, time: t.time - 1 };
                } else if (t.id === id && t.time === 0) {
                  clearInterval(t.intervalId);
                  Alert.alert('Timer', `Timer ${id + 1} has reached zero!`);
                  return { ...t, isRunning: false };
                }
                return t;
              })
            );
          }, 1000);

          return { ...timer, isRunning: true, intervalId };
        }
        return timer;
      })
    );
  };

  const handlePause = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id && timer.isRunning) {
          clearInterval(timer.intervalId);
          return { ...timer, isRunning: false };
        }
        return timer;
      })
    );
  };

  const handleReset = (id) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer) => {
        if (timer.id === id) {
          clearInterval(timer.intervalId);
          return { ...timer, time: 60, isRunning: false };
        }
        return timer;
      })
    );
  };

  const handleTimeInput = (id, value) => {
    const inputTime = parseInt(value, 10);
    setTimers((prevTimers) =>
      prevTimers.map((timer) =>
        timer.id === id ? { ...timer, time: inputTime > 0 ? inputTime : 60 } : timer
      )
    );
  };

  return (
    <View style={styles.container}>
      {timers.map((timer) => (
        <View key={timer.id} style={styles.timerContainer}>
          <Text style={styles.timerText}>Timer {timer.id + 1}: {timer.time}s</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter time"
            onChangeText={(value) => handleTimeInput(timer.id, value)}
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, timer.isRunning ? styles.pauseButton : styles.startButton]}
              onPress={() => timer.isRunning ? handlePause(timer.id) : handleStart(timer.id)}
            >
              <Text style={styles.buttonText}>{timer.isRunning ? 'Pause' : 'Start'}</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.resetButton]} onPress={() => handleReset(timer.id)}>
              <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  timerContainer: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  timerText: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    color:'black',
    borderWidth: 1,
    padding: 5,
    marginBottom: 10,
    borderRadius: 5,
    textAlign: 'center',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  pauseButton: {
    backgroundColor: '#FFA500',
  },
  resetButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TimerApp;
