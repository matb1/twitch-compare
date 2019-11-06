// Execute row tests (parameterized tests)
export function rit(description: string, ...args: any[]) {
  if (args.length < 2) {
    throw new Error('Incorrect number of arguments.');
  }

  if (typeof(args[args.length - 1]) !== 'function') {
    throw new Error('Last argument should be a function implementing your test.');
  }

  const test = args[args.length - 1];

  for (let i = 0; i < args.length - 1; i++) {
    const params = args[i];

    if (!(params instanceof Array)) {
      throw new Error('Row test parameters should be described as an Array of parameters.');
    }

    if (test.length !== params.length) {
      throw new Error('Mismatch between the number of row test parameters and the row test function signature.');
    }

    it(`${description} #${i + 1} - ${JSON.stringify(params)}`, () => {
      test.apply(null, params);
    });

  }
}

// Execute async row tests (async parameterized tests)
export function arit(description: string, ...args: any[]) {
  if (args.length < 2) {
    throw new Error('Incorrect number of arguments.');
  }

  if (typeof(args[args.length - 1]) !== 'function') {
    throw new Error('Last argument should be a function implementing your test.');
  }

  const test = args[args.length - 1];

  for (let i = 0; i < args.length - 1; i++) {
    const params = args[i];

    if (!(params instanceof Array)) {
      throw new Error('Row test parameters should be described as an Array of parameters.');
    }

    if (test.length !== params.length + 1) {
      throw new Error(
        'Mismatch between the number of row test parameters and the row test function signature.\
         Note that the test signature should include a \'done\' as the last param.'
      );
    }

    it(`${description} #${i + 1} - ${JSON.stringify(params)}`, (done) => {
      params.push(done);
      test.apply(null, params);
    });

  }
}
