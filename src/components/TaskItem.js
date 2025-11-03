import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TaskItem = ({ task, onDelete, onStatusChange }) => {
  const navigation = useNavigation();
  
  // ✅ ตรวจสอบว่า task และ status มีค่าหรือไม่
  const [status, setStatus] = useState(task?.status ? task.status : "Pending");
  const scaleAnim = new Animated.Value(1); 

  // ✅ ฟังก์ชันอัปเดตสถานะ
  const toggleTaskStatus = async () => {
    if (!task || !task.id || typeof task.status !== "string") {
      console.error("❌ Error: Task data is invalid", task);
      Alert.alert("เกิดข้อผิดพลาด", "ข้อมูลของงานไม่ถูกต้อง กรุณาลองใหม่");
      return;
    }

    try {
      const newStatus = status === "Pending" ? "Completed" : "Pending";
      setStatus(newStatus); // อัปเดต UI ทันที

      // ✅ Animation เมื่อกดปุ่ม
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      // ✅ อัปเดต Firestore
      const taskRef = doc(db, "tasks", task.id);
      await updateDoc(taskRef, { status: newStatus });

      if (onStatusChange) onStatusChange(); // อัปเดตหน้าหลัก

    } catch (error) {
      console.error("🚨 Error updating task status:", error);
      Alert.alert("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตสถานะได้");
      setStatus(task.status); // คืนค่าเดิมถ้า Firestore ล้มเหลว
    }
  };

  // ✅ แปลงรูปแบบวันที่
  const formatDateTime = (dateTime) => {
    if (!dateTime) return "ไม่ระบุวันเวลา";
    const date = new Date(dateTime);
    return date.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("EditTask", { task })}
    >
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{task.title}</Text>

          {/* ✅ ป้ายแสดงสถานะ */}
          <TouchableOpacity
            style={[
              styles.statusBadge,
              { backgroundColor: status === "Completed" ? "#4CAF50" : "#FFC107" },
            ]}
            onPress={toggleTaskStatus}
          >
            <Text style={styles.statusText}>
              {status === "Completed" ? "Completed" : "Pending"}
            </Text>
          </TouchableOpacity>
        </View>

        {task.note && (
          <Text style={styles.note} numberOfLines={2}>
            {task.note}
          </Text>
        )}

        <Text style={styles.datetime}>{formatDateTime(task.datetime)}</Text>

        {/* ✅ ปุ่ม "เสร็จสิ้น" (แสดงเฉพาะเมื่อ Task เป็น Pending) */}
        {status === "Pending" && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity style={styles.completeButton} onPress={toggleTaskStatus}>
              <Text style={styles.completeButtonText}>เสร็จสิ้น</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* ✅ ปุ่มลบงาน */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(task.id)}>
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  note: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  datetime: {
    fontSize: 12,
    color: "#888",
  },
  completeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  deleteButton: {
    padding: 16,
    justifyContent: "center",
  },
  deleteText: {
    fontSize: 24,
    color: "#FF5252",
    fontWeight: "bold",
  },
});

export default TaskItem;
