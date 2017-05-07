## find

[source](../benchmarks/find.js)

| Test          |   Ops/Sec |
| :------------ | --------: |
| lodash get    | 9,916,354 |
| lodash-fp get | 1,858,462 |
| Immutable get | 2,530,441 |
| qim find      | 8,858,319 |


qim find / lodash get = 89% (PASS)


## set

[source](../benchmarks/set.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| lodash fp set       |  79,293 |
| Immutable set       | 616,366 |
| immutability-helper |  78,941 |
| qim set             | 261,553 |


qim set / lodash fp set = 330% (PASS)


## simple-select

[source](../benchmarks/simple-select.js)

| Test           |   Ops/Sec |
| :------------- | --------: |
| native         | 2,144,935 |
| lodash/fp flow |    17,896 |
| qim select     |   992,198 |


qim select / native = 46% (PASS)


## simple-update

[source](../benchmarks/simple-update.js)

| Test       | Ops/Sec |
| :--------- | ------: |
| native     | 267,339 |
| lodash/fp  |  16,785 |
| qim update | 155,783 |


qim update / native = 58% (PASS)


## slice

[source](../benchmarks/slice.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| simple splice       | 857,694 |
| immutability-helper | 360,391 |
| qim slice           | 429,481 |


qim slice / simple splice = 50% (PASS)


## update-multi-key

[source](../benchmarks/update-multi-key.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  61,471 |
| qim update    |  51,499 |


qim update / Object.assign = 84% (PASS)


## update

[source](../benchmarks/update.js)

| Test             | Ops/Sec |
| :--------------- | ------: |
| lodash mapValues | 102,841 |
| Immutable        | 261,614 |
| qim update       | 261,061 |


qim update / lodash mapValues = 254% (PASS)

