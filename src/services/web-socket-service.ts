import WebSocket from 'ws';
import { selectedRoom } from '../dto/room-me-res';
import { roomRepository } from '../repositories/room-repository';
import { applicantRepository } from '../repositories/applicant-repository';
import {messageRepository} from "../repositories/message-repository";

// 표준 웹소켓 메시지 인터페이스
interface WebSocketMessage {
    type: 'leaveRoom' | 'newChat' | 'newApplicant' | 'error'  | 'initialData' | 'applicant_accepted' | 'applicant_canceled' | 'room_joined';
    payload: unknown;
}

// roomId를 키로, 해당 방에 연결된 WebSocket
const roomConnections = new Map<string, Set<WebSocket>>();
// memberId를 키로, 해당 유저에 연결된 WebSocket
const memberConnections = new Map<string, WebSocket>();



// 특정 방의 모든 클라이언트에게 메시지를 브로드캐스트하는 함수
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

// 방의 새 웹소켓 연결을 처리하는 함수
const handleConnection = async (ws: WebSocket, roomId: string, memberId: string) => {
    if (!roomConnections.has(roomId)) {
        roomConnections.set(roomId, new Set());
    }
    const connections = roomConnections.get(roomId)!;
    connections.add(ws);

    console.log(`웹소켓 연결 된 방 아이디 : ${roomId}. 현재 구독자 수 : ${connections.size}`);
    console.log(`유저 웹소켓 연결 : ${memberId}. 현재 총 유저 연결 수 : ${memberConnections.size}`);


    try {
        const roomData = await roomRepository.findRoomById(roomId);
        const applicants = await applicantRepository.findApplicantsByRoomId(roomId);
        const chatMessages = await messageRepository.findMessageByRoomId(roomId);
        if (roomData) {
            const initialMessage: WebSocketMessage = { type: 'initialData', payload: {roomData, applicants, chatMessages} };
            ws.send(JSON.stringify(initialMessage));
        } else {
            ws.close(1011, `Room ${roomId} not found.`);
        }
    } catch (error) {
        console.error(`해당 방 데이터 조회 중 오류가 발생했습니다. ${roomId}:`, error);
        ws.close(1011, "Internal server error.");
    }

    ws.on('message', (message: string) => {
        try {
            const parsedMessage: WebSocketMessage = JSON.parse(message);
            if (parsedMessage.type === 'newChat') {
                broadcast(roomId, { type: 'newChat', payload: parsedMessage.payload });
            }
        } catch (error) {
            console.error(`[${roomId}] 메시지 처리 중 오류 발생:`, error);
        }
    });

    ws.on('close', () => {
        connections.delete(ws);
        memberConnections.delete(memberId);
        console.log(`웹 소켓 연결을 끊었습니다. ${roomId}. 현재 구독자 수 : ${connections.size}`);
        console.log(`유저 웹소켓 연결 끊김 : ${memberId}. 현재 총 유저 연결 수 : ${memberConnections.size}`);
        if (connections.size === 0) {
            roomConnections.delete(roomId);
        }
    });

    ws.on('error', (error) => {
        console.error(`방에 에러가 발생했습니다. ${roomId}:`, error);
        connections.delete(ws);
        memberConnections.delete(memberId);
    });
};


// 특정 유저에게 메시지를 보내는 함수
const broadcastToMember = (memberId: string, message: WebSocketMessage) => {
    const client = memberConnections.get(memberId);
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
        console.log(`[${memberId}] 유저에게 '${message.type}' 타입의 메시지를 전송합니다.`);
    } else {
        console.log(`[${memberId}] 유저를 찾을 수 없거나 연결이 끊어져 메시지를 보내지 못했습니다.`);
    }
};

// 유저의 새 웹소켓 연결을 처리하는 함수
const handleMemberConnection = (ws: WebSocket, memberId: string) => {
    memberConnections.set(memberId, ws);
    console.log(`유저 웹소켓 연결 : ${memberId}. 현재 총 유저 연결 수 : ${memberConnections.size}`);

    ws.on('close', () => {
        memberConnections.delete(memberId);
        console.log(`유저 웹소켓 연결 끊김 : ${memberId}. 현재 총 유저 연결 수 : ${memberConnections.size}`);
    });

    ws.on('error', (error) => {
        console.error(`유저 웹소켓 에러 ${memberId}:`, error);
        memberConnections.delete(memberId);
    });
};

export const webSocketService = {
    handleConnection,
    broadcast,
    handleMemberConnection,
    broadcastToMember
};