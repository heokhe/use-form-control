import React from 'react'
import useFormControl from '../src';
import { render, fireEvent } from '@testing-library/react';

function TestInput() {
  const [ref, { value, error }] = useFormControl(/^[a-z]+\!$/i);
  return <>
    <input ref={ref} className={error ? 'error' : ''} />
    <span>{value}</span>
  </>
}

test('bruh', () => {
  const { container } = render(<TestInput />);
  const [input] = container.getElementsByTagName('input');
  const [span] = container.getElementsByTagName('span');
  expect(input.classList.contains('error')).toBe(false);
  expect(span.textContent).toBe('');

  input.value = 'hello';
  fireEvent.change(input);
  expect(span.textContent).toBe('hello');
  expect(input.classList.contains('error')).toBe(true);

  input.value = 'hello!';
  fireEvent.change(input);
  expect(span.textContent).toBe('hello!');
  expect(input.classList.contains('error')).toBe(false);
})
 