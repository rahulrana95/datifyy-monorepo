import api from "./apiService";

interface WaitlistPayload {
  name: string;
  email: string;
}

class WaitService {
  async joinWaitlist(payload: WaitlistPayload): Promise<{ response?: any; error?: { code: number; message: string } }> {
    return api.post("/api/v1/waitlist", payload);
  }
    
    async getWaitlistData(): Promise<{ response?: any; error?: { code: number; message: string } }> { 
        return api.get("/api/v1/waitlist-data");
    }
  
  async getWaitlistCount(): Promise<{ response?: any; error?: { code: number; message: string } }> {
    return api.get("/api/v1/waitlist-count");
  }
}

const waitService = new WaitService();
export default waitService;
