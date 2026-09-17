'use client';

import { createElement, type ComponentType } from 'react';
import { View } from 'react-native';

type SharedValue<T> = { value: T };

type AnimatedProps<P> = P & {
  animatedProps?: Partial<P>;
};

function createAnimatedComponent<P extends object>(Component: ComponentType<P>) {
  return function AnimatedComponent({ animatedProps, ...props }: AnimatedProps<P>) {
    return createElement(Component, { ...props, ...animatedProps } as P);
  };
}

export function useSharedValue<T>(initialValue: T): SharedValue<T> {
  return { value: initialValue };
}

export function useAnimatedStyle<T extends object>(factory: () => T): T {
  return factory();
}

export function useAnimatedProps<T extends object>(factory: () => T): T {
  return factory();
}

export function useReducedMotion() {
  return true;
}

export function cancelAnimation<T>(_value: SharedValue<T>) {}

export function withTiming<T>(value: T) {
  return value;
}

export function withDelay<T>(_delay: number, value: T) {
  return value;
}

export function withRepeat<T>(value: T) {
  return value;
}

export function withSequence<T>(...values: T[]) {
  return values.at(-1);
}

export function interpolate(value: number, input: readonly number[], output: readonly number[]) {
  const [inputStart, inputEnd] = input;
  const [outputStart, outputEnd] = output;
  if (inputEnd === inputStart) return outputEnd;
  const progress = (value - inputStart) / (inputEnd - inputStart);
  return outputStart + (outputEnd - outputStart) * progress;
}

export function interpolateColor(value: number, input: readonly number[], output: readonly string[]) {
  return value <= input[0] ? output[0] : output.at(-1) ?? output[0];
}

export const Easing = {
  linear: (value: number) => value,
  quad: (value: number) => value * value,
  cubic: (value: number) => value * value * value,
  bezier: () => (value: number) => value,
  in: (easing: (value: number) => number) => easing,
  out: (easing: (value: number) => number) => easing,
  inOut: (easing: (value: number) => number) => easing,
};

const Animated = {
  View,
  createAnimatedComponent,
};

export default Animated;
