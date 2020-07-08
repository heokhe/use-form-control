import { MutableRefObject } from 'react';

declare type Validator = RegExp | ((value: string) => boolean);

declare function useFormControl<T>(validator?: Validator): [MutableRefObject<T>, {
  isValid: boolean;
  hasError: boolean;
  additionalError: string;
  setAdditionalError: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  input: T;
  focus: () => void;
}]

export default useFormControl;
