## find-path

[source](../benchmarks/find-path.js)

| Test          |    Ops/Sec |
| :------------ | ---------: |
| lodash get    | 10,635,648 |
| lodash-fp get |  1,920,208 |
| Ramda get     | 10,220,345 |
| Immutable get |  2,713,050 |
| qim find      |  9,063,141 |


qim find / lodash get = 85% (PASS)


## find-pick

[source](../benchmarks/find-pick.js)

| Test        | Ops/Sec |
| :---------- | ------: |
| lodash pick | 379,147 |
| qim pick    | 929,199 |


qim pick / lodash pick = 245% (PASS)


## select-simple

[source](../benchmarks/select-simple.js)

| Test           |   Ops/Sec |
| :------------- | --------: |
| native         | 2,223,356 |
| lodash/fp flow |    17,110 |
| Ramda pipe     |   278,705 |
| qim select     |   953,949 |


qim select / native = 43% (PASS)


## set-path

[source](../benchmarks/set-path.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| lodash fp set       |  81,457 |
| Ramda set           | 748,396 |
| Immutable set       | 658,206 |
| immutability-helper |  78,104 |
| qim set             | 347,226 |


qim set / Ramda set = 46% (PASS)


## update-complex

[source](../benchmarks/update-complex.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| lodash update |  33,155 |
| Ramda update  | 199,690 |
| Immutable     | 266,949 |
| qim update    | 323,461 |


qim update / Ramda update = 162% (PASS)


## update-merge

[source](../benchmarks/update-merge.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  64,302 |
| qim merge     |  59,074 |


qim merge / Object.assign = 92% (PASS)


## update-multi-key

[source](../benchmarks/update-multi-key.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  64,012 |
| qim update    |  53,363 |


qim update / Object.assign = 83% (PASS)


## update-simple

[source](../benchmarks/update-simple.js)

| Test             | Ops/Sec |
| :--------------- | ------: |
| native           | 300,219 |
| lodash/fp update |  16,663 |
| Ramda update     | 117,961 |
| qim update       | 176,196 |


qim update / native = 59% (PASS)


## update-slice

[source](../benchmarks/update-slice.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| simple splice       | 409,182 |
| immutability-helper | 241,286 |
| qim slice           | 266,573 |


qim slice / simple splice = 65% (PASS)

