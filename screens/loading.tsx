/* eslint-disable react-native/no-color-literals, @typescript-eslint/no-unused-vars */
// loading screen appears before theme context loads - must use hardcoded colors
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoadingScreen() {
  // useRef keeps the same Animated.Values across renders
  const spinAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [spinAnim, fadeAnim, scaleAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ rotate: spin }, { scale: scaleAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.gradientCircle}>
          <Ionicons name="checkmark-done" size={32} color="#fff" />
        </View>
      </Animated.View>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Gradient
      </Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
        Loading your grades...
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  gradientCircle: {
    alignItems: 'center',
    backgroundColor: '#10B981',
    borderRadius: 40,
    elevation: 8,
    height: 80,
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: 80,
  },
  iconContainer: {
    marginBottom: 20,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
  },
  title: {
    color: '#10B981',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
});
