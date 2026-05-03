import { Text } from 'react-native';
import { colors } from '../../theme/colors';
import { Card } from '../ui/Card';

export function AIInsightCard({ text }: { text: string }) {
  return (
    <Card>
      <Text style={{ color: colors.text.secondary, marginBottom: 6 }}>AI insight</Text>
      <Text style={{ color: colors.text.primary, lineHeight: 22 }}>{text}</Text>
    </Card>
  );
}
