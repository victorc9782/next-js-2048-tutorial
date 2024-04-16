"use client";
import React, { useState, useEffect } from 'react';
import Board from './Component/Board';

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

        for (let col = 0; col < 4; col++) {
            let newCol = newBoard
                .map((row) => row[col])
                .filter((val) => val !== null); // Extract and consolidate non-null values in the column
            for (let row = 0; row < newCol.length - 1; row++) {
                if (newCol[row] === newCol[row + 1]) {
                    // Merge identical tiles
                    newCol[row] *= 2;
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
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard);
    };
    
    const moveDown = () => {
        const newBoard = [...board];

        for (let col = 0; col < 4; col++) {
            let newCol = newBoard
                .map((row) => row[col])
                .filter((val) => val !== null);
            for (let row = newCol.length - 1; row > 0; row--) {
                if (newCol[row] === newCol[row - 1]) {
                    newCol[row] *= 2;
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
        
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard);
    }

    const moveLeft = () => {
        const newBoard = [...board];
    
        for (let row = 0; row < 4; row++) {
          let newRow = newBoard[row].filter((val) => val !== null);
          for (let col = 0; col < newRow.length - 1; col++) {
            if (newRow[col] === newRow[col + 1]) {
              newRow[col] *= 2;
              newRow.splice(col + 1, 1);
              col++;
            }
          }
          while (newRow.length < 4) {
            newRow.push(null);
          }
          newBoard[row] = newRow;
        }
    
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard);
    };

    const moveRight = () => {
        const newBoard = [...board];
    
        for (let row = 0; row < 4; row++) {
            let newRow = newBoard[row].filter((val) => val !== null); 
            for (let col = newRow.length - 1; col > 0; col--) {
                if (newRow[col] === newRow[col - 1]) {
                    newRow[col] *= 2;
                    newRow.splice(col - 1, 1); // Remove merged tile
                    col--; // Adjust index after merge
                }
            }
            while (newRow.length < 4) {
                newRow.unshift(null);
            }
            newBoard[row] = newRow;
        }
    
        const updatedBoard = addNewTile(newBoard);
        setBoard(updatedBoard);
    };

    const [board, setBoard] = useState(createInitialBoard());

    return (
      <main className="game-container">
        <header className="header">
            <h1 className="title">2048</h1>
            <div className="score-container">
                <div className="score-box">SCORE</div>
                <div className="score-value">0</div>
            </div>
        </header>
        <Board board={board}/>
        <button onClick={moveUp}>Move Up</button>
        <button onClick={moveDown}>Move Down</button>
        <button onClick={moveLeft}>Move Left</button>
        <button onClick={moveRight}>Move Right</button>
      </main>
    );
}