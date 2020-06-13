import { useRef, useEffect, useState } from 'react';

export default function useFormControl(regex) {
  const ref = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [additionalError, setAdditionalError] = useState('');
  // This lets us know the user has interacted with the input after it has mounted,
  // Or an additional error occured.
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  const handleChange = event => {
    setHasBeenTouched(true);
    setIsValid(regex.test(event.target.value));
    setAdditionalError('');
  };

  const handleBlur = () => {
    setHasBeenTouched(false);
    setHasBeenFocused(true);
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const node = ref.current;
    setIsValid(regex.test(node.value));
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
