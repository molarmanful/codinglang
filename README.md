# codinglang
The Coding Language official browser Javascript interpreter and specs. Made in response to [this r/ProgrammerHumor post](https://www.reddit.com/r/ProgrammerHumor/comments/5gfomg/til_most_people_go_to_special_training_for_years/).

As of now, the interpreter only works in browsers with ES6 support. Legacy Javascript support will come soon.

##Specifications
`Coding` is essentially [Underload](https://esolangs.org/wiki/Underload) optimized for HTML -- "stack-based HTML." As of now, the standard library pretty much consists of only the essential functions needed for Turing-completeness and basic markup; expansion will come with time.

###Syntax
`Coding` has 2 stacks, one for strings and another for HTML output. Parentheses push to the string stack; for example, `(asdf)` would push `asdf` to the string stack. Trailing parentheses are optional, but be sure to escape parentheses with `\` when necessary.

```
(asdf)
(Hey (it's me!\))
```

The standard library has a function `S` that can push from the string stack to the output stack. In addition, there are several pseudo-functions:

- `>`: Pops top string stack element, wraps with a tag name, and pushes to output stack. The tag must match the regex `[A-Za-z][-_A-Za-z0-9]*`. Example: `(asdf) >h1`

- `.`: Adds a class to the top output stack element. The class must match the regex `"-"?[_a-zA-Z]+[_a-zA-Z0-9-]*`. Example: `(asdf) >h1 .xyz`

- `#`: Adds an ID to the top output stack element. The ID must match the regex `[A-Za-z][-_A-Za-z0-9]*`. Example: `(asdf) >h1 #xyz`

- `@`: Adds an attribute to the top output stack element using the popped top string stack element. The attribute name must match the regex `[A-Za-z][-_A-Za-z0-9]*`. Example: `(asdf) >h1 (color:red)@style`

Functions are anything matched by the regex `[^ \n()""@#.]+`.

###Standard library
You may need to whitespace-separate for parser clarity.

- `~`: SWAP. Append `e` to the command to perform on the output stack.
- `:`: DUP. Append `e` to the command to perform on the output stack.
- `!`: DROP. Append `e` to the command to perform on the output stack.
- `S`: Push the top string stack element to the output stack in text form.
- `Se`: Push the HTML string form of the top output stack element to the string stack.
- `*`: Concatenate. Append `e` to perform on the output stack.
- `a`: Wrap parentheses around the top string stack element.
- `^`: Evaluate the top string stack element.