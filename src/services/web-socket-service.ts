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

    console.log(`웹소켓 연결 된 방 아이디 : ${roomId}. 현재 구독자 수 : ${connections.size}`);

    try {
        const roomData = await roomRepository.findRoomById(roomId);
        if (roomData) {
            ws.send(JSON.stringify(roomData));
            console.log(`Sent initial state of room ${roomId} to new client.`);
        } else {
            console.log(`${roomId} 해당 룸 데이터를 찾지 못함.`);
            ws.close(1011, `Room ${roomId} not found.`);
        }
    } catch (error) {
        console.error(`해당 방 데이터 조회 중 오류가 발생했습니다. ${roomId}:`, error);
        ws.close(1011, "Internal server error on initial state fetch.");
    }


    ws.on('close', () => {
        connections.delete(ws);
        console.log(`웹 소켓 연결을 끊었습니다. ${roomId}. 현재 구독자 수 : ${connections.size}`);
        if (connections.size === 0) {
            roomConnections.delete(roomId);
        }
    });

    ws.on('error', (error) => {
        console.error(`방에 에러가 발생했습니다. ${roomId}:`, error);
        connections.delete(ws);
    });
};

// 특정 방의 모든 클라이언트에게 데이터 브로드캐스트
const broadcastRoomUpdate = (roomId: string, roomData: selectedRoom) => {
    const connections = roomConnections.get(roomId);
    if (connections) {
        const message = JSON.stringify(roomData);
        connections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
        console.log(`${roomId} 방의 브로드캐스트 업데이트 합니다 ${connections.size}명의 유저에게.`);
    }
};

export const webSocketService = {
    handleConnection,
    broadcastRoomUpdate,
};
