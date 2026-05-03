import { Modal, Pressable, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet({ visible, title, onClose, children }: Props) {
  return (
    <Modal transparent animationType="slide" visible={visible}>
      <Pressable
        style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          }}
        >
          {title ? (
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                marginBottom: 12,
                color: colors.text.primary,
              }}
            >
              {title}
            </Text>
          ) : null}
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
