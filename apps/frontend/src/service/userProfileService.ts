import { getErrorObject, getResponseNotExistErrorObject } from "../mvp/common/utils/serviceUtils";
import api from "./apiService";
import { ErrorObject } from "./ErrorTypes";
import { DatifyyUsersInformation } from "./UserProfileTypes";


class UserProfileService {
  async getUserProfile(): Promise<{
    response: DatifyyUsersInformation | null;
    error?: ErrorObject }> {
    try {
      const response: {
        response?: {
          data?: DatifyyUsersInformation
        };
        error?: ErrorObject;
      } = await api.get("/api/v1/user-profile");
      
      if (!response.response) {
        return getResponseNotExistErrorObject();
      }
      return { response: response.response.data ?? null, error: undefined };
    } catch (error: any) {
      return getErrorObject(error);
    }
  }
}

const userProfileService = new UserProfileService();
export default userProfileService;
