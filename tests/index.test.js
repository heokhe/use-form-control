import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import useFormControl from '../src';

function TestInput() {
  const [ref, { value, error, focus }] = useFormControl(/^[a-z]+!$/i);
  return <>
    <input ref={ref} className={error ? 'error' : ''} defaultValue="hi!" />
    <span>{value}</span>
    <button onClick={focus}>Focus</button>
  </>;
}

test('does some basic validations', () => {
  const { container } = render(<TestInput />);
  const [input] = container.getElementsByTagName('input');
  const [span] = container.getElementsByTagName('span');
  expect(input.classList.contains('error')).toBe(false);
  expect(span.textContent).toBe('hi!');

  fireEvent.change(input, { target: { value: 'hello' } });
  expect(span.textContent).toBe('hello');
  expect(input.classList.contains('error')).toBe(true);

  fireEvent.change(input, { target: { value: 'foo!' } });
  expect(span.textContent).toBe('foo!');
  expect(input.classList.contains('error')).toBe(false);

  fireEvent.click(container.getElementsByTagName('button')[0]);
  expect(document.activeElement).toBe(input);
});
