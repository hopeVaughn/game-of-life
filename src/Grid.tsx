import React, { useEffect, useState } from 'react';

const Grid = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<Set<string>>(new Set());
  const [delayCount, setDelayCount] = useState(0);
  const maxDelay = 10; // Number of generations to delay stopping after detecting oscillation

  useEffect(() => {
    const updateGridSize = () => {
      const gridElement = document.querySelector('.grid') as HTMLElement | null;
      if (!gridElement) return;

      const columnCount = getComputedStyle(gridElement).gridTemplateColumns.split(' ').length;
      const squareSize = gridElement.offsetWidth / columnCount;
      const rowCount = Math.ceil(window.innerHeight / squareSize);

      const newGrid = Array(rowCount)
        .fill(null)
        .map(() => Array(columnCount).fill(0));
      setGrid(newGrid);
      setHistory(new Set());
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);

    return () => {
      window.removeEventListener('resize', updateGridSize);
    };
  }, []);

  const toggleCell = (row: number, col: number) => {
    const newGrid = grid.map((rowArray, rowIndex) =>
      rowIndex === row ? rowArray.map((cell, colIndex) => (colIndex === col ? 1 - cell : cell)) : rowArray
    );
    setGrid(newGrid);
  };

  const getNextGeneration = (grid: number[][]) => {
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    const nextGrid = grid.map((rowArray, row) =>
      rowArray.map((cell, col) => {
        const liveNeighbors = directions.reduce((acc, [dx, dy]) => {
          const newRow = row + dx;
          const newCol = col + dy;
          return acc + (grid[newRow]?.[newCol] || 0);
        }, 0);

        if (cell === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) return 0;
        if (cell === 0 && liveNeighbors === 3) return 1;
        return cell;
      })
    );

    return nextGrid;
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const nextGrid = getNextGeneration(prevGrid);
        const gridString = JSON.stringify(nextGrid);
        const hasAliveCells = nextGrid.some(row => row.some(cell => cell === 1));

        if (!hasAliveCells) {
          setIsRunning(false);
        } else if (history.has(gridString)) {
          if (delayCount < maxDelay) {
            setDelayCount(delayCount + 1);
          } else {
            setIsRunning(false);
          }
        } else {
          setHistory(new Set(history).add(gridString));
          setDelayCount(0); // Reset delay count when a new pattern is found
        }

        return nextGrid;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, history, delayCount]);

  return (
    <div>
      <button className="p-2 bg-blue-500 text-white" onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <div className="grid grid-cols-12 sm:grid-cols-12 md:grid-cols-24 ipad-pro:grid-cols-36 lg:grid-cols-96 gap-px h-screen overflow-hidden">
        {grid.map((rowArray, rowIndex) =>
          rowArray.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} className="relative w-full h-full" onClick={() => toggleCell(rowIndex, colIndex)}>
              <div className={`absolute inset-0 border border-black ${cell === 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
