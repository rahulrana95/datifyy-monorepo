/**
 * Base Service Class
 * Handles switching between mock and real API based on feature flags
 */

import { featureFlags } from '../config/featureFlags';
import apiService from '../service/apiService';

export interface ServiceResponse<T> {
  response: T | null;
  error: { message: string } | null;
}

export abstract class BaseService {
  protected useMockData: boolean;
  protected apiBaseUrl: string;

  constructor() {
    this.useMockData = featureFlags.useMockData;
    this.apiBaseUrl = featureFlags.apiBaseUrl || '';
  }

  /**
   * Get data - switches between mock and real API
   */
  protected async getData<R>(
    mockDataFn: () => Promise<ServiceResponse<R>>,
    apiEndpoint: string,
    params?: any
  ): Promise<ServiceResponse<R>> {
    if (this.useMockData) {
      if (featureFlags.enableLogging) {
        console.log(`[Mock Data] Fetching from ${apiEndpoint}`);
      }
      return mockDataFn();
    }

    try {
      if (featureFlags.enableLogging) {
        console.log(`[Real API] Fetching from ${apiEndpoint}`, params);
      }
      
      const { response, error } = await apiService.get(apiEndpoint, params);
      
      if (error) {
        return {
          response: null,
          error: { message: error.message || 'API request failed' },
        };
      }

      return {
        response: response as R,
        error: null,
      };
    } catch (error) {
      return {
        response: null,
        error: { message: 'Network error occurred' },
      };
    }
  }

  /**
   * Post data - switches between mock and real API
   */
  protected async postData<R>(
    mockDataFn: () => Promise<ServiceResponse<R>>,
    apiEndpoint: string,
    data?: any
  ): Promise<ServiceResponse<R>> {
    if (this.useMockData) {
      if (featureFlags.enableLogging) {
        console.log(`[Mock Data] Posting to ${apiEndpoint}`, data);
      }
      return mockDataFn();
    }

    try {
      if (featureFlags.enableLogging) {
        console.log(`[Real API] Posting to ${apiEndpoint}`, data);
      }
      
      const { response, error } = await apiService.post(apiEndpoint, data);
      
      if (error) {
        return {
          response: null,
          error: { message: error.message || 'API request failed' },
        };
      }

      return {
        response: response as R,
        error: null,
      };
    } catch (error) {
      return {
        response: null,
        error: { message: 'Network error occurred' },
      };
    }
  }

  /**
   * Put data - switches between mock and real API
   */
  protected async putData<R>(
    mockDataFn: () => Promise<ServiceResponse<R>>,
    apiEndpoint: string,
    data?: any
  ): Promise<ServiceResponse<R>> {
    if (this.useMockData) {
      if (featureFlags.enableLogging) {
        console.log(`[Mock Data] Updating ${apiEndpoint}`, data);
      }
      return mockDataFn();
    }

    try {
      if (featureFlags.enableLogging) {
        console.log(`[Real API] Updating ${apiEndpoint}`, data);
      }
      
      const { response, error } = await apiService.put(apiEndpoint, data);
      
      if (error) {
        return {
          response: null,
          error: { message: error.message || 'API request failed' },
        };
      }

      return {
        response: response as R,
        error: null,
      };
    } catch (error) {
      return {
        response: null,
        error: { message: 'Network error occurred' },
      };
    }
  }

  /**
   * Delete data - switches between mock and real API
   */
  protected async deleteData<R>(
    mockDataFn: () => Promise<ServiceResponse<R>>,
    apiEndpoint: string
  ): Promise<ServiceResponse<R>> {
    if (this.useMockData) {
      if (featureFlags.enableLogging) {
        console.log(`[Mock Data] Deleting ${apiEndpoint}`);
      }
      return mockDataFn();
    }

    try {
      if (featureFlags.enableLogging) {
        console.log(`[Real API] Deleting ${apiEndpoint}`);
      }
      
      const { response, error } = await apiService.delete(apiEndpoint);
      
      if (error) {
        return {
          response: null,
          error: { message: error.message || 'API request failed' },
        };
      }

      return {
        response: response as R,
        error: null,
      };
    } catch (error) {
      return {
        response: null,
        error: { message: 'Network error occurred' },
      };
    }
  }
}