import AsyncStorage from '@react-native-async-storage/async-storage';

// Key constants
const STORAGE_KEYS = {
  TASKS: 'tasks',
  SETTINGS: 'settings',
  USER_PREFERENCES: 'userPreferences'
};

// Task Storage Functions
export const TaskStorage = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const tasksJSON = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      return tasksJSON ? JSON.parse(tasksJSON) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw new Error('ไม่สามารถดึงข้อมูลงานได้');
    }
  },

  // Save task
  saveTask: async (newTask) => {
    try {
      const existingTasks = await TaskStorage.getAllTasks();
      const updatedTasks = [...existingTasks, newTask];
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Error saving task:', error);
      throw new Error('ไม่สามารถบันทึกงานได้');
    }
  },

  // Update task
  updateTask: async (updatedTask) => {
    try {
      const existingTasks = await TaskStorage.getAllTasks();
      const updatedTasks = existingTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      );
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('ไม่สามารถอัพเดทงานได้');
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const existingTasks = await TaskStorage.getAllTasks();
      const updatedTasks = existingTasks.filter(task => task.id !== taskId);
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('ไม่สามารถลบงานได้');
    }
  },

  // Update task status
  updateTaskStatus: async (taskId, newStatus) => {
    try {
      const existingTasks = await TaskStorage.getAllTasks();
      const updatedTasks = existingTasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
      return true;
    } catch (error) {
      console.error('Error updating task status:', error);
      throw new Error('ไม่สามารถอัพเดทสถานะงานได้');
    }
  },

  // Get tasks by status
  getTasksByStatus: async (status) => {
    try {
      const tasks = await TaskStorage.getAllTasks();
      return tasks.filter(task => task.status === status);
    } catch (error) {
      console.error('Error getting tasks by status:', error);
      throw new Error('ไม่สามารถดึงข้อมูลงานตามสถานะได้');
    }
  },

  // Clear all tasks
  clearAllTasks: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.TASKS);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      throw new Error('ไม่สามารถล้างข้อมูลงานได้');
    }
  }
};

// Settings Storage Functions
export const SettingsStorage = {
  // Get settings
  getSettings: async () => {
    try {
      const settingsJSON = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsJSON ? JSON.parse(settingsJSON) : {};
    } catch (error) {
      console.error('Error getting settings:', error);
      throw new Error('ไม่สามารถดึงการตั้งค่าได้');
    }
  },

  // Save settings
  saveSettings: async (settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('ไม่สามารถบันทึกการตั้งค่าได้');
    }
  }
};

// User Preferences Storage Functions
export const UserPreferencesStorage = {
  // Get user preferences
  getUserPreferences: async () => {
    try {
      const preferencesJSON = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferencesJSON ? JSON.parse(preferencesJSON) : {};
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw new Error('ไม่สามารถดึงการตั้งค่าผู้ใช้ได้');
    }
  },

  // Save user preferences
  saveUserPreferences: async (preferences) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
      return true;
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw new Error('ไม่สามารถบันทึกการตั้งค่าผู้ใช้ได้');
    }
  }
};

export default {
  TaskStorage,
  SettingsStorage,
  UserPreferencesStorage,
  STORAGE_KEYS
};