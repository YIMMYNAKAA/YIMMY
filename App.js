import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';


// 🔹 Import Screens (เหมือนเดิม)
import HomeScreen from './src/screens/HomeScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// 🔹 ตั้งค่า Notification Handler (เหมือนเดิม)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  
  // ❌ ลบ useEffect, useState, และ if (isLoading) ทั้งหมด

  return (
    <NavigationContainer>
      <Stack.Navigator
        // ❗️ 1. กำหนดให้ "Login" เป็นหน้าแรกเสมอ
        initialRouteName="Login" 
        screenOptions={{
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
        }}
      >
        {/* ❗️ 2. รวมทุกหน้าจอไว้ใน Stack เดียวกัน */}
        
        {/* 🔹 กลุ่มหน้าจอ Auth (ไม่แสดง Header) */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />

        {/* 🔹 กลุ่มหน้าจอหลัก (แสดง Header) */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Task Tracker' }} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'เพิ่มงานใหม่' }} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'แก้ไขงาน' }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // ❌ ลบ loadingContainer
});
