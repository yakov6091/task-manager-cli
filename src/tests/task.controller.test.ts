import { Request, Response } from 'express';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/task.controller.sqlite';
import db from '../sqliteDB/sqlite';

// Mock sqlite database connection
jest.mock('../sqliteDB/sqlite', () => ({
    prepare: jest.fn(),
}));
jest.mock('uuid', () => ({
    v4: () => 'mocked-uuid-123',
}));

describe('Task Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        jest.clearAllMocks();

        // Safe default mock returns for db.prepare
        (db.prepare as jest.Mock).mockReturnValue({
            all: jest.fn().mockReturnValue([]),
            get: jest.fn().mockReturnValue(undefined),
            run: jest.fn().mockReturnValue({ changes: 1 }),
        });

        mockRequest = {
            user: { id: 'user-uuid-123', username: 'testuser' },
        } as any;

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('getTasks', () => {
        test('should return all tasks for the logged-in user', async () => {
            const mockTasks = [
                { id: 'task-1', title: 'Task 1', isComplete: false, user_id: 'user-uuid-123' },
                { id: 'task-2', title: 'Task 2', isComplete: true, user_id: 'user-uuid-123' },
            ];

            const mockStmt = { all: jest.fn().mockReturnValue(mockTasks) };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);

            await getTasks(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
        });
    });

    describe('createTask', () => {
        test('should return 400 if title is missing', async () => {
            mockRequest.body = {}; // missing title

            await createTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: expect.any(String) })
            );
        });

        test('should return 201 and create task when title is provided', async () => {
            mockRequest.body = { title: 'New Test Task' };

            const mockStmt = { run: jest.fn().mockReturnValue({ changes: 1 }) };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);

            await createTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'New Test Task',
                })
            );
        });
    });

    describe('updateTask', () => {
        test('should return 404 if task does not exist or user is unauthorized', async () => {
            mockRequest.params = { id: 'non-existent-id' };
            mockRequest.body = { title: 'Updated Title', completed: 1 };

            // Simulate 0 rows updated by SQLite
            const mockStmt = { run: jest.fn().mockReturnValue({ changes: 0 }) };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);

            await updateTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: expect.any(String) })
            );
        });

        test('should return 200 on successful update', async () => {
            mockRequest.params = { id: 'task-1' };
            mockRequest.body = { title: 'Updated Title', completed: 1 };

            // Simulate 1 row updated by SQLite
            const mockStmt = { run: jest.fn().mockReturnValue({ changes: 1 }) };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);

            await updateTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteTask', () => {
        test('should return 404 if task does not exist or user is unauthorized', async () => {
            mockRequest.params = { id: 'non-existent-id' };

            // Simulate 0 rows changed by SQLite
            const mockStmt = { run: jest.fn().mockReturnValue({ changes: 0 }) };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);

            await deleteTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: expect.any(String) })
            );
        });

        test('should return 200 or 204 on successful deletion', async () => {
            mockRequest.params = { id: 'task-1' };

            const mockStmt = { run: jest.fn().mockReturnValue({ changes: 1 }) };
            (db.prepare as jest.Mock).mockReturnValue(mockStmt);

            await deleteTask(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Task deleted',
            });
        });
    });
});