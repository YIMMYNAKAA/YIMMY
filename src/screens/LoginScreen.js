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
import { auth } from '../utils/firebase'; // 🔹 นำเข้า Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';

// --- หมายเหตุ ---
// 1. คุณต้องมีรูปภาพส่วนหัว (แพนเค้ก) ในโปรเจกต์ของคุณ
// 2. ผมจะใช้ชื่อ '.../assets/login-header.jpg' เป็นตัวอย่าง
// 3. อย่าลืมเปลี่ยน path '.../assets/login-header.jpg' ให้ตรงกับไฟล์รูปของคุณ
//
// const headerImage = require('../assets/login-header.jpg');
// ----------------

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('สำเร็จ', 'เข้าสู่ระบบเรียบร้อยแล้ว');
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('เข้าสู่ระบบล้มเหลว', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* === ส่วนหัว (รูปภาพ) === */}
        <View style={styles.headerContainer}>
          <Image
            // ✅ แก้ไขโดยใช้ URL
            source={{ uri: 'https://st-th-1.byteark.com/assets.punpro.com/contents/i8771/93606335_3248005805235750_5486790569969582080_o.jpg' }} // <-- ใส่ URL ของคุณตรงนี้
            style={styles.headerImage}
            resizeMode="cover"
          />
        </View>

        {/* === ส่วนฟอร์ม (พื้นที่สีขาว) === */}
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
            secureTextEntry // ทำให้เป็น text รหัสผ่าน
            value={password}
            onChangeText={setPassword}
          />

          {/* --- ปุ่ม Login --- */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* --- ลืมรหัสผ่าน (✅ แก้ไขแล้ว) --- */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // สีพื้นหลังของส่วนฟอร์ม
  },
  container: {
    flex: 1,
  },
  // --- ส่วนหัว ---
  headerContainer: {
    width: '100%',
    height: 260, // กำหนดความสูงของรูป
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  // --- ส่วนฟอร์ม ---
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,  // ทำให้ขอบบนซ้ายโค้ง
    borderTopRightRadius: 30, // ทำให้ขอบบนขวาโค้ง
    marginTop: -30,           // ดึงฟอร์มขึ้นไปทับรูปภาพ 30px
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E1F6E', // สีม่วงเข้ม
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#6B6B6B', // สีเทา
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0', // สีขอบเทาอ่อน
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  // --- ปุ่ม Login ---
  loginButton: {
    backgroundColor: '#635BFF', // สีม่วงสด
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
  // --- ลิงก์อื่นๆ ---
  forgotText: {
    color: '#6B6B6B',
    fontSize: 13,
    marginTop: 12,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 14,
    paddingBottom: 30, // เพิ่มระยะห่างด้านล่างสุด
  },
  signupText: {
    color: '#6B6B6B',
    fontSize: 13,
  },
  signupLink: {
    color: '#635BFF', // สีม่วงสด
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default LoginScreen;