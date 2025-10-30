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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState(''); // 🔹 เพิ่ม State สำหรับ 'Name'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 🔹 คง State นี้ไว้

  const handleRegister = async () => {
    // 🔹 เพิ่ม 'name' ในการตรวจสอบ
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    // 🔹 ตรวจสอบความยาวรหัสผ่าน (ตาม Placeholder)
    if (password.length < 8) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    try {
      // 1. สร้างผู้ใช้
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. (ทางเลือก) อัปเดตโปรไฟล์ Firebase Auth ด้วย 'name'
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อยแล้ว');
      navigation.replace('Login'); // 🔹 ไปที่หน้า Login
    } catch (error) {
      Alert.alert('สมัครสมาชิกล้มเหลว', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* === ปุ่มย้อนกลับ === */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          {/* คุณสามารถใช้ Icon แทนได้ แต่ Text ก็ง่ายดีครับ */}
          <Text style={styles.backButtonText}>←</Text> 
        </TouchableOpacity>

        {/* === หัวข้อ === */}
        <Text style={styles.subtitle}>WELCOME!</Text>
        <Text style={styles.title}>Sign up</Text>

        {/* --- Name --- */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#AAA"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

        {/* --- Email --- */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#AAA"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {/* --- Password --- */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Choose a password (Min. 8 characters)"
          placeholderTextColor="#AAA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* --- Confirm Password (จากโค้ดเดิม) --- */}
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#AAA"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* --- ปุ่มสมัครสมาชิก --- */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

        {/* --- ลิงก์ไปหน้า Login --- */}
        <View style={styles.bottomLinkContainer}>
          <Text style={styles.bottomLinkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.bottomLink}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// 🎨 Stylesheet ที่อัปเดตใหม่ทั้งหมด
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
    paddingTop: 20, // เพิ่มระยะห่างด้านบน
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
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E1F6E', // สีม่วงเข้ม
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#6B6B6B', // สีเทา
    marginBottom: 6,
    marginTop: 10, // เพิ่มระยะห่างระหว่างช่อง
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0', // สีขอบเทาอ่อน
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#635BFF', // สีม่วงสด
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24, // เพิ่มระยะห่างด้านบนปุ่ม
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomLinkContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  bottomLinkText: {
    color: '#6B6B6B',
    fontSize: 13,
  },
  bottomLink: {
    color: '#635BFF', // สีม่วงสด
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default RegisterScreen;