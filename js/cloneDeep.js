const isObject = obj => {
  return obj && obj.constructor && obj.constructor === Object;
};
const isArray = obj => {
  return Array.isArray(obj);
};

const cloneDeep = obj => {
  let newObj;
  if (isObject(obj)) {
    newObj = {};
    for (let key in obj) {
      if (isObject(obj[key]) || isArray(obj[key])) {
        newObj[key] = cloneDeep(obj[key]);
        continue;
      }
      newObj[key] = obj[key];
    }
  }
  if (isArray(obj)) {
    newObj = obj.map(el => {
      if (isObject(el) || isArray(el)) {
        return cloneDeep(el);
      }
      return el;
    });
  }
  return newObj;
};

export default cloneDeep;
