// screens/AddTaskScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, TextInput,
  TouchableOpacity, Image, StyleSheet, StatusBar, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// (Firebase imports ถูกลบออกไปแล้ว)


// --- ‼️ [IMPORTANT] แก้ไข URL นี้ให้เป็นที่อยู่เซิร์ฟเวอร์ PHP ของคุณ ‼️ ---
const API_URL = 'http://192.168.1.10/api/add_task.php'; 
// -----------------------------------------------------------------


// --- 🔽 [FIX] ย้าย Styles ขึ้นมาไว้ด้านบน 🔽 ---
const BOX = 260;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20 },

  uploadBox: {
    width: '100%',
    height: BOX,
    backgroundColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  preview: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { marginTop: 6, color: '#555' },

  inputGroup: { marginTop: 18 },
  label: { marginBottom: 8, color: '#333', fontSize: 16 },
  input: {
    backgroundColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },

  button: {
    marginTop: 28,
    backgroundColor: '#ddd', // สีปุ่มควรจะเด่นกว่านี้
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#111', fontSize: 16, fontWeight: '600' },
});
// --- 🔼 [FIX] สิ้นสุดการย้าย Styles 🔼 ---


const AddTaskScreen = ({ navigation }) => {
  const [taskName, setTaskName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'เพิ่มงานใหม่ (Add Task)',
      headerStyle: { backgroundColor: '#f4511e' },
      headerTintColor: '#fff',
    });
  }, [navigation]);

  // ✅ เลือกรูปจากแกลเลอรี (หรือไฟล์ในคอม ถ้าเป็น Web) - (ส่วนนี้เหมือนเดิม)
  const pickFromLibrary = async () => {
    try {
      // (สำหรับ Web, Expo จะขอสิทธิ์โดยอัตโนมัติ)
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('ต้องการสิทธิ์', 'กรุณาอนุญาตการเข้าถึงรูปภาพ');
          return;
        }
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเปิดแกลเลอรีได้');
    }
  };

  
  // --- 🔽 [CHANGE] เขียนฟังก์ชัน handleSave ใหม่ทั้งหมดสำหรับ PHP 🔽 ---
  const handleSave = async () => {
    if (!taskName.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่องาน');
      return;
    }
    if (!photoUri) {
      Alert.alert('แจ้งเตือน', 'กรุณาอัปโหลดรูปก่อนบันทึก');
      return;
    }
    
    try {
      setSaving(true);

      // 1. สร้าง FormData เพื่อส่งข้อมูลไปที่ PHP
      const formData = new FormData();
      
      // 2. เพิ่มชื่องาน (ต้องตรงกับ $_POST['task_name'] ใน PHP)
      formData.append('task_name', taskName.trim());

      // 3. เตรียมไฟล์รูปภาพ
      // (สำหรับ Web)
      if (Platform.OS === 'web') {
        const res = await fetch(photoUri);
        const blob = await res.blob();
        // (ชื่อไฟล์ 'task_image' ต้องตรงกับ $_FILES['task_image'] ใน PHP)
        formData.append('task_image', blob, 'photo.jpg');
      } 
      // (สำหรับ Mobile - React Native)
      else {
        // (แก้ไขการดึงชื่อไฟล์สำหรับ Mobile)
        const uriParts = photoUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        const file = {
          uri: photoUri,
          name: `photo.${fileType}`, // ใช้ชื่อไฟล์แบบไดนามิก
          type: `image/${fileType}`, // ใช้ Mime Type แบบไดนามิก
        };
        // (ชื่อไฟล์ 'task_image' ต้องตรงกับ $_FILES['task_image'] ใน PHP)
        formData.append('task_image', file);
      }
      
      // 4. ส่ง Request ไปยัง API_URL (add_task.php)
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          // ไม่ต้องใส่ 'Content-Type': 'multipart/form-data'
          // fetch จะจัดการให้เองเมื่อใช้ FormData
        },
      });

      // 5. รับค่า JSON ที่ PHP ส่งกลับมา
      const result = await response.json();

      // 6. ตรวจสอบ status ที่ PHP ส่งกลับมา
      if (result.status === 'success') {
        Alert.alert('สำเร็จ', result.message || 'บันทึกงานเรียบร้อยแล้ว');
        navigation.goBack();
      } else {
        Alert.alert('เกิดข้อผิดพลาด', result.message || 'ไม่สามารถบันทึกงานได้');
      }

    } catch (err) {
      console.error(err);
      // (แจ้งเตือนหาก network error หรือ URL ผิด)
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: ' + err.message);
    } finally {
      setSaving(false);
    }
  };
  // --- 🔼 [CHANGE] สิ้นสุดฟังก์ชัน handleSave 🔼 ---

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f4511e" />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>

          {/* กล่องอัปโหลดรูป (แตะเพื่อเลือกจากแกลเลอรี/คอม) */}
          <TouchableOpacity style={styles.uploadBox} onPress={pickFromLibrary} activeOpacity={0.8}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.preview} />
            ) : (
              <View style={styles.placeholder}>
                <Ionicons name="image-outline" size={28} color="#777" />
                <Text style={styles.placeholderText}>upload</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* ช่องชื่อ */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ชื่องาน</Text>
            <TextInput
              style={styles.input}
              value={taskName}
              onChangeText={setTaskName}
              placeholder="ชื่องาน"
              placeholderTextColor="#999"
              returnKeyType="done"
            />
          </View>

          {/* ปุ่มบันทึก */}
          <TouchableOpacity
            style={[styles.button, (saving || !taskName.trim() || !photoUri) && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving || !taskName.trim() || !photoUri}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>บันทึก</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// (ลบ Styles ที่อยู่ท้ายไฟล์ออก เพราะย้ายไปข้างบนแล้ว)

export default AddTaskScreen;

