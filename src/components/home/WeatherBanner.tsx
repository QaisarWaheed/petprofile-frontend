import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';

export function WeatherBanner() {
  return (
    <View
      style={{
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.secondary,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{'Today\'s walk'}</Text>
      <Text style={{ color: '#ffffffcc', marginTop: 4 }}>
        Great conditions for a stroll with your pet.
      </Text>
    </View>
  );
}
