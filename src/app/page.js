"use client";
import React, { useState, useEffect } from 'react';
import Board from './Component/Board';

const TIME_LIMIT = 60; 

export default function Home() {
    const createInitialBoard = () => {
        let board = [];
        for (let i = 0; i < 4; i++) {
          board.push(Array(4).fill(null));
        }
      
        // Call addNewTile twice
        board = addNewTile(board);
        board = addNewTile(board);
      
        return board;
    };

    const addNewTile = (board) => {
        // Find all empty tiles

        const emptyCells = [];
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === null) {
                    emptyCells.push({ row, col });
                }
            }
        }
        //If there is an empty tile:
        if (emptyCells.length > 0) {
            // Random pick a empty tile
            const randomIndex = Math.floor(Math.random() * emptyCells.length);

            // Get the corresponding column and row
            const { row, col } = emptyCells[randomIndex];

            //Set the value of picked tile with 2
            board[row][col] = 2;
        }

        return board;
    };

    const moveUp = () => {
        const newBoard = [...board];
        const originalBoard = JSON.stringify(newBoard); 
        let newScore = score;

        for (let col = 0; col < 4; col++) {
            let newCol = newBoard
                .map((row) => row[col])
                .filter((val) => val !== null); // Extract and consolidate non-null values in the column
            for (let row = 0; row < newCol.length - 1; row++) {
                if (newCol[row] === newCol[row + 1]) {
                    // Merge identical tiles
                    newCol[row] *= 2;
                    newScore += newCol[row];
                    newCol.splice(row + 1, 1);
                }
            }
            while (newCol.length < 4) {
                newCol.push(null); // Add nulls to fill the column
            }
            for (let row = 0; row < 4; row++) {
                newBoard[row][col] = newCol[row]; // Update the board with the new column values
            }
        }

        const newBoardString = JSON.stringify(newBoard);
        if (originalBoard === newBoardString) {
            return;
        }
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard);
        setScore(newScore);
    };
    
    const moveDown = () => {
        const newBoard = [...board];
        const originalBoard = JSON.stringify(newBoard);
        let newScore = score; 

        for (let col = 0; col < 4; col++) {
            let newCol = newBoard
                .map((row) => row[col])
                .filter((val) => val !== null);
            for (let row = newCol.length - 1; row > 0; row--) {
                if (newCol[row] === newCol[row - 1]) {
                    newCol[row] *= 2;
                    newScore += newCol[row];
                    newCol.splice(row - 1, 1);
                    row--;
                }
            }
            while (newCol.length < 4) {
                newCol.unshift(null); // Add nulls at the start to push tiles down
            }
            for (let row = 0; row < 4; row++) {
                newBoard[row][col] = newCol[row];
            }
        }
        const newBoardString = JSON.stringify(newBoard);
        if (originalBoard === newBoardString) {
            return;
        }
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard);
        setScore(newScore);
    }

    const moveLeft = () => {
        const newBoard = [...board];
        const originalBoard = JSON.stringify(newBoard); 
        let newScore = score;
    
        for (let row = 0; row < 4; row++) {
          let newRow = newBoard[row].filter((val) => val !== null);
          for (let col = 0; col < newRow.length - 1; col++) {
            if (newRow[col] === newRow[col + 1]) {
              newRow[col] *= 2;
              newScore += newRow[col];
              newRow.splice(col + 1, 1);
              col++;
            }
          }
          while (newRow.length < 4) {
            newRow.push(null);
          }
          newBoard[row] = newRow;
        }
        const newBoardString = JSON.stringify(newBoard);
        if (originalBoard === newBoardString) {
            return;
        }
    
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard);
        setScore(newScore);
    };

    const moveRight = () => {
        const newBoard = [...board];
        const originalBoard = JSON.stringify(newBoard); 
        let newScore = score;
    
        for (let row = 0; row < 4; row++) {
            let newRow = newBoard[row].filter((val) => val !== null); 
            for (let col = newRow.length - 1; col > 0; col--) {
                if (newRow[col] === newRow[col - 1]) {
                    newRow[col] *= 2;
                    newScore += newRow[col];
                    newRow.splice(col - 1, 1); // Remove merged tile
                    col--; // Adjust index after merge
                }
            }
            while (newRow.length < 4) {
                newRow.unshift(null);
            }
            newBoard[row] = newRow;
        }
    
        const newBoardString = JSON.stringify(newBoard);
        if (originalBoard === newBoardString) {
            return;
        }
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard);
        setScore(newScore);
    };

    const [board, setBoard] = useState(createInitialBoard());
    const [score, setScore] = useState(0); 
    const [gameOver, setGameOver] = useState(false);
    const [topScores, setTopScores] = useState(() => {
        const storedTopScores = localStorage.getItem('topScores');
        return storedTopScores ? JSON.parse(storedTopScores) : [];
    });
    const [nameInput, setNameInput] = useState('');
    const [showInput, setShowInput] = useState(false);

    const [isTimeAttack, setIsTimeAttack] = useState(false); 
    const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

    const handleKeyDown = (event) => {
        if (event.key === "ArrowUp") {
            moveUp();
        } else if (event.key === "ArrowDown") {
            moveDown();
        } else if (event.key === "ArrowLeft") {
            moveLeft();
        } else if (event.key === "ArrowRight") {
            moveRight();
        }
    };

    const checkGameOver = () => {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col] === null) {
                    // There is an empty tile, so the game is not over
                    return false;
                }
                if (
                    (col < board[row].length - 1 && board[row][col] === board[row][col + 1]) ||
                    (row < board.length - 1 && board[row][col] === board[row + 1][col])
                ) {
                    // There are adjacent tiles with the same value, so the game is not over
                    return false;
                }
            }
        }
        // No more empty tiles and no adjacent tiles with the same value, so the game is over
        return true;
    };

    const retry = () => {
        setBoard(createInitialBoard());
        setScore(0);
        setGameOver(false);
        setShowInput(false);
        if(isTimeAttack){
            setTimeLeft(TIME_LIMIT);
        }
    };

    const handleNameChange = (event) => {
        setNameInput(event.target.value);
    };
    
    const submitScore = () => {
        if (nameInput.trim() !== '') {
          const newTopScores = [...topScores];
          newTopScores.push({ name: nameInput, score });
          newTopScores.sort((a, b) => b.score - a.score);
          newTopScores.splice(10); // Keep only the top 10 scores
          setTopScores(newTopScores);
          localStorage.setItem('topScores', JSON.stringify(newTopScores));
          setNameInput("");
          setShowInput(false);
        }
    };

    const handleTimeAttackClick = () => {
        if (!isTimeAttack) {
            setIsTimeAttack(true);
            retry();
        }
    };
    
    const handleNormalModeClick = () => {
        if (isTimeAttack) {
            setIsTimeAttack(false);
            retry();
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        if (checkGameOver()) {
            setGameOver(true); // Set gameOver state to true
            if (score > (topScores.length > 10 ? topScores[topScores.length - 1].score : 0)) {
                setShowInput(true);
            }
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [board]);

    useEffect(() => {
        let timer;
        if (!gameOver && isTimeAttack && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setGameOver(true);
        }

        return () => clearInterval(timer);
    }, [isTimeAttack, timeLeft, gameOver]);

    return (
      <main className="game-container">
        <header className="header">
            <h1 className="title">2048</h1>
            <div className="score-container">
                <div className="score-box">SCORE</div>
                <div className="score-value">{score}</div>
            </div>
            {isTimeAttack && (
                <div className="timer-container">
                    <div className="timer-box">TIME LEFT</div>
                    <div className="timer-value">{timeLeft}</div>
                </div>
            )}
        </header>
        <div className="game-board-container">
            <Board board={board}/>
            <div className="scoreboard-container">
                <h2 className="scoreboard-title">Leaderboard</h2>
                <ul className="scoreboard">
                    {topScores.map((score, index) => (
                    <li key={index}>
                        <div className="scoreboard-item">
                            <span className="scoreboard-name">{score.name}</span>
                            <span className="scoreboard-score">{score.score}</span>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        {!isTimeAttack && (
            <button className="time-attack-button" onClick={handleTimeAttackClick}>
                Time Attack Mode
            </button>
        )}
        {isTimeAttack && (
            <button className="normal-mode-button" onClick={handleNormalModeClick}>
                Normal Mode
            </button>
        )}
        {showInput && (
            <div className="name-input-container">
                <input
                    type="text"
                    className="name-input"
                    placeholder="Enter your name"
                    value={nameInput}
                    onChange={handleNameChange}
                />
                <button className="submit-button" onClick={submitScore}>
                    Submit
                </button>
            </div>
        )}
        {gameOver && (
            <button className="retry-button" onClick={retry}>
            Retry
            </button>
        )}
      </main>
    );
}