function sameValues(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    if (a[propName] !== b[propName]) {
      if (typeof(a[propName]) == "object" && typeof(b[propName]) == "object") {
        if (Object.getOwnPropertyNames(a[propName]).length !== Object.getOwnPropertyNames(b[propName]).length) {
          return false;
        }
      }
      else {
        return false;
      }
    }
  }

  return true;
}
