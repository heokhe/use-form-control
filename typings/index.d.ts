import { MutableRefObject } from 'react';

declare function useFormControl<T>(regex: RegExp): [MutableRefObject<T>, {
  isValid: boolean;
  hasError: boolean;
  additionalError: string;
  setAdditionalError: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  focus: () => void;
}]

export default useFormControl;
