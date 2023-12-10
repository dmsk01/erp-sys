function insertQueryConstructor<T extends object>(
  tableName: string,
  object: T
) {
  const objKeys = Object.keys(object);
  const propsFields = `(${objKeys.join(',')})`;
  const questionMarks = objKeys.reduce((prev, _, index, array) => {
    const querySymbol = index === array.length - 1 ? '?' : '?, ';
    const res = prev + querySymbol;
    return res;
  }, '');
  return `INSERT INTO ${tableName} ${propsFields} VALUES(${questionMarks})`;
}

function updateQueryConstructor<T extends object>(
  tableName: string,
  object: T
) {
  const objKeys = Object.keys(object);
  const questionMarks = objKeys.reduce((prev, cur, index, array) => {
    const querySymbol = index === array.length - 1 ? '=? ' : '=?, ';
    const curEl = cur + querySymbol;
    const res = prev + curEl;
    return res;
  }, '');
  return `UPDATE ${tableName} SET ${questionMarks} WHERE id=?`;
}

function selectQueryConstructor(tableName: string) {
  return `SELECT * FROM ${tableName}`;
}

// const test = { a: '1', b: '2' };
// console.log(updateQueryConstructor('producers', test));

export {
  insertQueryConstructor,
  updateQueryConstructor,
  selectQueryConstructor,
};
