import baseSet from '../methods/set';
import toDataLast from '../toDataLast';
import {curry3} from '../curry';

export default curry3(toDataLast(baseSet));
