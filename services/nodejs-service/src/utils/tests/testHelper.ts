import { Repository, SelectQueryBuilder } from 'typeorm';
import { createMockInstance } from 'jest-create-mock-instance';

// Mocking a QueryRunner and its associated repositories
export const createMockQueryRunner = () => {
    const mockQueryRunner: any = {
        manager: {
            getRepository: jest.fn(),
        },
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
    };
    return mockQueryRunner;
};

// Mock repository methods
export const mockRepositoryMethods = (mockRepo: any, returnValue: any) => {
    mockRepo.findOne = jest.fn().mockResolvedValue(returnValue);
    mockRepo.createQueryBuilder = jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        setLock: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(returnValue),
        getMany: jest.fn().mockResolvedValue(returnValue),
    });
};

// Mock data setup for VideoChatSessions, Rooms, DatifyyEvents
export const mockEventData = { id: 1, name: "Speed Dating Event", isActive: true };
export const mockRoomData = { userEmail: 'user@example.com', gender: 'male', event: mockEventData };
export const mockSessionData = { session_id: 1, status: 'available', man_email: 'man@example.com', woman_email: 'woman@example.com' };
