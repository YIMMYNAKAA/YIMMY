import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onDeleteTask, onStatusChange }) => {
  return (
    <FlatList
      style={styles.container}
      data={tasks}
      renderItem={({ item }) => (
        <TaskItem 
          task={item} 
          onDelete={onDeleteTask} 
          onStatusChange={onStatusChange} // ✅ ส่งฟังก์ชันมาให้ TaskItem
        />
      )}
      keyExtractor={item => item.id}
      ListEmptyComponent={<Text style={styles.emptyText}>ไม่มีงานที่ต้องทำ</Text>}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default TaskList;
