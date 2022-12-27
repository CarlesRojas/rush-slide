import Piece from "@components/Piece"
import Wall from "@components/Wall"
import { activeBoardTypesAtom, difficultyAtom, movesAtom, movingPieceAtom } from "@context/game"
import { BoardState } from "@context/types"
import { getBoardStateFromLevel } from "@utils/boardTransformations"
import { getLevel } from "@utils/getLevel"
import { useAtom } from "jotai"
import { useCallback, useEffect, useRef, useState } from "react"
import Cell from "./Cell"

const Board = () => {
  const [difficulty] = useAtom(difficultyAtom)
  const [activeBoardTypes] = useAtom(activeBoardTypesAtom)
  const [, setMovingPiece] = useAtom(movingPieceAtom)
  const [, setMoves] = useAtom(movesAtom)

  const history = useRef<BoardState[]>([])
  const [currentLevel, setCurrentLevel] = useState<string | null>(null)

  const updateBoard = useCallback(
    (boardState: BoardState) => {
      history.current.push(boardState)
      setCurrentLevel(boardState.board)
      setMoves((prev) => ({ ...prev, moves: history.current.length - 1 }))
    },
    [setMoves],
  )

  const initLevel = useCallback(async () => {
    const { level, minimumMoves } = await getLevel(activeBoardTypes, difficulty)
    history.current = []
    setMoves((prev) => ({ ...prev, minimumMoves }))
    updateBoard(getBoardStateFromLevel(level))
  }, [activeBoardTypes, difficulty, setMoves, updateBoard])

  useEffect(() => {
    initLevel()
  }, [initLevel, setMoves])

  useEffect(() => {
    setMovingPiece(false)
  }, [currentLevel, setMovingPiece])

  const currentBoard = history.current[history.current.length - 1]

  return (
    <div className="relative h-full w-full touch-none">
      {currentBoard && currentBoard.walls.map((wall, i) => <Wall key={i} wall={wall} />)}

      {currentBoard &&
        currentBoard.pieces.map((piece) => (
          <Piece key={piece.id} piece={piece} boardState={currentBoard} updateBoard={updateBoard} />
        ))}

      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 6 }, (_, column) => <Cell key={`${row}-${column}`} position={{ row, column }} />),
      )}
    </div>
  )
}

export default Board
