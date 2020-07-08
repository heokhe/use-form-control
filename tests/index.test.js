import React, { useState, useEffect } from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import useFormControl from '../src';

afterEach(cleanup);

function TestInput({ defaultValue = '' }) {
  const [regex, setRegex] = useState(/^[a-z]+!$/i);
  const [ref, {
    value, hasError, focus, additionalError, setAdditionalError
  }] = useFormControl(regex);
  useEffect(() => {
    // But it stays the same!
    setRegex(!hasError ? /^[a-z]+!$/i : /^!$/);
  }, [hasError]);

  // think of this function as the result of a "server-side validation"
  const submit = () => setAdditionalError('Invalid name');
  return <>
    <input ref={ref} className={hasError ? 'error' : ''} defaultValue={defaultValue} />
    <span>{value}</span>
    <span>{additionalError}</span>
    <button onClick={focus}>Focus</button>
    <button onClick={submit}>Submit</button>
  </>;
}

function setup(defaultValue) {
  const { container } = render(<TestInput defaultValue={defaultValue} />);
  const [input] = container.getElementsByTagName('input');
  const [valueSpan, additionalErrorSpan] = container.getElementsByTagName('span');
  const [focusButton, submitButton] = container.getElementsByTagName('button');
  return {
    container, input, valueSpan, focusButton, additionalErrorSpan, submitButton
  };
}

test('does some basic validations', () => {
  const { input, valueSpan: span } = setup('hi!');

  expect(input.classList.contains('error')).toBe(false);
  expect(span.textContent).toBe('hi!');

  fireEvent.input(input, { target: { value: 'hiii!' } });
  expect(span.textContent).toBe('hiii!');

  fireEvent.input(input, { target: { value: 'hello' } });
  expect(span.textContent).toBe('hello');
  expect(input.classList.contains('error')).toBe(true);

  fireEvent.input(input, { target: { value: 'foo!' } });
  expect(span.textContent).toBe('foo!');
  expect(input.classList.contains('error')).toBe(false);
});

test('can focus the input', () => {
  const { input, focusButton: button } = setup();
  fireEvent.click(button);
  expect(document.activeElement).toBe(input);
});

test('handles blur event', () => {
  const { input, focusButton: button } = setup();
  fireEvent.click(button);
  fireEvent.blur(input);
  expect(input.classList.contains('error')).toBe(true);
});

test('handles change event', () => {
  const { input } = setup();
  input.focus();
  fireEvent.blur(input);
  expect(input.classList.contains('error')).toBe(true);
  fireEvent.change(input, { target: { value: 'yo!' } });
  expect(input.classList.contains('error')).toBe(false);
});

test('handles additional errors', () => {
  const { input, additionalErrorSpan, submitButton } = setup();
  fireEvent.input(input, { target: { value: 'yo' } });
  // The input is surely invalid at this point.
  fireEvent.click(submitButton);
  expect(additionalErrorSpan.textContent.length > 0).toBe(true);
  expect(input.classList.contains('error')).toBe(true);
  // So, Let's fix the typo:
  fireEvent.input(input, { target: { value: `${input.value}!` } });
  expect(additionalErrorSpan.textContent.length).toBe(0);
  expect(input.classList.contains('error')).toBe(false);
});
