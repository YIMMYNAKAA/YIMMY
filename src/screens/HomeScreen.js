// screens/HomeScreen.js
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskList from '../components/TaskList';

const STORAGE_KEY = '@tasks_v1';

const COLORS = {
  primary: '#3498db',
  primaryDark: '#2980b9',
  white: '#FFFFFF',
  lightGray: '#F0F2F5',
  darkGray: '#333333',
  gray: '#888888',
  red: '#e74c3c',
  green: '#2ecc71',
  black: '#000000',
};

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]); // [{id, title, description?, status: 'Pending'|'Completed'}]
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Demo User');

  // --- โหลดครั้งแรก/เมื่อกลับเข้าหน้า ---
  const loadFromStorage = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // เผื่อมีข้อมูลเก่าไม่ครบฟิลด์
        const normalized = Array.isArray(parsed)
          ? parsed.map(t => ({
              id: t.id ?? String(Math.random()),
              title: String(t.title ?? ''),
              description: t.description ?? '',
              status: t.status === 'Completed' ? 'Completed' : 'Pending',
            }))
          : [];
        setTasks(normalized);
      } else {
        // seed ตัวอย่างเล็ก ๆ เพื่อเห็นผลทันที
        const seed = [
          { id: '1', title: 'Read docs', description: 'React Navigation & RN', status: 'Pending' },
          { id: '2', title: 'Grocery', description: 'Milk, eggs, bread', status: 'Completed' },
        ];
        setTasks(seed);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    } catch (e) {
      console.error('Load error', e);
      Alert.alert('Error', 'โหลดงานไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFromStorage();
    }, [loadFromStorage])
  );

  // --- บันทึกลง Storage เมื่อ tasks เปลี่ยน ---
  const persistRef = useRef(null);
  useEffect(() => {
    // กัน spam write: debounce 200ms
    if (persistRef.current) clearTimeout(persistRef.current);
    persistRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error('Save error', e);
      }
    }, 200);
    return () => clearTimeout(persistRef.current);
  }, [tasks]);

  // --- ค้นหา (debounce เล็กน้อย) ---
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim().toLowerCase()), 150);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // --- กรอง + เรียงด้วย useMemo (ไม่ต้องมี filteredTasks แยก) ---
  const visibleTasks = useMemo(() => {
    const filtered = debouncedQuery
      ? tasks.filter(t =>
          (t.title ?? '').toLowerCase().includes(debouncedQuery) ||
          (t.description ?? '').toLowerCase().includes(debouncedQuery)
        )
      : tasks;

    // เรียง Pending มาก่อน Completed
    return [...filtered].sort((a, b) => {
      if (a.status === 'Pending' && b.status === 'Completed') return -1;
      if (a.status === 'Completed' && b.status === 'Pending') return 1;
      return 0;
    });
  }, [tasks, debouncedQuery]);

  // --- เปลี่ยนสถานะ ---
  const toggleTaskStatus = useCallback((taskId) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' }
          : t
      )
    );
  }, []);

  // --- ลบงาน ---
  const handleDeleteTask = useCallback((taskId) => {
    Alert.alert(
      'ยืนยันการลบ',
      'คุณต้องการลบงานนี้ใช่หรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ลบ',
          style: 'destructive',
          onPress: () => setTasks(prev => prev.filter(t => t.id !== taskId)),
        },
      ]
    );
  }, []);

  // --- ออกจากระบบ ---
  const handleLogout = useCallback(() => {
    Alert.alert(
      'ออกจากระบบ',
      'คุณต้องการออกจากระบบหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        {
          text: 'ออกจากระบบ',
          style: 'destructive',
          onPress: () => navigation.replace('Login'),
        },
      ]
    );
  }, [navigation]);

  // --- Header ---
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'My Tasks',
      headerTitleAlign: 'center',
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
          <Ionicons name="log-out-outline" size={26} color={COLORS.white} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => {}} style={styles.headerButton}>
          <Ionicons name="person-circle-outline" size={30} color={COLORS.white} />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: COLORS.primary,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
    });
  }, [navigation, handleLogout]);

  // --- UI helper ---
  const renderLoading = () => (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.statusText}>กำลังโหลดงาน...</Text>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.centered}>
      <Ionicons name="cloud-offline-outline" size={80} color={COLORS.gray} />
      <Text style={styles.emptyText}>คุณยังไม่มีงานเลย!</Text>
      <Text style={styles.emptySubText}>แตะปุ่ม '+' เพื่อเพิ่มงานใหม่</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../screens/1.jpg')}
      resizeMode="cover"
      style={styles.imageBackground}
      blurRadius={Platform.OS === 'ios' ? 10 : 5}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <View style={styles.overlay}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>ยินดีต้อนรับ,</Text>
            <Text style={styles.welcomeName}>{userName}!</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหางาน..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            renderLoading()
          ) : (
            <TaskList
              tasks={visibleTasks}
              onDeleteTask={handleDeleteTask}
              onStatusChange={(id) => toggleTaskStatus(id)}
              ListEmptyComponent={renderEmptyList}
              onEditTask={(task) => navigation.navigate('EditTask', { task })}
            />
          )}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddTask', { onAdd: async (newTask) => {
              // รับงานใหม่จากหน้า AddTask (ถ้าคุณออกแบบให้ callback กลับ)
              setTasks(prev => [{ ...newTask, id: String(Date.now()), status: 'Pending' }, ...prev]);
            }})}
          >
            <Ionicons name="add" size={32} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  imageBackground: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(255,255,255,0.9)' },
  welcomeContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  welcomeTitle: { fontSize: 22, color: COLORS.darkGray },
  welcomeName: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 10 },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: COLORS.darkGray,
  },

  addButton: {
    position: 'absolute', right: 20, bottom: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 5,
  },
  headerButton: { paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: -50 },
  statusText: { marginTop: 10, fontSize: 16, color: COLORS.gray },
  emptyText: { fontSize: 20, fontWeight: '600', color: COLORS.darkGray, marginTop: 16 },
  emptySubText: { fontSize: 16, color: COLORS.gray, marginTop: 8, textAlign: 'center' },
});

export default HomeScreen;
