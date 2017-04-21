const createNavigatorCall = (navigator, params) => ({'@@qim/nav': navigator, ...params});

export default createNavigatorCall;
