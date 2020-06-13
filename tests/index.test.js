import React from 'react'
import useFormControl from '../src';
import { render, fireEvent } from '@testing-library/react';

function TestInput() {
  const [ref, { value, error, focus }] = useFormControl(/^[a-z]+\!$/i);
  return <>
    <input ref={ref} className={error ? 'error' : ''} />
    <span>{value}</span>
    <button onClick={focus}>Focus</button>
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

  fireEvent.click(container.getElementsByTagName('button')[0]);
  expect(document.activeElement).toBe(input)
})
 