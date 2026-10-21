import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { useUiStore } from '../../stores/ui.store';

export function ToastHost() {
  const { toasts, dismissToast } = useUiStore();

  useEffect(() => {
    if (!toasts.length) {
      return;
    }
    const t = setTimeout(() => dismissToast(toasts[0].id), 2500);
    return () => clearTimeout(t);
  }, [toasts, dismissToast]);

  if (!toasts.length) {
    return null;
  }

  const toast = toasts[0];
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        bottom: 32,
        left: 16,
        right: 16,
        backgroundColor:
          toast.type === 'error' ? colors.error : colors.secondary,
        padding: 14,
        borderRadius: 12,
      }}
    >
      <Text style={{ color: '#fff', textAlign: 'center' }}>{toast.message}</Text>
    </View>
  );
}
