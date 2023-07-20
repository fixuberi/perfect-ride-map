export const parseValue = (value: any): { heartRate: number } => {
  // Chrome 50+ uses DataView.
  value = value.buffer ? value : new DataView(value);
  let flags = value.getUint8(0);

  // Define the format
  let rate16Bits = flags & 0x1;
  let result = {} as any;
  let index = 1;

  // Reading by Type
  if (rate16Bits) {
    result.heartRate = value.getUint16(index, /*littleEndian=*/ true);
    index += 2;
  } else {
    result.heartRate = value.getUint8(index);
    index += 1;
  }

  // RR intervals
  let rrIntervalPresent = flags & 0x10;
  if (rrIntervalPresent) {
    let rrIntervals = [];
    for (; index + 1 < value.byteLength; index += 2) {
      rrIntervals.push(value.getUint16(index, /*littleEndian=*/ true));
    }
    result.rrIntervals = rrIntervals;
  }

  return result;
};
