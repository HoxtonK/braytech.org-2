var localStorage = window.localStorage;

export function set(key, value) {
  value = JSON.stringify(value);

  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.log(e);
  }
}

export function del(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
}

export function get(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    console.log(e);
  }
}

// function objectsAreSame(x, y) {
//   var objectsAreSame = true;
//   for (var propertyName in x) {
//      if(x[propertyName] !== y[propertyName]) {
//         objectsAreSame = false;
//         break;
//      }
//   }
//   return objectsAreSame;
// }

export function update(key, value, unique, limit) {
  var json = null;

  try {
    json = localStorage.getItem(key);
  } catch (e) {
    console.log(e);
  }

  if (!json) {
    //console.log([value], value, "setting new");
    set(key, [value]);
  } else {
    let parsed = JSON.parse(json);
    if (unique) {
      var index = parsed.findIndex(obj => obj.membershipId === value.membershipId);
      if (index > -1) {
        parsed.splice(index, 1);
      }

      if (!limit) {
        limit = parsed.length + 1;
      }

      parsed = [value, ...parsed.slice(0, limit)];
    } else {
      if (!limit) {
        limit = parsed.length + 1;
      }

      parsed = [value, ...parsed.slice(0, limit)];
    }
    // console.log(json, parsed, "updating");
    set(key, parsed);
  }
}
