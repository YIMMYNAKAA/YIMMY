import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar
} from 'react-native';
import { auth } from '../utils/firebase';
// ❗️ 1. Import ฟังก์ชันสำหรับส่งอีเมลจาก Firebase
import { sendPasswordResetEmail } from 'firebase/auth'; 

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกอีเมลของคุณ');
      return;
    }

    try {
      // ❗️ 2. นี่คือบรรทัดที่สั่งให้ Firebase "ส่งอีเมล"
      await sendPasswordResetEmail(auth, email); 

      // ❗️ 3. เมื่อส่งสำเร็จ (ไม่ว่าจะอีเมลถูกหรือผิด)
      // เราจะบอกผู้ใช้ให้ไป "เช็คอีเมล"
      Alert.alert(
        'ส่งสำเร็จ',
        'หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้แล้ว กรุณาตรวจสอบอีเมลครับ',
        [
          { text: 'OK', onPress: () => navigation.goBack() } 
        ]
      );

    } catch (error) {
      // (จัดการ Error - แต่เราก็ยังบอกว่า "ส่งสำเร็จ" เพื่อความปลอดภัย)
      console.log(error.code); 
      Alert.alert(
        'ส่งสำเร็จ',
        'หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้แล้ว กรุณาตรวจสอบอีเมลครับ',
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  // ... (ส่วน UI และ Styles ที่เหลือ) ...
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text> 
        </TouchableOpacity>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          No worries! Enter your email below and we will send you a link to reset your password.
        </Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your registered email"
          placeholderTextColor="#AAA"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (Styles) ...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E1F6E',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#635BFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;