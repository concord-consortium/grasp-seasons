let AU = 149597870.691;
let au2km = 149597870.7;
let earthEccentricity = 0.01671123;

export const scaleFactor = 100000;
export const earthOrbitalRadius = AU / scaleFactor;
export const earthSemiMajorAxis = 1.00000261;
export const sunFocus = earthEccentricity / earthSemiMajorAxis / 2 * au2km / scaleFactor;
export const EARTH_TILT = 0.41;

export const DAY_NUMBER_BY_MONTH = {
  JAN: 19,
  FEB: 50,
  MAR: 78,  // mar 20 17:42
  APR: 109,
  MAY: 139,
  JUN: 171,  // jun 21 17:16
  JUL: 200,
  AUG: 231,
  SEP: 265,  // sep 23 09:04
  OCT: 292,
  NOV: 323,
  DEC: 355   // dec 22 05:30
};

export function earthEllipseLocationByDay(day) {
  var index = (DAY_NUMBER_BY_MONTH.JUN - day) / 365;
  var z = (1 / earthSemiMajorAxis) * Math.sin(index * 2 * Math.PI);
  var x = earthSemiMajorAxis * Math.cos(index * 2 * Math.PI);

  x = x * earthOrbitalRadius + sunFocus * 2;
  z = z * earthOrbitalRadius;

  return {x: x, z: z};
}
