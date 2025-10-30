import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';

// 🔹 Import Firebase
import { auth } from './src/utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// 🔹 Import Screens
import HomeScreen from './src/screens/HomeScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
// ❗️ 1. Import หน้าที่ลืมเพิ่มเข้ามา
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

// 🔹 ตั้งค่า Notification Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 🔹 ตรวจสอบว่าผู้ใช้ Login หรือยัง
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
        }}
      >
        {user ? (
          // 🔹 ถ้า Login แล้ว → ไปหน้า Home
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Task Tracker' }} />
            <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'เพิ่มงานใหม่' }} />
            <Stack.Screen name="EditTask" component={EditTaskScreen} options={{ title: 'แก้ไขงาน' }} />
          </>
        ) : (
          // 🔹 ถ้ายังไม่ได้ Login → ไปหน้า Login & Register
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            {/* ❗️ 2. เพิ่มหน้าที่ลืมเข้ามาในกลุ่มนี้ */}
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});