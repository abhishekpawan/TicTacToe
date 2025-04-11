export const ClientToServerEvents = {
  'find-match': () => {},
  'cancel-matchmaking': () => {},
  'make-move': () => {},
  'play-again': () => {}
};

export const ServerToClientEvents = {
  'match-found': () => {},
  'waiting-for-opponent': () => {},
  'game-update': () => {},
  'game-over': () => {},
  'game-reset': () => {},
  'opponent-disconnected': () => {}
}; 