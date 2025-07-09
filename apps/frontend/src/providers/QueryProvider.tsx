import React from 'react';
import {
    QueryClient,
    QueryClientProvider,
    QueryCache,
    MutationCache,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useToast } from '@chakra-ui/react';
import { Logger } from '../utils/Logger';

/**
 * Enterprise React Query Configuration
 * 
 * Features:
 * - Global error handling
 * - Request deduplication
 * - Background refetching
 * - Offline support
 * - Performance optimization
 * - Development tools integration
 */

interface QueryProviderProps {
    children: React.ReactNode;
}

const logger = new Logger('QueryProvider');

// Create QueryClient factory with enterprise configuration
const createQueryClient = (toast?: any) => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Stale time - how long data is considered fresh
                staleTime: 5 * 60 * 1000, // 5 minutes

                // Cache time - how long inactive data stays in cache
                gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

                // Retry configuration
                retry: (failureCount, error: any) => {
                    // Don't retry on 4xx errors (client errors)
                    if (error?.status >= 400 && error?.status < 500) {
                        return false;
                    }
                    // Retry up to 3 times for server errors
                    return failureCount < 3;
                },

                // Retry delay with exponential backoff
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

                // Background refetch configuration
                refetchOnWindowFocus: false, // Disable aggressive refetching
                refetchOnReconnect: true,
                refetchOnMount: true,

                // Network mode
                networkMode: 'online',
            },
            mutations: {
                // Retry mutations once on failure
                retry: 1,

                // Network mode for mutations
                networkMode: 'online',
            },
        },

        // Global query cache for handling query errors
        queryCache: new QueryCache({
            onError: (error: any, query) => {
                logger.error('Query failed', {
                    queryKey: query.queryKey,
                    error: error.message,
                    status: error?.status
                });

                // Only show toast for background errors
                if (query.state.data !== undefined && toast) {
                    toast({
                        title: 'Data refresh failed',
                        description: 'Unable to fetch latest data. Using cached version.',
                        status: 'warning',
                        duration: 4000,
                        isClosable: true,
                        position: 'top-right'
                    });
                }
            },

            onSuccess: (data, query) => {
                logger.debug('Query succeeded', {
                    queryKey: query.queryKey,
                    dataType: typeof data
                });
            }
        }),

        // Global mutation cache for handling mutation errors
        mutationCache: new MutationCache({
            onError: (error: any, variables, context, mutation) => {
                logger.error('Mutation failed', {
                    mutationKey: mutation.options.mutationKey,
                    error: error.message,
                    status: error?.status,
                    variables: typeof variables === 'object' ? Object.keys(variables || {}) : variables
                });

                // Show toast for mutation errors if toast is available
                if (toast) {
                    const isNetworkError = !error?.status || error?.status >= 500;

                    toast({
                        title: 'Operation failed',
                        description: isNetworkError
                            ? 'Network error. Please check your connection and try again.'
                            : error?.message || 'Something went wrong. Please try again.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'top-right'
                    });
                }
            },

            onSuccess: (data, variables, context, mutation) => {
                logger.info('Mutation succeeded', {
                    mutationKey: mutation.options.mutationKey,
                    dataType: typeof data
                });
            }
        })
    });
};

// Hook to access QueryClient with toast integration
const useQueryClientWithToast = () => {
    const toast = useToast();
    return React.useMemo(() => createQueryClient(toast), [toast]);
};

// Query Provider Component
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
    const queryClient = useQueryClientWithToast();

    // Initialize logging
    React.useEffect(() => {
        logger.info('QueryClient initialized', {
            environment: process.env.NODE_ENV,
            defaultStaleTime: queryClient.getDefaultOptions().queries?.staleTime,
            defaultGcTime: queryClient.getDefaultOptions().queries?.gcTime
        });
    }, [queryClient]);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Development tools - only in development */}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                // position="bottom-right"
                // toggleButtonProps={{
                //     style: {
                //         marginLeft: '5px',
                //         transform: `scale(.7)`,
                //         transformOrigin: 'bottom right',
                //     }
                // }}
                />
            )}
        </QueryClientProvider>
    );
};

// HOC for wrapping components that need QueryClient
export const withQueryClient = <P extends object>(
    Component: React.ComponentType<P>
): React.FC<P> => {
    const WrappedComponent: React.FC<P> = (props) => {
        return (
            <QueryProvider>
                <Component {...props} />
            </QueryProvider>
        );
    };

    WrappedComponent.displayName = `withQueryClient(${Component.displayName || Component.name})`;
    return WrappedComponent;
};

// Hook for accessing QueryClient in components
export const useQueryClientInstance = () => {
    const queryClient = React.useContext(QueryClientProvider as any);

    if (!queryClient) {
        throw new Error(
            'useQueryClientInstance must be used within a QueryProvider. ' +
            'Make sure your app is wrapped with QueryProvider.'
        );
    }

    return queryClient;
};