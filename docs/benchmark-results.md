## find-path

[source](../benchmarks/find-path.js)

| Test          |    Ops/Sec |
| :------------ | ---------: |
| lodash get    | 10,457,657 |
| lodash-fp get |  1,895,465 |
| Immutable get |  2,664,894 |
| qim find      |  9,000,857 |


qim find / lodash get = 86% (PASS)


## find-pick

[source](../benchmarks/find-pick.js)

| Test        | Ops/Sec |
| :---------- | ------: |
| lodash pick | 351,760 |
| qim pick    | 571,450 |


qim pick / lodash pick = 162% (PASS)


## select-simple

[source](../benchmarks/select-simple.js)

| Test           |   Ops/Sec |
| :------------- | --------: |
| native         | 2,167,712 |
| lodash/fp flow |    18,638 |
| qim select     |   967,212 |


qim select / native = 45% (PASS)


## set-path

[source](../benchmarks/set-path.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| lodash fp set       |  85,313 |
| Immutable set       | 636,441 |
| immutability-helper |  83,612 |
| qim set             | 345,905 |


qim set / lodash fp set = 405% (PASS)


## update-complex

[source](../benchmarks/update-complex.js)

| Test             | Ops/Sec |
| :--------------- | ------: |
| lodash mapValues |  99,166 |
| Immutable        | 256,854 |
| qim update       | 328,568 |


qim update / lodash mapValues = 331% (PASS)


## update-merge

[source](../benchmarks/update-merge.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  63,421 |
| qim merge     |  56,426 |


qim merge / Object.assign = 89% (PASS)


## update-multi-key

[source](../benchmarks/update-multi-key.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  63,077 |
| qim update    |  51,259 |


qim update / Object.assign = 81% (PASS)


## update-simple

[source](../benchmarks/update-simple.js)

| Test       | Ops/Sec |
| :--------- | ------: |
| native     | 286,249 |
| lodash/fp  |  18,029 |
| qim update | 187,475 |


qim update / native = 65% (PASS)


## update-slice

[source](../benchmarks/update-slice.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| simple splice       | 408,382 |
| immutability-helper | 252,643 |
| qim slice           | 261,210 |


qim slice / simple splice = 64% (PASS)

