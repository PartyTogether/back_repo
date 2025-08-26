import WebSocket from 'ws';
import { selectedRoom } from '../dto/room-me-res';
import { roomRepository } from '../repositories/room-repository';

// 표준 웹소켓 메시지 인터페이스
interface WebSocketMessage {
    type: 'roomUpdate' | 'chat' | 'applicant' | 'error' | 'system';
    payload: unknown;
}

// roomId를 키로, 해당 방에 연결된 WebSocket 클라이언트 집합을 값으로 가집니다.
const roomConnections = new Map<string, Set<WebSocket>>();

// 특정 방의 모든 클라이언트에게 메시지를 브로드캐스트하는 범용 함수
const broadcast = (roomId: string, message: WebSocketMessage) => {
    const connections = roomConnections.get(roomId);
    if (connections) {
        const serializedMessage = JSON.stringify(message);
        connections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(serializedMessage);
            }
        });
        console.log(`[${roomId}] 방에 '${message.type}' 타입의 메시지를 브로드캐스트합니다. (${connections.size}명)`);
    }
};


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
            // 연결된 클라이언트에게 현재 방 정보 전송
            const initialMessage: WebSocketMessage = { type: 'roomUpdate', payload: roomData };
            ws.send(JSON.stringify(initialMessage));
        } else {
            const errorMessage: WebSocketMessage = { type: 'error', payload: `Room ${roomId} not found.` };
            ws.send(JSON.stringify(errorMessage));
            ws.close(1011, `Room ${roomId} not found.`);
        }
    } catch (error) {
        console.error(`해당 방 데이터 조회 중 오류가 발생했습니다. ${roomId}:`, error);
        const errorMessage: WebSocketMessage = { type: 'error', payload: 'Internal server error on initial state fetch.' };
        ws.send(JSON.stringify(errorMessage));
        ws.close(1011, "Internal server error.");
    }

    // 클라이언트로부터 메시지 수신 처리
    ws.on('message', (message: string) => {
        try {
            const parsedMessage: WebSocketMessage = JSON.parse(message);
            
            // 수신된 메시지 타입에 따라 처리
            switch (parsedMessage.type) {
                case 'chat':
                    // 채팅 메시지를 받았을 때, 해당 방의 모든 클라이언트에게 재전송
                    broadcast(roomId, { type: 'chat', payload: parsedMessage.payload });
                    break;
                default:
                    console.log(`[${roomId}] 에서 알 수 없는 타입의 메시지 수신: ${parsedMessage.type}`);
            }
        } catch (error) {
            console.error(`[${roomId}] 메시지 처리 중 오류 발생:`, error);
        }
    });

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

// 특정 방의 상태 업데이트를 브로드캐스트 (기존 함수 -> 새로운 broadcast 함수 사용)
const broadcastRoomUpdate = (roomId: string, roomData: selectedRoom) => {
    broadcast(roomId, { type: 'roomUpdate', payload: roomData });
};

export const webSocketService = {
    handleConnection,
    broadcastRoomUpdate,
    broadcast, // 범용 broadcast 함수도 export하여 다른 서비스에서 직접 사용 가능
};
