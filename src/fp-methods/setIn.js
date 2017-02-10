import baseSetIn from '../methods/setIn';
import toDataLast from '../toDataLast';
import {curry3} from '../curry';

export default curry3(toDataLast(baseSetIn));
