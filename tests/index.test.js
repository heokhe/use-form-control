import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import useFormControl from '../src';

afterEach(cleanup);

function TestInput({ defaultValue = '' }) {
  const [ref, { value, error, focus }] = useFormControl(/^[a-z]+!$/i);
  return <>
    <input ref={ref} className={error ? 'error' : ''} defaultValue={defaultValue} />
    <span>{value}</span>
    <button onClick={focus}>Focus</button>
  </>;
}

function setup(defaultValue) {
  const { container } = render(<TestInput defaultValue={defaultValue} />);
  const [input] = container.getElementsByTagName('input');
  const [span] = container.getElementsByTagName('span');
  const [button] = container.getElementsByTagName('button');
  return {
    container, input, span, button
  };
}

test('does some basic validations', () => {
  const { input, span } = setup('hi!');

  expect(input.classList.contains('error')).toBe(false);
  expect(span.textContent).toBe('hi!');

  fireEvent.change(input, { target: { value: 'hello' } });
  expect(span.textContent).toBe('hello');
  expect(input.classList.contains('error')).toBe(true);

  fireEvent.change(input, { target: { value: 'foo!' } });
  expect(span.textContent).toBe('foo!');
  expect(input.classList.contains('error')).toBe(false);
});

test('can focus the input', () => {
  const { input, button } = setup();
  fireEvent.click(button);
  expect(document.activeElement).toBe(input);
});

test('handles blur event', () => {
  const { input, button } = setup();
  fireEvent.click(button);
  fireEvent.blur(input);
  expect(input.classList.contains('error')).toBe(true);
});
