# parallel-tests - Run your tests in parallels

This CLI is running all of your tests in parallel with a simple command:

```bash
parallel "mocha test.js" "mocha test2.js" "mocha test3.js"
```

## How to use

Like the above example you just need to run this command to launch your tests:

```bash
parallel <list of tests>
```

If you want to set the number of tests runned in parallel you can use this param:

```bash
parallel -n 4 <list of tests>
```

### Options

Some options can be pass as parameter like:

- number _you can specify how many tests will run in parallel_

You can get more help with:

```bash
parallel --help
```
