import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import type { Log } from '../../types';
import { Card } from '../ui/Card';

export function LogCard({ log }: { log: Log }) {
  return (
    <Card style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: '700', color: colors.text.primary }}>{log.type}</Text>
      <Text style={{ color: colors.text.secondary, marginTop: 4 }}>
        {new Date(log.loggedAt).toLocaleString()}
      </Text>
    </Card>
  );
}
