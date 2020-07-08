import { useRef, useEffect, useState } from 'react';
import validate from './validate';

export default function useFormControl(validator) {
  const ref = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [additionalError, setAdditionalError] = useState('');
  // This lets us know the user has interacted with the input after it has mounted,
  // Or an additional error occured.
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const handleChange = event => {
    setIsValid(validate(event.target.value, validator));
    setAdditionalError('');
  };

  const handleInput = event => {
    setHasBeenTouched(true);
    handleChange(event);
  };

  const handleBlur = () => {
    setHasBeenTouched(false);
    setHasBeenFocused(true);
  };

  useEffect(() => {
    const node = ref.current;
    setIsValid(validate(node.value, validator));
    node.addEventListener('blur', handleBlur);
    node.addEventListener('input', handleInput);
    node.addEventListener('change', handleChange);
    return () => {
      node.removeEventListener('blur', handleBlur);
      node.removeEventListener('input', handleInput);
      node.removeEventListener('change', handleChange);
    };
  }, []);

  return [ref, {
    isValid,
    hasError: !!additionalError || ((hasBeenFocused || hasBeenTouched) && !isValid),
    additionalError,
    setAdditionalError,
    get value() {
      return ref.current ? ref.current.value : undefined;
    },
    input: ref.current,
    focus: () => ref.current.focus()
  }];
}
