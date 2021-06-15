/**
 * Takes in tables state
 * sorted by table_name
 * @param {Array} tables 
 * @returns {Sorted Array}
 */

 export function sortTables(tables = []) {
    if (!tables.length) return [];
  
    return tables.sort(compare);
  }
  
  export function compare(tableOne, tableTwo) {
    const nameOne = tableOne.table_name;
    const nameTwo = tableTwo.table_name;
  
    if (nameOne > nameTwo) return 1;
    else if (nameOne < nameTwo) return -1;
    else return 0;
  }
  