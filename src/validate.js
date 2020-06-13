export default function validate(input, validator = _ => _) {
  return typeof validator === 'function' ? !!validator(input) : validator.test(input);
}
