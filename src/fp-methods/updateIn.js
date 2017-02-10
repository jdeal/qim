import baseUpdateIn from '../methods/updateIn';
import toDataLast from '../toDataLast';
import {curry3} from '../curry';

export default curry3(toDataLast(baseUpdateIn));
