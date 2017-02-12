import createNavigator, {navigatorRef} from '../createNavigator';

const __$update = createNavigator({
  transform: (nav, object) => {
    return nav[2](object);
  }
});

const $update = (modify) => {
  return [navigatorRef, __$update, modify];
};

export default $update;
