import { getErrorObject, getResponseNotExistErrorObject } from "../../mvp/common/utils/serviceUtils";
import api from "../apiService";
import { ErrorObject } from "../ErrorTypes";
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
      } = await api.get("user-profile");
      
      if (!response.response) {
        return getResponseNotExistErrorObject();
      }
      return { response: response.response.data ?? null, error: undefined };
    } catch (error: any) {
      return getErrorObject(error);
    }
  }

  async updateUserProfile(data: Partial<DatifyyUsersInformation>): Promise<{
    response?:  string | null;
    error?: ErrorObject }> {
    try {
      const response: {
        response?: string;
        error?: ErrorObject;
      } = await api.put("user-profile", data);
      
      if (!response) {
        return getResponseNotExistErrorObject();
      }
      return { response: response.response, error: undefined };
    } catch (error: any) {
      return getErrorObject(error);
    }
  }
}

const userProfileService = new UserProfileService();
export default userProfileService;
