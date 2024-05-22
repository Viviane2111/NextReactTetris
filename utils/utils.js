
//* Fonction pour générer une nouvelle pièce aléatoire
export function generateRandomPiece() {
  const pieces = [
    {
      shape: [[1]],
      color: "#e000e0",
    },
    {
      shape: [[1, 1, 1, 1]],
      color: "#ff7f00",
    },
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "#00ffff",
    },
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ],
      color: "#00ff00",
    },
    {
      shape: [
        [1, 0],
        [1, 0],
        [1, 1],
      ],
      color: "#ff0000",
    },
    {
      shape: [
        [0, 1],
        [0, 1],
        [1, 1],
      ],
      color: "#ffff00",
    },
  ];
  const randomIndex = Math.floor(Math.random() * pieces.length);
  return pieces[randomIndex];
}





