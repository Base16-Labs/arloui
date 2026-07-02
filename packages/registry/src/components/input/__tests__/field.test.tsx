import { jest } from '@jest/globals';
import { Text } from 'react-native';
import { Field } from '../field';
import { renderWithTheme, screen, fireEvent } from '../../../../test/render';

describe('Field (composable primitives)', () => {
  it('renders the full composition', () => {
    renderWithTheme(
      <Field>
        <Field.Label>Email</Field.Label>
        <Field.Control>
          <Field.Icon>
            <Text>@</Text>
          </Field.Icon>
          <Field.Input placeholder="you@example.com" />
        </Field.Control>
        <Field.Helper>We never share it</Field.Helper>
      </Field>,
    );
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('@')).toBeTruthy();
    expect(screen.getByPlaceholderText('you@example.com')).toBeTruthy();
    expect(screen.getByText('We never share it')).toBeTruthy();
  });

  describe('Field.Helper', () => {
    it('renders nothing when empty', () => {
      renderWithTheme(<Field>{<Field.Helper>{''}</Field.Helper>}</Field>);
      expect(screen.queryByText(/.+/)).toBeNull();
    });

    it('renders its message when provided', () => {
      renderWithTheme(
        <Field>
          <Field.Helper>Required</Field.Helper>
        </Field>,
      );
      expect(screen.getByText('Required')).toBeTruthy();
    });
  });

  describe('Field.Input', () => {
    it('fires onChangeText, onFocus, and onBlur', () => {
      const onChangeText = jest.fn();
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      renderWithTheme(
        <Field>
          <Field.Control>
            <Field.Input
              placeholder="Name"
              onChangeText={onChangeText}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </Field.Control>
        </Field>,
      );
      const input = screen.getByPlaceholderText('Name');
      fireEvent.changeText(input, 'Ada');
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');
      expect(onChangeText).toHaveBeenCalledWith('Ada');
      expect(onFocus).toHaveBeenCalledTimes(1);
      expect(onBlur).toHaveBeenCalledTimes(1);
    });

    it('renders an inset label', () => {
      renderWithTheme(
        <Field>
          <Field.Control>
            <Field.Input insetLabel="Amount" placeholder="0.00" />
          </Field.Control>
        </Field>,
      );
      expect(screen.getByText('Amount')).toBeTruthy();
    });

    it('is not editable when the Field is disabled', () => {
      renderWithTheme(
        <Field disabled>
          <Field.Control>
            <Field.Input placeholder="Locked" />
          </Field.Control>
        </Field>,
      );
      expect(screen.getByPlaceholderText('Locked').props.editable).toBe(false);
    });
  });

  describe('Field.Action', () => {
    it('renders an accessible button and fires onPress', () => {
      const onPress = jest.fn();
      renderWithTheme(
        <Field>
          <Field.Control>
            <Field.Input placeholder="Search" />
            <Field.Action accessibilityLabel="Clear" onPress={onPress}>
              <Text>×</Text>
            </Field.Action>
          </Field.Control>
        </Field>,
      );
      const action = screen.getByRole('button', { name: 'Clear' });
      fireEvent.press(action);
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('inherits the disabled state from the Field', () => {
      const onPress = jest.fn();
      renderWithTheme(
        <Field disabled>
          <Field.Control>
            <Field.Action accessibilityLabel="Clear" onPress={onPress}>
              <Text>×</Text>
            </Field.Action>
          </Field.Control>
        </Field>,
      );
      const action = screen.getByRole('button', { name: 'Clear' });
      expect(action.props.accessibilityState).toMatchObject({ disabled: true });
    });
  });

  describe('size × appearance matrix', () => {
    it('renders all four combinations', () => {
      for (const size of ['sm', 'md'] as const) {
        for (const appearance of ['filled', 'plain'] as const) {
          const { unmount } = renderWithTheme(
            <Field size={size} appearance={appearance}>
              <Field.Control>
                <Field.Input placeholder={`${size}-${appearance}`} />
              </Field.Control>
            </Field>,
          );
          expect(screen.getByPlaceholderText(`${size}-${appearance}`)).toBeTruthy();
          unmount();
        }
      }
    });

    it('applies the error palette without crashing', () => {
      renderWithTheme(
        <Field error>
          <Field.Label>Email</Field.Label>
          <Field.Control>
            <Field.Input placeholder="bad@" />
          </Field.Control>
          <Field.Helper>Invalid email</Field.Helper>
        </Field>,
      );
      expect(screen.getByText('Invalid email')).toBeTruthy();
    });
  });
});
