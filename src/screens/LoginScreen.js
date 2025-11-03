import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView
} from 'react-native';

// (Firebase ถูกลบออกแล้ว)

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      // ❗️ 1. แก้ไข URL ให้มี path 'login' (เหมือน register.php)
      const API_URL = 'http://192.168.1.38/login/login.php';
      
      const response = await fetch(API_URL, { 
        method: 'POST',
        body: formData,
      });

      // ❗️ 2. เปลี่ยนจาก .text() เป็น .json()
      const data = await response.json(); 

      // ❗️ 3. ตรวจสอบ data.status (จาก JSON)
      if (data.status === 'success') { 
        // ❗️ 4. ทักทายชื่อผู้ใช้ที่ดึงมาจากฐานข้อมูล (จาก JSON)
        Alert.alert('สำเร็จ', 'ยินดีต้อนรับ, ' + data.user.name);
        
        // ส่งข้อมูลผู้ใช้ไปหน้า Home (เผื่อต้องใช้)
        navigation.replace('Home', { user: data.user });

      } else {
        // ❗️ 5. แสดง message จาก server (จาก JSON)
        Alert.alert('เข้าสู่ระบบล้มเหลว', data.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ หรือ Server ไม่ได้ส่ง JSON กลับมา');
    }
  };
  
  // --- ส่วน UI (ใช้ของเดิม) ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://st-th-1.byteark.com/assets.punpro.com/contents/i8771/93606335_3248005805235750_5486790569969582080_o.jpg' }}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Hello again!</Text>

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
            placeholder="Enter your password"
            placeholderTextColor="#AAA"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* --- ปุ่ม Login --- */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* --- ลืมรหัสผ่าน --- */}
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>

          {/* --- สมัครสมาชิก --- */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ... (ส่วน Stylesheet ใช้ของเดิม) ...
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', 
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: 260, 
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    marginTop: -30, 
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E1F6E',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#6B6B6B', 
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0', 
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#635BFF', 
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 18,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotText: {
    color: '#6B6B6B',
    fontSize: 13,
    marginTop: 12,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 14,
    paddingBottom: 30, 
  },
  signupText: {
    color: '#6B6B6B',
    fontSize: 13,
  },
  signupLink: {
    color: '#635BFF', 
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default LoginScreen