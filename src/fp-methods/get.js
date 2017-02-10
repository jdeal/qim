import baseGet from '../methods/get';
import toDataLast from '../toDataLast';
import {curry2} from '../curry';

export default curry2(toDataLast(baseGet, 2));
