import React, { useEffect, useState } from "react";
import "./App.css";
const App = () => {
	const [board, setBoard] = useState<any>(null);
	const [score, setScore] = useState<any>(0);
	const [gameOver, setGameOver] = useState<any>(false);
	const [message, setMessage] = useState<any>(null);

	useEffect(() => {
		initBoard();
		const handleKeyDown = (e: any) => {
			console.log("sss");
			console.log(e.keyCode);
			const up = 38,
				right = 39,
				down = 40,
				left = 37,
				n = 78;
			switch (e.keyCode) {
				case up:
					move("up");
					break;
				case right:
					move("right");
					break;
				case down:
					move("down");
					break;
				case left:
					move("left");
					break;
				case n:
					initBoard();
					break;
				default:
					break;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	const initBoard = () => {
		let newBoard = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
		newBoard = placeRandom(placeRandom(newBoard));
		setBoard(newBoard);
		setScore(0);
		setGameOver(false);
		setMessage(null);
	};

	const getBlankCoordinates = (board: any) => {
		const blankCoordinates = [];
		for (let r = 0; r < board.length; r++) {
			for (let c = 0; c < board[r].length; c++) {
				if (board[r][c] === 0) {
					blankCoordinates.push([r, c]);
				}
			}
		}
		return blankCoordinates;
	};

	const randomStartingNumber = () => {
		const startingNumbers = [2, 4];
		return startingNumbers[Math.floor(Math.random() * startingNumbers.length)];
	};

	const placeRandom = (board: any) => {
		const blankCoordinates = getBlankCoordinates(board);
		const randomCoordinate =
			blankCoordinates[Math.floor(Math.random() * blankCoordinates.length)];
		const randomNumber = randomStartingNumber();
		const newBoard = [...board];
		newBoard[randomCoordinate[0]][randomCoordinate[1]] = randomNumber;
		return newBoard;
	};

	const boardMoved = (original: any, updated: any) => {
		return JSON.stringify(updated) !== JSON.stringify(original);
	};

	// Остальные функции move, rotate и checkForGameOver
	const checkForGameOver = (a: any) => {};
	const move = (direction) => {
		if (!gameOver) {
			if (direction === "up") {
				const movedUp = moveUp(board);
				if (boardMoved(board, movedUp.board)) {
					const upWithRandom = placeRandom(movedUp.board);
					if (checkForGameOver(upWithRandom)) {
						setBoard(upWithRandom);
						setGameOver(true);
						setMessage("Game over!");
					} else {
						setBoard(upWithRandom);
						setScore(score + movedUp.score);
					}
				}
			} else if (direction === "right") {
				const movedRight = moveRight(board);
				if (boardMoved(board, movedRight.board)) {
					const rightWithRandom = placeRandom(movedRight.board);
					if (checkForGameOver(rightWithRandom)) {
						setBoard(rightWithRandom);
						setGameOver(true);
						setMessage("Game over!");
					} else {
						setBoard(rightWithRandom);
						setScore(score + movedRight.score);
					}
				}
			} else if (direction === "down") {
				const movedDown = moveDown(board);
				if (boardMoved(board, movedDown.board)) {
					const downWithRandom = placeRandom(movedDown.board);
					if (checkForGameOver(downWithRandom)) {
						setBoard(downWithRandom);
						setGameOver(true);
						setMessage("Game over!");
					} else {
						setBoard(downWithRandom);
						setScore(score + movedDown.score);
					}
				}
			} else if (direction === "left") {
				const movedLeft = moveLeft(board);
				if (boardMoved(board, movedLeft.board)) {
					const leftWithRandom = placeRandom(movedLeft.board);
					if (checkForGameOver(leftWithRandom)) {
						setBoard(leftWithRandom);
						setGameOver(true);
						setMessage("Game over!");
					} else {
						setBoard(leftWithRandom);
						setScore(score + movedLeft.score);
					}
				}
			}
		} else {
			setMessage("Game over. Please start a new game.");
		}
	};
	const moveUp = (inputBoard: any) => {
		let rotatedRight = rotateRight(inputBoard);
		let newBoard = [];
		let newScore = 0;

		// Shift all numbers to the right
		for (let r = 0; r < rotatedRight.length; r++) {
			let row = [];
			for (let c = 0; c < rotatedRight[r].length; c++) {
				let current = rotatedRight[r][c];
				current === 0 ? row.unshift(current) : row.push(current);
			}
			newBoard.push(row);
		}

		// Combine numbers and shift to right
		for (let r = 0; r < newBoard.length; r++) {
			for (let c = newBoard[r].length - 1; c >= 0; c--) {
				if (newBoard[r][c] > 0 && newBoard[r][c] === newBoard[r][c - 1]) {
					newBoard[r][c] = newBoard[r][c] * 2;
					newBoard[r][c - 1] = 0;
					newScore += newBoard[r][c];
				} else if (newBoard[r][c] === 0 && newBoard[r][c - 1] > 0) {
					newBoard[r][c] = newBoard[r][c - 1];
					newBoard[r][c - 1] = 0;
				}
			}
		}

		// Rotate board back upright
		newBoard = rotateLeft(newBoard);

		return { board: newBoard, score: newScore };
	};
	return (
		<div>
			<div className="button" onClick={initBoard}>
				New Game
			</div>
			<div className="buttons">
				<div className="button" onClick={() => move("up")}>
					Up
				</div>
				{/* Остальные кнопки для right, down и left */}
			</div>
			<div className="score">Score: {score}</div>
			<table>{board && board.map((row, i) => <Row key={i} row={row} />)}</table>
			<p>{message}</p>
		</div>
	);
};

const Row = ({ row }: any) => {
	return (
		<tr>
			{row.map((cell, i) => (
				<Cell key={i} cellValue={cell} />
			))}
		</tr>
	);
};

const Cell = ({ cellValue }: any) => {
	let color = "cell";
	let value = cellValue === 0 ? "" : cellValue;
	if (value) {
		color += ` color-${value}`;
	}

	return (
		<td>
			<div className={color}>
				<div className="number">{value}</div>
			</div>
		</td>
	);
};

export default App;
