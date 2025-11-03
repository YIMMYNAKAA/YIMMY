// screens/AddTaskScreen.js
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, ScrollView, View, Text, TextInput,
  TouchableOpacity, Image, StyleSheet, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


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

  // ✅ เลือกรูปจากแกลเลอรีอย่างเดียว
  const pickFromLibrary = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('ต้องการสิทธิ์', 'กรุณาอนุญาตการเข้าถึงรูปภาพ');
        return;
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

  // 📤 อัปโหลดรูปขึ้น Storage แล้วคืน URL
  const uploadToStorageAndGetURL = async (uri, path) => {
    const res = await fetch(uri);
    const blob = await res.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const handleSave = async () => {
    if (!taskName.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่องาน');
      return;
    }
    if (!photoUri) {
      Alert.alert('แจ้งเตือน', 'กรุณาอัปโหลดรูปก่อนบันทึก');
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('แจ้งเตือน', 'กรุณาเข้าสู่ระบบก่อนใช้งาน');
      return;
    }

    try {
      setSaving(true);

      // อัปโหลดรูปไป Storage
      const filename = `tasks/${user.uid}/${Date.now()}.jpg`;
      const photoURL = await uploadToStorageAndGetURL(photoUri, filename);

      // บันทึกใน Firestore
      await addDoc(collection(db, 'tasks'), {
        name: taskName.trim(),
        photoURL,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      Alert.alert('สำเร็จ', 'บันทึกงานเรียบร้อยแล้ว');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกงานได้');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#f4511e" />
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.inner}>

          {/* กล่องอัปโหลดรูป (แตะเพื่อเลือกจากแกลเลอรี) */}
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
    backgroundColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#111', fontSize: 16, fontWeight: '600' },
});

export default AddTaskScreen;
