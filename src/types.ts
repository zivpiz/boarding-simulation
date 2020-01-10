
export type Plane = {
  aisle: Array<AisleBlock>
}

export type AisleBlock = {
  hasRows: boolean
  rightRow: Array<Seat>
  leftRow: Array<Seat>
}


export type Seat = {
  taken: boolean
}

export type Person = {
  isSeated: boolean
  xSpeed: number
  ySpeed: number
  luggageDelay: number
  ticket: {
    row: number
    seatInRow: number
  }
}