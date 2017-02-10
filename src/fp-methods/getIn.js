import baseGetIn from '../methods/getIn';
import toDataLast from '../toDataLast';
import {curry2} from '../curry';

export default curry2(toDataLast(baseGetIn, 2));
