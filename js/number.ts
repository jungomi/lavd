// Rounds a float to two decimal places
export function roundFloat(x: number, precision: number = 2): number {
  const factor = 10 ** precision;
  return Math.round(x * factor) / factor;
}

function isValidNumber(str: string): boolean {
  return /^-?(\d+|\d+\.\d+|\.\d+)([eE][-+]?\d+)?$/.test(str);
}

export function stringToFloat(str: string): number | undefined {
  if (!isValidNumber(str)) {
    return undefined;
  }
  return Number.parseFloat(str);
}

export function stringToInt(str: string): number | undefined {
  const float = Number.parseFloat(str);
  if (float % 1 === 0) {
    return float;
  } else {
    return undefined;
  }
}
