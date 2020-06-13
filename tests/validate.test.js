import validate from '../src/validate';

test('validates the values', () => {
  expect(validate('hello', /^[a-z]+$/)).toBeTruthy();
  expect(validate('hello')).toBeTruthy();
  expect(validate('')).toBeFalsy();
  expect(validate('yo', s => s[0] === 'y')).toBeTruthy();
  expect(validate('fo', s => s[0] === 'y')).toBeFalsy();
});
