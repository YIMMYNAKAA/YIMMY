import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { db, auth } from '../utils/firebase'; // 🔹 นำเข้า auth และ db
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // 🔹 สำหรับไอคอนตู้เย็น (ทางเลือก)

// 🎨 1. กำหนดชุดสีที่จะให้เลือก
const COLOR_PALETTE = [
  '#F4511E', // 🔹 สีส้ม (สีหลักของแอปคุณ)
  '#635BFF', // 🔹 สีม่วง (จากหน้า Login)
  '#4ECDC4', // 🔹 สีเขียวมินต์
  '#FF6B6B', // 🔹 สีแดงอ่อน
  '#FED766', // 🔹 สีเหลือง
  '#2E1F6E', // 🔹 สีม่วงเข้ม
];

// ❗️ ตั้งชื่อไฟล์นี้ว่า AddRefrigeratorScreen.js
const AddRefrigeratorScreen = ({ navigation }) => {
  // 🔹 2. สร้าง State สำหรับเก็บชื่อ และ สีที่เลือก
  const [fridgeName, setFridgeName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]); // 👈 3. เลือกสีแรกเป็นค่าเริ่มต้น

  // 🔹 4. ตั้งค่า Header (ทางเลือก)
  useEffect(() => {
    navigation.setOptions({
      title: 'เพิ่มตู้เย็นใหม่',
      headerStyle: { backgroundColor: '#f4511e' },
      headerTintColor: '#fff',
    });
  }, [navigation]);


  // 🔹 5. ฟังก์ชันสำหรับบันทึกตู้เย็น
  const handleSaveRefrigerator = async () => {
    if (!fridgeName.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่อตู้เย็น');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    try {
      // ❗️ 6. บันทึกลง Collection "refrigerators"
      await addDoc(collection(db, 'refrigerators'), { 
        name: fridgeName.trim(),
        color: selectedColor, // 👈 7. บันทึกสีที่เลือก
        createdAt: serverTimestamp(),
        uid: user.uid // 👈 8. บันทึก ID ของผู้ใช้ (เจ้าของตู้เย็น)
      });

      Alert.alert('สำเร็จ', 'เพิ่มตู้เย็นใหม่เรียบร้อยแล้ว');
      navigation.goBack(); // 🔹 กลับไปหน้าก่อนหน้า

    } catch (error) {
      console.error('Error adding refrigerator:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเพิ่มตู้เย็นได้');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f4511e" />
      <ScrollView style={styles.container}>
        <View style={styles.form}>

          {/* 🔹 ไอคอนตู้เย็น (ทางเลือก) */}
          <View style={styles.iconContainer}>
            <Ionicons name="cube-outline" size={80} color={selectedColor} />
          </View>
          
          {/* 🔹 ช่องใส่ชื่อตู้เย็น */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ชื่อตู้เย็น *</Text>
            <TextInput
              style={styles.input}
              value={fridgeName}
              onChangeText={setFridgeName}
              placeholder="เช่น ตู้เย็นที่บ้าน, ตู้เย็นที่ทำงาน"
              placeholderTextColor="#999"
            />
          </View>

          {/* 🔹 9. ส่วนเลือกสี (Color Palette) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>เลือกสี</Text>
            <View style={styles.colorPaletteContainer}>
              {COLOR_PALETTE.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    // ❗️ 10. ถ้าสีนี้ถูกเลือก ให้แสดงขอบ
                    selectedColor === color && styles.selectedColorSwatch 
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
          </View>

          {/* 🔹 ปุ่มบันทึก */}
          <TouchableOpacity 
            style={styles.submitButton}
            onPress={handleSaveRefrigerator}
          >
            <Text style={styles.submitButtonText}>บันทึกตู้เย็น</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  // 🔹 สไตล์สำหรับส่วนเลือกสี
  colorPaletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  colorSwatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    margin: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  // 🔹 สไตล์สำหรับสีที่ถูกเลือก (มีขอบสีดำ)
  selectedColorSwatch: {
    borderColor: '#333',
  },
  // 🔹 สไตล์ปุ่มบันทึก
  submitButton: {
    backgroundColor: '#f4511e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddRefrigeratorScreen;