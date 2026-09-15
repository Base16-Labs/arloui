import { useState } from 'react';
import { VariantChip, VariantControlRow } from './variant-controls';

export function useChartMotionControls() {
  const [animated, setAnimated] = useState(true);
  const [replay, setReplay] = useState(0);
  return { animated, setAnimated, replay, onReplay: () => setReplay((value) => value + 1) };
}

export function ChartMotionControls({ animated, setAnimated, onReplay, disabled = false }: {
  animated: boolean;
  setAnimated: (value: boolean) => void;
  onReplay: () => void;
  disabled?: boolean;
}) {
  return <VariantControlRow label="Motion">
    <VariantChip label="on" active={animated} onPress={() => {
      setAnimated(true);
      if (animated && !disabled) onReplay();
    }} />
    <VariantChip label="off" active={!animated} onPress={() => setAnimated(false)} />
  </VariantControlRow>;
}
