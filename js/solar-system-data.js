let AU = 149597870.691;
let AU_2_KM = 149597870.7;
let EARTH_ECCENTRICITY = 0.01671123;

export const SCALE_FACTOR = 100000;
export const EARTH_ORBITAL_RADIUS = AU / SCALE_FACTOR;
export const EARTH_SEMI_MAJOR_AXIS = 1.00000261;
export const SUN_FOCUS = EARTH_ECCENTRICITY / EARTH_SEMI_MAJOR_AXIS / 2 * AU_2_KM / SCALE_FACTOR;
export const EARTH_TILT = 0.41;
export const SUMMER_SOLSTICE = 171; // 171 day of year

export function earthEllipseLocationByDay(day) {
  let index = (SUMMER_SOLSTICE - day) / 365;
  let z = (1 / EARTH_SEMI_MAJOR_AXIS) * Math.sin(index * 2 * Math.PI);
  let x = EARTH_SEMI_MAJOR_AXIS * Math.cos(index * 2 * Math.PI);

  x = x * EARTH_ORBITAL_RADIUS + SUN_FOCUS * 2;
  z = z * EARTH_ORBITAL_RADIUS;

  return new THREE.Vector3(x, 0, z);
}
