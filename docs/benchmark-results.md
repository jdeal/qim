## find

[source](../benchmarks/find.js)

| Test          |    Ops/Sec |
| :------------ | ---------: |
| lodash get    | 10,315,965 |
| lodash-fp get |  1,893,324 |
| Immutable get |  2,747,905 |
| qim find      |  8,716,580 |


qim find / lodash get = 84% (PASS)


## set

[source](../benchmarks/set.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| lodash fp set       |  82,235 |
| Immutable set       | 607,501 |
| immutability-helper |  78,437 |
| qim set             | 272,614 |


qim set / lodash fp set = 332% (PASS)


## slice

[source](../benchmarks/slice.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| simple splice       | 823,640 |
| immutability-helper | 363,862 |
| qim slice           | 515,991 |


qim slice / simple splice = 63% (PASS)


## update-multi-key

[source](../benchmarks/update-multi-key.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  59,394 |
| qim update    |  51,536 |


qim update / Object.assign = 87% (PASS)


## update

[source](../benchmarks/update.js)

| Test             | Ops/Sec |
| :--------------- | ------: |
| lodash mapValues |  90,977 |
| Immutable        | 244,423 |
| qim update       | 275,839 |


qim update / lodash mapValues = 303% (PASS)

