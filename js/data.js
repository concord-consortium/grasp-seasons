var AU = 149597870.691;
var au2km = 149597870.7;
var earthEccentricity = 0.01671123;

export const scaleFactor = 100000;
export const earthOrbitalRadius = AU / scaleFactor;
export const earthSemiMajorAxis = 1.00000261;
export const sunFocus = earthEccentricity / earthSemiMajorAxis / 2 * au2km / scaleFactor;

export const dayNumberByMonth = {
  jan: 19,
  feb: 50,
  mar: 78,  // mar 20 17:42
  apr: 109,
  may: 139,
  jun: 171,  // jun 21 17:16
  jul: 200,
  aug: 231,
  sep: 265,  // sep 23 09:04
  oct: 292,
  nov: 323,
  dec: 355   // dec 22 05:30
};

export function earthEllipseLocationByDay(day) {
  var index = (dayNumberByMonth.jun - day) / 365;
  var z = (1 / earthSemiMajorAxis) * Math.sin(index * 2 * Math.PI);
  var x = earthSemiMajorAxis * Math.cos(index * 2 * Math.PI);

  x = x * earthOrbitalRadius + sunFocus * 2;
  z = z * earthOrbitalRadius;

  return {x: x, z: z};
}
