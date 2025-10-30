import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

export async function requestNotificationPermissions() {
  if (!Device.isDevice) {
    console.log("❌ ต้องใช้งานบนอุปกรณ์จริงเท่านั้น");
    return;
  }

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('แจ้งเตือน', 'ไม่ได้รับอนุญาตให้ใช้งาน Notifications');
  }
}
