import { Person, Plane, Speed } from "./types";

//max speed must be grater then 0 --> can cause error
export function generateRandom(
  axis: Speed,
  maxSpeed = 1,
  maxLuggade = 3
): number {
  switch (axis) {
    case Speed.X:
      return Math.floor(Math.random() * (maxSpeed - 1) + 1);
    case Speed.Y:
      return Math.floor(Math.random() * (maxSpeed - 1) + 1);
    case Speed.LUGGADE:
      return Math.floor(Math.random() * (maxLuggade - 1) + 1);
    default:
      return 1;
  }
}

export function assignRandomly(
  plane: Plane,
  passengers: Array<Person>
): Array<Person> {
  return passengers;
}
