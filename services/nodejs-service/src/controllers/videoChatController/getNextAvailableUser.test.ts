import request from 'supertest';
import { createMockQueryRunner, mockRepositoryMethods, mockEventData, mockRoomData, mockSessionData } from '../../utils/tests/testHelper';
// @ts-ignore
import app, { AppDataSource } from '../..';

jest.mock('../..', () => ({
    AppDataSource: {
        createQueryRunner: jest.fn(),
    },
}));

describe('getNextAvailableUser API', () => {
    let queryRunner: any;
    let sessionRepo: any;
    let roomRepo: any;
    let eventRepo: any;

    beforeAll(() => {
        queryRunner = createMockQueryRunner();
        (AppDataSource.createQueryRunner as jest.Mock).mockReturnValue(queryRunner);

        // Repositories are mocked for each test
        sessionRepo = queryRunner.manager.getRepository('VideoChatSessions');
        roomRepo = queryRunner.manager.getRepository('Rooms');
        eventRepo = queryRunner.manager.getRepository('DatifyyEvents');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if event is not found', async () => {
        // Mock the behavior of the event repository
        mockRepositoryMethods(eventRepo, null); // No event found

        const response = await request(app)
            .get('/api/chat/next-available-user/1/user@example.com')
            .expect(404);

        expect(response.body.message).toBe("Event not found.");
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should return 404 if user room is not found', async () => {
        mockRepositoryMethods(eventRepo, mockEventData); // Event found
        mockRepositoryMethods(roomRepo, null); // No room found

        const response = await request(app)
            .get('/api/chat/next-available-user/1/user@example.com')
            .expect(404);

        expect(response.body.message).toBe("Room not found for user and event.");
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should return existing busy session if user is already in a chat', async () => {
        mockRepositoryMethods(eventRepo, mockEventData); // Event found
        mockRepositoryMethods(roomRepo, mockRoomData); // Room found
        mockRepositoryMethods(sessionRepo, mockSessionData); // Busy session found

        const response = await request(app)
            .get('/api/chat/next-available-user/1/user@example.com')
            .expect(200);

        expect(response.body.message).toBe("User is already in a chat session.");
        expect(response.body.nextUser).toBeDefined();
        expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should return 404 if no available users found', async () => {
        mockRepositoryMethods(eventRepo, mockEventData);
        mockRepositoryMethods(roomRepo, mockRoomData);
        mockRepositoryMethods(sessionRepo, null); // No available session

        const response = await request(app)
            .get('/api/chat/next-available-user/1/user@example.com')
            .expect(404);

        expect(response.body.message).toBe("No available users found for chat.");
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should return 500 on internal error and rollback transaction', async () => {
        queryRunner.manager.getRepository.mockImplementation(() => {
            throw new Error("Database error");
        });

        const response = await request(app)
            .get('/api/chat/next-available-user/1/user@example.com')
            .expect(500);

        expect(response.body.message).toBe("Internal server error");
        expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should successfully find and return next available user', async () => {
        mockRepositoryMethods(eventRepo, mockEventData); // Event found
        mockRepositoryMethods(roomRepo, mockRoomData); // Room found
        mockRepositoryMethods(sessionRepo, { ...mockSessionData, status: 'available' }); // Available session found

        const response = await request(app)
            .get('/api/chat/next-available-user/1/user@example.com')
            .expect(200);

        expect(response.body.message).toBe("Next available user found for chat.");
        expect(response.body.nextUser).toBeDefined();
        expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });
});
