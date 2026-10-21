import { View, Text } from 'react-native';
import { colors } from '../../../theme/colors';

export default function Screen() {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ color: colors.text.primary, fontSize: 20, fontWeight: '700' }}>Notifications Settings</Text>
    </View>
  );
}
