import { useRef, useEffect, useState } from 'react';

/**
 * @param {RegExp} regex RegExp to check whether the value is valid or not.
 * @returns {[import('react').Ref<any>, {
     value: string,
     isValid: boolean,
     error: boolean,
     focus(): void
 * }]}
 */
export default function useFormControl(regex) {
  const ref = useRef(null);
  const [isValid, setIsValid] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);
  const [additionalError, setAdditionalError] = useState('');
  const handleChange = event => {
    if (!hasBeenTouched) setHasBeenTouched(true);
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
    if (node) {
      setIsValid(regex.test(node.value));
      node.addEventListener('blur', handleBlur);
      node.addEventListener('change', handleChange);
      return () => {
        node.removeEventListener('blur', handleBlur);
        node.removeEventListener('change', handleChange);
      };
    }
  }, [ref.current]);
  return [ref, {
    isValid,
    error: !!additionalError || ((hasBeenFocused || hasBeenTouched) && !isValid),
    additionalError,
    setAdditionalError,
    /** @returns {string} */
    get value() {
      return ref.current && ref.current.value;
    },
    focus() {
      if (ref.current) ref.current.focus();
    }
  }];
}
