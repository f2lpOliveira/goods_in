const records = [];

export function addRecord(record) {
  records.push(record);
}

export function getRecords() {
  return [...records];
}
