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

  const handleInput = event => {
    setHasBeenTouched(true);
    setIsValid(validate(event.target.value, validator));
    setAdditionalError('');
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
    return () => {
      node.removeEventListener('blur', handleBlur);
      node.removeEventListener('input', handleInput);
    };
  }, []);

  return [ref, {
    isValid,
    hasError: !!additionalError || ((hasBeenFocused || hasBeenTouched) && !isValid),
    additionalError,
    setAdditionalError,
    value: ref.current && ref.current.value,
    focus: () => ref.current.focus()
  }];
}
