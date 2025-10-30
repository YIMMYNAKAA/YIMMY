import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../utils/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import TaskList from '../components/TaskList';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const isFocused = useIsFocused();

  // ✅ โหลดงานจาก Firestore
  const loadTasks = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(collection(db, 'tasks'), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const taskList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskList);
      setFilteredTasks(taskList);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ โหลดข้อมูลใหม่เมื่อกลับมาหน้า Home
  useEffect(() => {
    if (isFocused) {
      loadTasks();
    }
  }, [isFocused]);

  // ✅ เปลี่ยนสถานะของ Task
  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';

      await updateDoc(taskRef, { status: newStatus });

      // ✅ โหลดข้อมูลใหม่หลังจากอัปเดต
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // ✅ ลบงาน
  const handleDeleteTask = async (taskId) => {
    Alert.alert(
      'ยืนยันการลบ',
      'คุณต้องการลบงานนี้ใช่หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'tasks', taskId));
              loadTasks();
            } catch (error) {
              console.error(error);
            }
          }
        }
      ]
    );
  };

  // ✅ Logout
  const handleLogout = async () => {
    Alert.alert(
      "ออกจากระบบ",
      "คุณต้องการออกจากระบบหรือไม่?",
      [
        { text: "ยกเลิก", style: "cancel" },
        {
          text: "ออกจากระบบ",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.replace('Login');
            } catch (error) {
              Alert.alert("Error", "ไม่สามารถออกจากระบบได้");
            }
          }
        }
      ]
    );
  };

  // ✅ ค้นหางาน
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredTasks(tasks);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(lowerCaseQuery) ||
      (task.description && task.description.toLowerCase().includes(lowerCaseQuery))
    );

    setFilteredTasks(filtered);
  };

  // ✅ ตั้งค่า Header พร้อมปุ่ม Logout
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Task Tracker",
      headerTitleAlign: "center",
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#f4511e",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      }
    });
  }, [navigation]);

  return (
    <View style={styles.container}>

      {/* ✅ Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหางาน..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* ✅ Task List */}
      <TaskList 
        tasks={filteredTasks}
        onDeleteTask={handleDeleteTask}
        onStatusChange={toggleTaskStatus} 
      />

      {/* ✅ Add Task Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f4511e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    paddingHorizontal: 15,
  },
});

export default HomeScreen;
