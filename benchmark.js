/* eslint-disable no-console */
/* eslint-disable no-process-exit */

import Benchmark from 'benchmark';
import requireDir from 'require-dir';
import fs from 'fs';
import fp from 'lodash/fp';
import markdownTable from 'markdown-table';

const benchmarks = requireDir('./benchmarks');

const collectGarbage = global.gc ? () => {
  global.gc();
} : () => {
  console.warn('No gc hook. Benchmarking should be started with --expose-gc flag.');
};

Object.keys(benchmarks).forEach((key) => {
  if (benchmarks[key].default) {
    benchmarks[key] = benchmarks[key].default;
  }
});

const benchmarkName = process.argv.length > 2 ? process.argv[2] : '';

const testBenchmark = (name, tests) => {
  return new Promise((resolve, reject) => {
    const output = [];
    tests = tests.map(test => ({
      ...test,
      key: test.key || test.name
    }));
    const suite = new Benchmark.Suite();
    const testsByName = tests.reduce((result, test) => {
      result[test.name] = test;
      return result;
    }, {});
    const testsByKey = tests.reduce((result, test) => {
      result[test.key] = test;
      return result;
    }, {});
    tests.forEach(test => {
      if (test.compare) {
        Object.keys(test.compare).forEach((testKey) => {
          if (!testsByKey[testKey]) {
            throw new Error(`Test ${testKey} not found for comparison.`);
          }
        });
      }
      suite.add(test.name, test.test);
    });
    suite.on('complete', function () {
      const benchesByKey = this.reduce((result, bench) => {
        result[testsByName[bench.name].key] = bench;
        return result;
      }, {});
      const table = markdownTable([
        ['Test', 'Ops/Sec'],
        ...this.map(bench =>
          [bench.name, Number(Math.round(bench.hz)).toLocaleString()]
        )
      ], {
        align: ['l', 'r']
      });
      output.push(table + '\n');
      const comparisons = fp.flatten(Object.keys(benchesByKey)
        .map(key => {
          const test = testsByKey[key];
          const bench = benchesByKey[key];
          if (test.compare) {
            return Object.keys(test.compare)
              .map(otherKey => {
                const compareBench = benchesByKey[otherKey];
                const ratio = bench.hz / compareBench.hz;
                return {
                  name: test.name,
                  compareName: testsByKey[otherKey].name,
                  ratio,
                  isPass: ratio > test.compare[otherKey]
                };
              });
          }
          return [];
        }));
      if (comparisons.length > 0) {
        output.push('');
        const isPass = !comparisons.some(comparison => !comparison.isPass);
        output.push(comparisons.map(comparison => {
          const percent = Math.round(100 * comparison.ratio);
          const passFail = comparison.isPass ? 'PASS' : 'FAIL';
          return `${comparison.name} / ${comparison.compareName} = ${percent}% (${passFail})`;
        }).join('\n'));
        if (!isPass) {
          console.log(`## ${name}\n\n${output.join('\n')}`);
          return reject({
            isFailure: true,
            name,
            output: output.join('\n')
          });
        }
      }
      output.push('\n');
      console.log(`## ${name}\n\n${output.join('\n')}`);
      return resolve({
        name,
        output: output.join('\n')
      });
    }).run({async: true});
  });
};

const matchingBenchmarks = Object.keys(benchmarks)
  .filter(key => (!benchmarkName && key[0] !== '_') || benchmarkName === key);

// Make sure benchmarks are all valid, meaning that all tests within a benchmark
// return the same result.
matchingBenchmarks.forEach(key => {
  const tests = benchmarks[key];
  if (tests.length > 1) {
    const results = tests.map(test =>
      test.coerce ? test.coerce(test.test()) : test.test()
    );
    const hasAllSameResults = results.every(result => fp.isEqual(result, results[0]));
    if (!hasAllSameResults) {
      console.log(`Benchmark invalid: ${key}`);
      console.log('Results:\n');
      results.forEach((result, i) => {
        console.log(tests[i].name);
        console.log(result);
        console.log('\n');
      });
      process.exit(1);
    }
  }
});

const cleanup = () => new Promise(resolve => {
  // Hopefully make each test more independent.
  collectGarbage();
  // Some voodoo, no idea if this actually helps.
  setTimeout(resolve, 2000);
});

matchingBenchmarks.reduce((promise, key) => {
  collectGarbage();
  return promise
    .then((results) => (
      results.length > 0 ? (
        cleanup().then(() => results)
      ) : results
    ))
    .then((results) =>
      testBenchmark(key, benchmarks[key])
        .then((result) => results.concat(result))
        .catch((result) => results.concat(result))
    );
}, Promise.resolve([]))
  .then((results) => {
    if (results.find(result => result.isFailure)) {
      throw results;
    }
    if (!benchmarkName) {
      fs.writeFileSync('./docs/benchmark-results.md',
        results.map(result =>
          [
            `## ${result.name}`,
            '',
            `[source](../benchmarks/${result.name}.js)`,
            '',
            result.output
          ].join('\n')
        ).join('\n')
      );
    }
    console.log('\nAll benchmark tests passed.');
  })
  .catch((results) => {
    console.log('Test failures:');
    console.log(results
      .filter(result => result.isFailure)
      .map(result => result.name)
      .join('\n')
    );
    process.exit(1);
  });
