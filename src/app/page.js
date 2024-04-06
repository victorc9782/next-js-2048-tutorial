import Board from './Component/Board';

export default function Home() {
    return (
      <main className="game-container">
        <header className="header">
            <h1 className="title">2048</h1>
            <div className="score-container">
                <div className="score-box">SCORE</div>
                <div className="score-value">0</div>
            </div>
        </header>
        <Board />
      </main>
    );
}