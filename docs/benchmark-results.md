## find

[source](benchmarks/${result.name}.js)

| Test          |   Ops/Sec |
| :------------ | --------: |
| lodash get    | 8,560,728 |
| lodash-fp get | 1,998,573 |
| Immutable get | 2,583,604 |
| qim find      | 9,117,674 |


qim find / lodash get = 107% (PASS)


## set

[source](benchmarks/${result.name}.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| lodash fp set       |  82,881 |
| Immutable set       | 639,480 |
| immutability-helper |  79,893 |
| qim set             | 272,270 |


qim set / lodash fp set = 329% (PASS)


## slice

[source](benchmarks/${result.name}.js)

| Test                | Ops/Sec |
| :------------------ | ------: |
| simple splice       | 832,591 |
| immutability-helper | 322,886 |
| qim slice           | 630,629 |


qim slice / simple splice = 76% (PASS)


## update-multi-key

[source](benchmarks/${result.name}.js)

| Test          | Ops/Sec |
| :------------ | ------: |
| Object.assign |  61,484 |
| qim update    |  53,790 |


qim update / Object.assign = 87% (PASS)


## update

[source](benchmarks/${result.name}.js)

| Test             | Ops/Sec |
| :--------------- | ------: |
| lodash mapValues | 100,894 |
| Immutable        | 255,605 |
| qim update       | 281,052 |


qim update / lodash mapValues = 279% (PASS)

