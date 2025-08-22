import WebSocket from 'ws';
import { selectedRoom } from '../dto/room-me-res';
import { roomRepository } from '../repositories/room-repository';

// roomId를 키로, 해당 방에 연결된 WebSocket 클라이언트 집합을 값으로 가집니다.
const roomConnections = new Map<string, Set<WebSocket>>();

// 새 클라이언트 연결을 처리합니다.
const handleConnection = async (ws: WebSocket, roomId: string) => {
    if (!roomConnections.has(roomId)) {
        roomConnections.set(roomId, new Set());
    }
    const connections = roomConnections.get(roomId)!;
    connections.add(ws);

    console.log(`Client connected to room ${roomId}. Total clients: ${connections.size}`);

    try {
        const roomData = await roomRepository.findRoomById(roomId);
        if (roomData) {
            ws.send(JSON.stringify(roomData));
            console.log(`Sent initial state of room ${roomId} to new client.`);
        } else {
            console.log(`Room ${roomId} not found for initial state.`);
            ws.close(1011, `Room ${roomId} not found.`);
        }
    } catch (error) {
        console.error(`Failed to send initial state for room ${roomId}:`, error);
        ws.close(1011, "Internal server error on initial state fetch.");
    }


    ws.on('close', () => {
        connections.delete(ws);
        console.log(`Client disconnected from room ${roomId}. Total clients: ${connections.size}`);
        if (connections.size === 0) {
            roomConnections.delete(roomId);
        }
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error in room ${roomId}:`, error);
        connections.delete(ws);
    });
};

// 특정 방의 모든 클라이언트에게 데이터를 브로드캐스트합니다.
const broadcastRoomUpdate = (roomId: string, roomData: selectedRoom) => {
    const connections = roomConnections.get(roomId);
    if (connections) {
        const message = JSON.stringify(roomData);
        connections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
        console.log(`Broadcasted update to room ${roomId} for ${connections.size} clients.`);
    }
};

export const webSocketService = {
    handleConnection,
    broadcastRoomUpdate,
};
