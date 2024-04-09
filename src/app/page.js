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
      </main>
    );
}