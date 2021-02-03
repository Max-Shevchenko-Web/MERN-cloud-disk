export function sortArrayOfObjectsUp(arrayToSort, key) {
  function compareObjects(a, b) {
      if (a[key] < b[key])
          return -1;
      if (a[key] > b[key])
          return 1;
      return 0;
  }

  return arrayToSort.sort(compareObjects);
}

export function sortArrayOfObjectsDown(arrayToSort, key) {
  function compareObjects(a, b) {
      if (a[key] < b[key])
          return 1;
      if (a[key] > b[key])
          return -1;
      return 0;
  }

  return arrayToSort.sort(compareObjects);
}