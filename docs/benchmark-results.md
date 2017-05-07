## find

[source](../benchmarks/find.js)

| Test          |    Ops/Sec |
| :------------ | ---------: |
| lodash get    | 10,282,231 |
| lodash-fp get |  1,822,446 |
| Immutable get |  2,609,448 |
| qim find      |  9,087,413 |


qim find / lodash get = 88% (PASS)


## set

[source](../benchmarks/set.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| lodash fp set       |  73,735 |
| Immutable set       | 609,195 |
| immutability-helper |  74,551 |
| qim set             | 263,656 |


qim set / lodash fp set = 358% (PASS)


## simple-select

[source](../benchmarks/simple-select.js)

| Test           |   Ops/Sec |
| :------------- | --------: |
| native         | 2,112,496 |
| lodash/fp flow |    18,432 |
| qim select     | 1,019,895 |


qim select / native = 48% (PASS)


## simple-update

[source](../benchmarks/simple-update.js)

| Test       | Ops/Sec |
| :--------- | ------: |
| native     | 283,235 |
| lodash/fp  |  17,120 |
| qim update | 149,858 |


qim update / native = 53% (PASS)


## slice

[source](../benchmarks/slice.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| simple splice       | 850,377 |
| immutability-helper | 353,100 |
| qim slice           | 426,573 |


qim slice / simple splice = 50% (PASS)


## update-multi-key

[source](../benchmarks/update-multi-key.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  59,985 |
| qim update    |  50,266 |


qim update / Object.assign = 84% (PASS)


## update

[source](../benchmarks/update.js)

| Test             | Ops/Sec |
| :--------------- | ------: |
| lodash mapValues |  94,106 |
| Immutable        | 243,636 |
| qim update       | 241,228 |


qim update / lodash mapValues = 256% (PASS)

