# use-form-control
[![Minzipped size](https://badgen.net/bundlephobia/minzip/use-form-control)](https://bundlephobia.com/result?p=use-form-control)

React hook for controlling and validating inputs.

## Usage
The hook takes a "validator":
```ts
type Validator = RegExp | ((value: string) => boolean);
```
And returns two things: a ref, and a object containing multiple things:
| name | type | description
| --- | --- | ---
| value | `string` | The value of the input.
| isValid | `boolean` | True if the value matches the given validator.
| hasError | `boolean` | True if there's an error.
| additionalError | `string?` | Any external error, such as the result of a server-side validation. You can display this string as a message near your form control.
| setAdditionalError | `(error: string) => void` | Sets an `additionalError`.
| focus | `() => void` | Equivalent to `input.focus()`.

You should attach the ref to your form control, and you're good to go.

## Example
See [This CodeSandbox](https://codesandbox.io/s/use-form-control-demo-fh62y).
