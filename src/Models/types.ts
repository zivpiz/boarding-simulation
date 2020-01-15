export type Plane = {
  rows: number;
  columns: number;
  spaceBetweenRows: number;
  aisle: Array<AisleBlock | EmptyAisleBlock>;
};

export enum SeatingMode {
  RANDOM = "random",
  AISLE_TO_WINDOW = "aisle_to_window",
  WINDOW_TO_AISLE = "window_to_isle",
  FRONT_TO_BACK = "front_to_back",
  BACK_TO_FRONT = "back_to_front"
}

export type AisleBlock = {
  hasRows: boolean;
  rightRow: Array<Seat>;
  leftRow: Array<Seat>;
  occupied: Person;
  assignedSeats: number;
  fullyAssigned: boolean;
  id: number;
};

export type EmptyAisleBlock = {
  hasRows: boolean;
  occupied: Person;
};

export const isAisleBlock = (x: any): x is AisleBlock => {
  return x.hasRows === true;
};

export const isEmptyAisleBlock = (x: any): x is EmptyAisleBlock => {
  return x.hasRows === false;
};

export enum SeatStatus {
  FREE = "free",
  ASSIGNED = "assigned",
  TAKEN = "taken"
}

export type Seat = {
  status: SeatStatus;
  row: number;
  column: number;
};

export enum TicketAssignmetMode {
  RANDOM = "random"
}

export type Position = {
  row: number;
  column: number;
};

export type Person = {
  isSeated: boolean;
  xSpeed: number;
  ySpeed: number;
  luggageDelay: number;
  ticket: {
    row: number;
    seatInRow: number;
  };
};

export enum Speed {
  X = "Row_Speed",
  Y = "Aisle_Speed",
  LUGGADE = "Luggage_Delay"
}

export enum Person_Mode {
  FORWARD = "FORWARD",
  BACKWARD = "BACKWARD"
}
