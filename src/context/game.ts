import { ActiveBoardTypes, BoardType, MinMax } from "@context/types"
import { atom } from "jotai"

// BOARD
export const cellSizeAtom = atom(0)
export const landscapeAtom = atom(false)

// SETTINGS
export const activeBoardTypesAtom = atom<ActiveBoardTypes>({
  [BoardType.NORMAL]: true,
  [BoardType.ONE_WALL]: true,
  [BoardType.TWO_WALLS]: true,
})

export const difficultyAtom = atom<MinMax>({ min: 10, max: 12 })

export const movingPieceAtom = atom(false)
