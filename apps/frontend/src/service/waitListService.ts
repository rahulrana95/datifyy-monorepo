import api from "./apiService";
import { ServiceResponse } from "./ErrorTypes";

interface WaitlistPayload {
  name: string;
  email: string;
}

class WaitService {
  async joinWaitlist(payload: WaitlistPayload): Promise<ServiceResponse<any>> {
    return api.post("waitlist", payload);
  }
    
    async getWaitlistData(): Promise<ServiceResponse<any>> { 
        return api.get("waitlist-data");
    }
  
  async getWaitlistCount(): Promise<ServiceResponse<any>> {
    return api.get("waitlist-count");
  }
}

const waitService = new WaitService();
export default waitService;
