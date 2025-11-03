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



const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ⬇️ ⬇️ ⬇️  ฟังก์ชันที่แก้ไขแล้ว ⬇️ ⬇️ ⬇️
  const handleRegister = async () => {
    
    // 1. การตรวจสอบข้อมูลฝั่ง App (เหมือนเดิม)
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (password.length < 8) {
      Alert.alert('แจ้งเตือน', 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    // ⚠️⚠️⚠️ นี่คือบรรทัดที่แก้ไขแล้ว ⚠️⚠️⚠️
    // เปลี่ยนจาก 'localhost' เป็น IP ของเซิร์ฟเวอร์คุณ
    const API_URL = 'http://192.168.1.38/login/register.php';

    // 3. สร้างข้อมูลที่จะส่ง (เพื่อให้ PHP อ่าน $_POST ได้)
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    try {
      // 4. ส่ง Request แบบ POST ไปยังเซิร์ฟเวอร์ PHP
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      // 5. รับคำตอบกลับมา (ที่ PHP echo ออกมา)
      const responseText = await response.text();

      // 6. ตรวจสอบคำตอบจาก PHP
      if (responseText.includes('success')) {
        Alert.alert('สำเร็จ', 'สมัครสมาชิกเรียบร้อยแล้ว');
        navigation.replace('Login'); // ไปหน้า Login
      } else {
        // แสดง "failure" หรือข้อความ error อื่นๆ ที่ PHP echo
        Alert.alert('สมัครสมาชิกล้มเหลว', 'ข้อมูลไม่ถูกต้อง หรือ ' + responseText);
      }

    } catch (error) {
      // ถ้าเกิดข้อผิดพลาดตอนเชื่อมต่อ (เช่น เน็ตหลุด, เซิร์ฟเวอร์ปิด, IP ผิด)
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: ' + error.message);
    }
  };
  // ⬆️ ⬆️ ⬆️ สิ้นสุดการแก้ไขฟังก์ชัน ⬆️ ⬆️ ⬆️

  // (ส่วน UI ด้านล่างนี้เหมือนเดิมทุกอย่างครับ)
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

        <Text style={styles.subtitle}>WELCOME!</Text>
        <Text style={styles.title}>Sign up</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          placeholderTextColor="#AAA"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

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

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Choose a password (Min. 8 characters)"
          placeholderTextColor="#AAA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#AAA"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create account</Text>
        </TouchableOpacity>

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

// (Stylesheet... เหมือนเดิม)
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
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E1F6E', 
    marginBottom: 24,
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
    color: '#635BFF', 
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default RegisterScreen;
