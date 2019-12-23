// Kelly's distinct colours
// Removed some that were too similar.
export const distinctColours = [
  "rgba(255, 179, 0, 1)", // vivid_yellow
  "rgba(128, 62, 117, 1)", // strong_purple
  "rgba(255, 104, 0, 1)", // vivid_orange
  "rgba(166, 189, 215, 1)", // very_light_blue
  "rgba(193, 0, 32, 1)", // vivid_red
  "rgba(206, 162, 98, 1)", // grayish_yellow
  "rgba(129, 112, 102, 1)", // medium_gray
  "rgba(0, 125, 52, 1)", // vivid_green
  "rgba(246, 118, 142, 1)", // strong_purplish_pink
  "rgba(0, 83, 138, 1)", // strong_blue
  // "rgba(255, 122, 92, 1)",  // strong_yellowish_pink
  "rgba(83, 55, 122, 1)", // strong_violet
  // "rgba(255, 142, 0, 1)",  // vivid_orange_yellow
  "rgba(179, 40, 81, 1)", // strong_purplish_red
  "rgba(244, 200, 0, 1)", // vivid_greenish_yellow
  "rgba(127, 24, 13, 1)", // strong_reddish_brown
  "rgba(147, 170, 0, 1)", // vivid_yellowish_green
  "rgba(89, 51, 21, 1)", // deep_yellowish_brown
  "rgba(241, 58, 19, 1)", // vivid_reddish_orange
  "rgba(35, 44, 22, 1)" // dark_olive_green
];

export function assignColours(data: Array<string>): Map<string, string> {
  const colourMap = new Map();
  let i = 0;
  for (const name of data) {
    colourMap.set(name, distinctColours[i % distinctColours.length]);
    i += 1;
  }
  return colourMap;
}
