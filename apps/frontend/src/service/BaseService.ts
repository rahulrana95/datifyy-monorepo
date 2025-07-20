import apiService from './apiService';
import { ServiceResponse } from './ErrorTypes';

export class BaseService {
  protected apiService = apiService;

  protected handleError(error: any): ServiceResponse<any> {
    return {
      error: {
        code: error?.response?.status || 500,
        message: error?.response?.data?.message || error?.message || 'An error occurred',
      },
    };
  }
}