import React, { useState, useEffect } from "react";
import { generateRandomPiece } from "../utils/utils";
import {
  createEmptyBoard,
  checkCollision,
  placePieceOnBoard,
  clearFullRows,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "../utils/boardUtils";

const GameBoard = () => {
  //* État du jeu: le plateau de jeu, la pièce courante, la position de la pièce et le score
  // État pour stocker la grille du jeu
  const [board, setBoard] = useState(createEmptyBoard());
  // État pour stocker la pièce actuelle
  const [piece, setPiece] = useState(generateRandomPiece());
  // État pour stocker la position de la pièce actuelle
  const [position, setPosition] = useState({ x: 4, y: 0 });
  // État pour stocker le score
  const [score, setScore] = useState(0);
  // État pour le niveau
  const [level, setLevel] = useState(1);
  // État pour le nombre de lignes effacées
  const [linesCleared, setLinesCleared] = useState(0);
  // État pour l'intervalle (vitesse de descente)
  const [intervalId, setIntervalId] = useState(null);

  //
  //  //* Utilise useEffect pour déplacer la pièce vers le bas à chaque intervalle de temps (1000)
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       movePieceDown();
  //     }, 1000);
  //     return () => clearInterval(interval);
  //   }, [position]);
  useEffect(() => {
    // Démarrer l'intervalle pour déplacer automatiquement la pièce vers le bas
    const intervalId = setInterval(() => {
      movePieceDown();
    }, 1000 / level); // Réduire l'intervalle avec le niveau

    // Nettoyer l'intervalle lorsque le composant est démonté ou lorsqu'une nouvelle pièce est créée
    return () => clearInterval(intervalId);
  }, [position, level]); // Déclencher l'effet à chaque changement de position ou de niveau]);

  //
  //* Utilise useEffect pour écouter les événements de touche pour déplacer la pièce
  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          movePiece(-1, 0); // Déplace la pièce à gauche
          break;
        case "ArrowRight":
          movePiece(1, 0); // Déplace la pièce à droite
          break;
        case "ArrowDown":
          movePieceDown(); // Déplace la pièce vers le bas
          break;
        case "ArrowUp":
          rotatePiece(); // Tourne la pièce
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [position, piece]);

  //
  //* Fonction pour déplacer la pièce vers le bas
  const movePieceDown = () => {
    if (!checkCollision(board, piece, { x: position.x, y: position.y + 1 })) {
      setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
    } else {
      placePiece();
    }
  };

  //
  //* Fonction pour déplacer la pièce horizontalement
  const movePiece = (dx, dy) => {
    if (
      !checkCollision(board, piece, { x: position.x + dx, y: position.y + dy })
    ) {
      setPosition((prev) => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    }
  };

  //
  //* Fonction pour tourner la pièce
  const rotatePiece = () => {
    const rotatedPiece = piece.shape[0].map((_, index) =>
      piece.shape.map((row) => row[index]).reverse()
    );
    if (
      !checkCollision(
        board,
        { shape: rotatedPiece, color: piece.color },
        position
      )
    ) {
      setPiece((prev) => ({ ...prev, shape: rotatedPiece }));
    }
  };

  //
  //* Fonction pour placer la pièce sur le plateau de jeu
  const placePiece = () => {
    const newBoard = placePieceOnBoard(board, piece, position);
    const { clearedBoard, linesCleared } = clearFullRows(newBoard);
    setBoard(clearedBoard);
    updateScore(linesCleared);
    resetPiece();
  };

  //
  //* Fonction pour réinitialiser la pièce après placement
  const resetPiece = () => {
    const newPiece = generateRandomPiece();
    setPiece(newPiece);
    setPosition({ x: 4, y: 0 });

    if (checkCollision(board, newPiece, { x: 4, y: 0 })) {
      alert("Game Over");
      setBoard(createEmptyBoard());
      setScore(0);
      setLevel(1);
      setLinesCleared(0);
    }
  };

  //
  //* Fonction pour mettre à jour le score sans prise en compte d'un niveau
  ////  const updateScore = (linesCleared) => {
  ////    let points = 0;
  ////    if (linesCleared === 1) {
  ////      points = 10;
  ////    } else if (linesCleared === 2) {
  ////      points = 30;
  ////    } else if (linesCleared === 3) {
  ////      points = 60;
  ////    } else if (linesCleared === 4) {
  ////      points = 100;
  ////    }
  ////    setScore((prev) => prev + points);
  ////  };

  //* Fonction pour mettre à jour le score en prenant en compte le niveau
  const updateScore = (lines) => {
    // Vérifie si des lignes ont été effacées
    if (lines > 0) {
      // Calcule les points en fonction du nombre de lignes effacées, du niveau actuel et d'un coefficient fixe
      const newScore = score + lines * 10 * level;

      // Met à jour le score avec les nouveaux points calculés
      setScore(newScore);

      // Met à jour le nombre total de lignes effacées en ajoutant le nombre de lignes effacées récemment
      const newLinesCleared = linesCleared + lines;
      setLinesCleared(newLinesCleared);

      // Vérifie si le joueur est prêt à passer au niveau suivant
      if (newLinesCleared >= level * 10) {
        // Si le nombre total de lignes effacées atteint ou dépasse un multiple de 10 fois le niveau actuel,
        // incrémente le niveau
        setLevel(level + 1);
      }
    }
  };

  //
  //* Fonction pour générer la grille de jeu avec la pièce actuelle
  const renderBoard = () => {
    const displayBoard = placePieceOnBoard(board, piece, position);
    return displayBoard;
  };

  //
  // Rendu de la grille de jeu
  return (
    <div className="array p-1">
      <div className="flex justify-between mb-3">
        <div className="text-white mt-2 pl-2 text-sm">Score: {score}</div>
        <div className="text-white mt-2 pr-2 text-sm">Level: {level}</div>
      </div>
      {renderBoard().map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              // dimension des cellules : 5=20px  (5x4)
              className={`w-4 h-4 border ${
                cell.value ? "border-gray-800 rounded-sm" : "border-gray-300"
              }`}
              style={{
                backgroundColor: cell.value ? cell.color : "#d1d5db",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
