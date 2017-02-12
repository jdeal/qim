import createNavigator, {navigatorRef} from '../createNavigator';

const __$set = createNavigator({
  transform: (nav) => {
    return nav[2];
  }
});

const $set = (value) => {
  return [navigatorRef, __$set, value];
};

export default $set;
