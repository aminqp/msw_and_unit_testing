import {renderHook, act, waitFor} from '@testing-library/react';
import useFetchUsers from '../hooks/useFetchUsers';
import {rest} from 'msw';
import {server} from '../mocks/server';
import {mockUsers} from "../__fixtures__/mock-users";
import {usersURL} from "../constants";


describe('useFetchUsers Hook', () => {
    test('should fetch users successfully', async () => {
        server.use(
            rest.get(usersURL, (_, res, ctx) => {
                return res(
                    ctx.delay(100), // Add a small delay
                    ctx.status(200),
                    ctx.json(mockUsers)
                );
            })
        );

        // Render the hook
        const {result} = renderHook(() => useFetchUsers());

        // Call the fetchUsers function
        act(() => {
            result.current.fetchUsers();
        });

        // Initial state should show loading
        expect(result.current.loading).toBe(true);
        expect(result.current.users).toEqual([]);
        expect(result.current.error).toBe(null);

        // Wait for the API call to resolve
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Check final state
        expect(result.current.users).toEqual(mockUsers);
        expect(result.current.error).toBe(null);
    });

    test('should handle API error', async () => {
        // Override the default handler to return an error
        server.use(
            rest.get(usersURL, (_, res, ctx) => {
                return res(
                    ctx.status(500),
                    ctx.json({message: 'Internal Server Error'})
                );
            })
        );

        // Render the hook
        const {result} = renderHook(() => useFetchUsers());

        // Call the fetchUsers function
        act(() => {
            result.current.fetchUsers();
        });

        // Wait for the API call to resolve
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Check that the error state is updated
        expect(result.current.error).toBe('Failed to fetch users');
        expect(result.current.users).toEqual([]);
    });

    test('should handle network error', async () => {
        // Override the default handler to simulate network failure
        server.use(
            rest.get(usersURL, (_, res) => {
                return res.networkError('Failed to connect');
            })
        );

        // Render the hook
        const {result} = renderHook(() => useFetchUsers());

        // Call the fetchUsers function
        act(() => {
            result.current.fetchUsers();
        });

        // Wait for the API call to resolve
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Check that the error state is updated
        expect(result.current.error).not.toBeNull();
        expect(result.current.users).toEqual([]);
    });

    test('should update loading state correctly', async () => {
        // Add a delay to the mock response to make loading state more visible
        server.use(
            rest.get(usersURL, (_, res, ctx) => {
                return res(
                    ctx.delay(100), // Add a small delay
                    ctx.status(200),
                    ctx.json(mockUsers)
                );
            })
        );

        // Render the hook
        const {result} = renderHook(() => useFetchUsers());

        // Initial state
        expect(result.current.loading).toBe(true); // Default is true in hook
        expect(result.current.users).toEqual([]);
        expect(result.current.error).toBe(null);

        // Call the fetchUsers function
        act(() => {
            result.current.fetchUsers();
        });

        // Should still be loading
        expect(result.current.loading).toBe(true);

        // Wait for loading to finish
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Check final state
        expect(result.current.users).toEqual(mockUsers);
        expect(result.current.error).toBe(null);
    });

    test('should reset error when fetch is successful after a failure', async () => {
        // First set up an error response
        server.use(
            rest.get(usersURL, (_, res, ctx) => {
                return res(ctx.status(500));
            })
        );

        // Render the hook
        const {result} = renderHook(() => useFetchUsers());

        // Call fetchUsers to trigger the error
        act(() => {
            result.current.fetchUsers();
        });

        // Wait for the error
        await waitFor(() => {
            expect(result.current.error).not.toBeNull();
        });

        // Now restore the successful response
        server.use(
            rest.get(usersURL, (_, res, ctx) => {
                return res(ctx.status(200), ctx.json(mockUsers));
            })
        );

        // Call fetchUsers again
        act(() => {
            result.current.fetchUsers();
        });

        // Wait for the successful response
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Check that error is cleared and users are loaded
        expect(result.current.error).toBeNull();
        expect(result.current.users).toEqual(mockUsers);
    });
});
