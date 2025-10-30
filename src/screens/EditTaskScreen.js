import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import TaskForm from '../components/TaskForm';
import { db } from '../utils/firebase'; // ✅ นำเข้า Firestore
import { doc, updateDoc } from 'firebase/firestore';

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params; // ✅ รับข้อมูล Task ที่จะทำการแก้ไข
  const [loading, setLoading] = useState(false);

  // ✅ ฟังก์ชันแก้ไขงานใน Firestore
  const handleSubmit = async (updatedTaskData) => {
    setLoading(true);
    try {
      const taskRef = doc(db, 'tasks', task.id);

      // ✅ อัปเดตข้อมูล Task ใน Firestore
      await updateDoc(taskRef, updatedTaskData);

      setLoading(false);
      Alert.alert('สำเร็จ', 'อัพเดทงานเรียบร้อยแล้ว', [
        { text: 'ตกลง', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'ไม่สามารถอัพเดทข้อมูลได้');
      console.error('Error updating task:', error);
    }
  };

  // ✅ ฟังก์ชันเปลี่ยนสถานะ Task
  const handleStatusChange = async (newStatus) => {
    try {
      const updatedTask = { ...task, status: newStatus };
      await handleSubmit(updatedTask);
    } catch (error) {
      Alert.alert('Error', 'ไม่สามารถเปลี่ยนสถานะได้');
      console.error('Error updating status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TaskForm 
        initialTask={task}
        onSubmit={handleSubmit}
        onStatusChange={handleStatusChange} // ✅ เพิ่มฟังก์ชันเปลี่ยนสถานะ
        loading={loading} // ✅ แสดง Loading ถ้ากำลังอัปเดต
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default EditTaskScreen;
