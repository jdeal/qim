import Benchmark from 'benchmark';
import requireDir from 'require-dir';
import fp from 'lodash/fp';

const benchmarks = requireDir('./benchmarks');

Object.keys(benchmarks).forEach((key) => {
  if (benchmarks[key].default) {
    benchmarks[key] = benchmarks[key].default;
  }
});

const testBenchmark = (name, tests) => {
  return new Promise((resolve, reject) => {
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
    suite.on('complete', function() {
      const benchesByKey = this.reduce((result, bench) => {
        result[testsByName[bench.name].key] = bench;
        return result;
      }, {});
      console.log(this.map(bench => {
        return bench.name + '\n' + Number(Math.round(bench.hz)).toLocaleString();
      }).join('\n\n'));
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
                  ratio,
                  isPass: ratio > test.compare[otherKey]
                };
              });
          }
          return [];
        }));
      if (comparisons.length > 0) {
        const isPass = !comparisons.some(comparison => !comparison.isPass);
        console.log('\n' + (isPass ? 'PASS' : 'FAIL'));
        if (!isPass) {
          reject(new Error(`Benchmark ${name} failed.`));
        }
      } else {
        resolve();
      }
    }).run({async: true});
  });
};

Promise.all(
  Object.keys(benchmarks).map(key => testBenchmark(key, benchmarks[key]))
)
  .then(() => {
    console.log('\nAll benchmark tests passed.');
  })
  .catch((err) => {
    console.error(err);
  });
