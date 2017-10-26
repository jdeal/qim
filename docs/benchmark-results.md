## find-path

[source](../benchmarks/find-path.js)

| Test          |    Ops/Sec |
| :------------ | ---------: |
| lodash get    | 10,347,741 |
| lodash-fp get |  1,939,200 |
| Ramda get     | 13,458,314 |
| Immutable get |  2,745,445 |
| qim find      |  8,835,702 |


qim find / lodash get = 85% (PASS)


## find-pick

[source](../benchmarks/find-pick.js)

| Test        |   Ops/Sec |
| :---------- | --------: |
| lodash pick |   387,525 |
| qim pick    | 1,375,042 |


qim pick / lodash pick = 355% (PASS)


## select-simple

[source](../benchmarks/select-simple.js)

| Test           |   Ops/Sec |
| :------------- | --------: |
| native         |   712,485 |
| lodash/fp flow |    22,555 |
| Ramda pipe     |   324,089 |
| qim select     | 1,231,390 |


qim select / native = 173% (PASS)


## set-path

[source](../benchmarks/set-path.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| lodash fp set       | 102,421 |
| Ramda set           | 817,530 |
| Immutable set       | 620,542 |
| immutability-helper | 104,906 |
| qim set             | 374,732 |


qim set / Ramda set = 46% (PASS)


## update-complex

[source](../benchmarks/update-complex.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| lodash update |  37,360 |
| Ramda update  | 219,119 |
| Immutable     | 258,945 |
| qim update    | 322,402 |


qim update / Ramda update = 147% (PASS)


## update-merge

[source](../benchmarks/update-merge.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  67,012 |
| qim merge     |  56,533 |


qim merge / Object.assign = 84% (PASS)


## update-multi-key

[source](../benchmarks/update-multi-key.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  68,458 |
| qim update    |  51,138 |


qim update / Object.assign = 75% (PASS)


## update-simple

[source](../benchmarks/update-simple.js)

| Test             | Ops/Sec |
| :--------------- | ------: |
| native           | 306,212 |
| lodash/fp update |  20,319 |
| Ramda update     | 145,954 |
| qim update       | 229,154 |


qim update / native = 75% (PASS)


## update-slice

[source](../benchmarks/update-slice.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| simple splice       | 413,092 |
| immutability-helper | 268,111 |
| qim slice           | 519,861 |


qim slice / simple splice = 126% (PASS)

