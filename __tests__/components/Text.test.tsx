/**
 * Text Component Tests
 * 
 * Snapshot and unit tests for Text component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../../src/components/primitives/Text';

describe('Text Component', () => {
  it('renders correctly with default props', () => {
    const { toJSON } = render(<Text>Hello World</Text>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with size prop', () => {
    const { toJSON } = render(<Text size={20}>Hello World</Text>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with variant prop', () => {
    const { toJSON } = render(<Text variant="h1">Heading</Text>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with className', () => {
    const { toJSON } = render(<Text className="text-primary">Colored Text</Text>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('allows font scaling by default', () => {
    const { getByText } = render(<Text>Test</Text>);
    const text = getByText('Test');
    expect(text.props.allowFontScaling).toBe(true);
  });

  it('disables font scaling when specified', () => {
    const { getByText } = render(<Text allowFontScaling={false}>Test</Text>);
    const text = getByText('Test');
    expect(text.props.allowFontScaling).toBe(false);
  });
});

