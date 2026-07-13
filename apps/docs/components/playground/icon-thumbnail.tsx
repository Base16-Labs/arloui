import { memo } from 'react';
import { View } from 'react-native';
import { iconByFileBase } from '@/lib/icon-registry';

type IconThumbnailProps = {
  name: string;
  size: number;
  color: string;
};

export const IconThumbnail = memo(function IconThumbnail({ name, size, color }: IconThumbnailProps) {
  const Icon = iconByFileBase[name];

  if (!Icon) {
    return <View style={{ width: size, height: size }} />;
  }

  return <Icon width={size} height={size} color={color} fill={color} />;
});
