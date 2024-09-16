import { useEffect } from "react";
import { useApp } from "../AppContext";
import { IPlayerDetail } from "./useGameBoard";

const useRandomMatchmaking = () => {
  const { playerOneDetails, playerTwoDetails, ws, setWs, setPlayerTwoDetails } =
    useApp();

  // Establish the WebSocket connection to the server
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    // Save the connection in the state
    setWs(socket);

    // Handle WebSocket events
    socket.onopen = () => {
      console.log("Connected to WebSocket server");

      // Send an initial message to the server (joining the game)
      socket.send(JSON.stringify({ type: "join", player: playerOneDetails }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message from server:", data);
      switch (data.type) {
        case "start":
          console.log("Game started with players:", data.players);
          // const roomId = message.roomId;
          setPlayerTwoDetails(data.players as IPlayerDetail);
          break;

        default:
          break;
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup the connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);
  return {
    ws,
    playerOneDetails,
    playerTwoDetails,
  };
};

export default useRandomMatchmaking;
