## find-path

[source](../benchmarks/find-path.js)

| Test          |    Ops/Sec |
| :------------ | ---------: |
| lodash get    | 10,936,692 |
| lodash-fp get |  1,930,210 |
| Immutable get |  2,605,698 |
| qim find      |  8,807,825 |


qim find / lodash get = 81% (PASS)


## find-pick

[source](../benchmarks/find-pick.js)

| Test        | Ops/Sec |
| :---------- | ------: |
| lodash pick | 375,148 |
| qim pick    | 577,767 |


qim pick / lodash pick = 154% (PASS)


## select-simple

[source](../benchmarks/select-simple.js)

| Test           |   Ops/Sec |
| :------------- | --------: |
| native         | 1,936,038 |
| lodash/fp flow |    18,330 |
| qim select     | 1,002,532 |


qim select / native = 52% (PASS)


## set-path

[source](../benchmarks/set-path.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| lodash fp set       |  83,886 |
| Immutable set       | 674,474 |
| immutability-helper |  81,262 |
| qim set             | 349,941 |


qim set / lodash fp set = 417% (PASS)


## update-complex

[source](../benchmarks/update-complex.js)

| Test             | Ops/Sec |
| :--------------- | ------: |
| lodash mapValues | 104,141 |
| Immutable        | 260,257 |
| qim update       | 324,246 |


qim update / lodash mapValues = 311% (PASS)


## update-merge

[source](../benchmarks/update-merge.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  64,111 |
| qim merge     |  56,966 |


qim merge / Object.assign = 89% (PASS)


## update-multi-key

[source](../benchmarks/update-multi-key.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  63,270 |
| qim update    |  57,722 |


qim update / Object.assign = 91% (PASS)


## update-simple

[source](../benchmarks/update-simple.js)

| Test       | Ops/Sec |
| :--------- | ------: |
| native     | 277,703 |
| lodash/fp  |  17,626 |
| qim update | 191,618 |


qim update / native = 69% (PASS)


## update-slice

[source](../benchmarks/update-slice.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| simple splice       | 410,357 |
| immutability-helper | 251,053 |
| qim slice           | 276,249 |


qim slice / simple splice = 67% (PASS)

