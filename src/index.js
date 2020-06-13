import { useRef, useEffect, useState } from 'react';
import validate from './validate';

export default function useFormControl(validator) {
  const validatorRef = useRef();
  useEffect(() => {
    validatorRef.current = validator;
  }, []);

  const ref = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [additionalError, setAdditionalError] = useState('');
  // This lets us know the user has interacted with the input after it has mounted,
  // Or an additional error occured.
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const handleChange = event => {
    setHasBeenTouched(true);
    setIsValid(validate(event.target.value, validatorRef.current));
    setAdditionalError('');
  };

  const handleBlur = () => {
    setHasBeenTouched(false);
    setHasBeenFocused(true);
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const node = ref.current;
    setIsValid(validate(node.value, validatorRef.current));
    node.addEventListener('blur', handleBlur);
    node.addEventListener('change', handleChange);
    return () => {
      node.removeEventListener('blur', handleBlur);
      node.removeEventListener('change', handleChange);
    };
  }, [ref.current]);

  return [ref, {
    isValid,
    hasError: !!additionalError || ((hasBeenFocused || hasBeenTouched) && !isValid),
    additionalError,
    setAdditionalError,
    value: ref.current && ref.current.value,
    focus: () => ref.current.focus()
  }];
}
