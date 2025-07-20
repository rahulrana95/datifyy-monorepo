import { 
  UserVerification, 
  VerificationFilter, 
  EmailTemplate, 
  VerificationStats,
  VerificationUpdateRequest,
  BulkEmailRequest,
  VerificationStatus
} from '../types';
import { ServiceResponse } from '../../../../service/ErrorTypes';

// Mock data generator
class MockVerificationData {
  private users: UserVerification[] = [];
  private emailTemplates: EmailTemplate[] = [];

  constructor() {
    this.generateMockUsers();
    this.generateEmailTemplates();
  }

  private generateMockUsers() {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Jaipur', 'Ahmedabad', 'Lucknow'];
    const colleges = ['IIT Delhi', 'IIT Bombay', 'BITS Pilani', 'NIT Trichy', 'VIT Vellore', 'IIT Madras', 'IIT Kanpur', 'IIIT Hyderabad', 'DTU Delhi', 'NSIT Delhi'];
    const companies = ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'TCS', 'Infosys', 'Wipro', 'HCL', 'Accenture', 'Deloitte', 'PwC', 'EY', 'KPMG', 'IBM', 'Oracle'];
    const degrees = ['B.Tech', 'B.E.', 'M.Tech', 'MCA', 'BCA', 'B.Sc'];
    const designations = ['Software Engineer', 'Senior Software Engineer', 'Product Manager', 'Data Analyst', 'Designer', 'Consultant', 'Business Analyst', 'Tech Lead'];
    
    const firstNamesMale = ['Rahul', 'Amit', 'Vikram', 'Arjun', 'Rohit', 'Aditya', 'Karan', 'Nikhil', 'Siddharth', 'Varun', 'Harsh', 'Shubham', 'Akash', 'Ankit', 'Gaurav'];
    const firstNamesFemale = ['Priya', 'Neha', 'Ananya', 'Kavya', 'Shreya', 'Divya', 'Pooja', 'Anjali', 'Swati', 'Riya', 'Sakshi', 'Kritika', 'Ishita', 'Aditi', 'Megha'];
    const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Verma', 'Gupta', 'Reddy', 'Nair', 'Joshi', 'Mehta', 'Agarwal', 'Bhatia', 'Chauhan', 'Rao', 'Iyer'];

    // Define verification status patterns for comprehensive coverage (50 users total)
    const verificationPatterns = [
      // Group 1: Fully verified users (5 users)
      { phone: 'verified', email: 'verified', officialEmail: 'verified', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'verified' },
      { phone: 'verified', email: 'verified', officialEmail: 'verified', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'verified' },
      { phone: 'verified', email: 'verified', officialEmail: 'verified', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'verified' },
      { phone: 'verified', email: 'verified', officialEmail: 'verified', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'verified' },
      { phone: 'verified', email: 'verified', officialEmail: 'verified', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'verified' },
      
      // Group 2: All pending (5 users)
      { phone: 'pending', email: 'pending', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'pending', marksheet: 'pending' },
      { phone: 'pending', email: 'pending', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'pending', marksheet: 'pending' },
      { phone: 'pending', email: 'pending', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'pending', marksheet: 'pending' },
      { phone: 'pending', email: 'pending', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'pending', marksheet: 'pending' },
      { phone: 'pending', email: 'pending', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'pending', marksheet: 'pending' },
      
      // Group 3: Mixed verified and pending (10 users)
      { phone: 'verified', email: 'verified', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'verified', marksheet: 'pending' },
      { phone: 'verified', email: 'pending', officialEmail: 'verified', aadharId: 'verified', collegeOrWork: 'pending', marksheet: 'verified' },
      { phone: 'pending', email: 'verified', officialEmail: 'verified', aadharId: 'pending', collegeOrWork: 'verified', marksheet: 'pending' },
      { phone: 'verified', email: 'verified', officialEmail: 'pending', aadharId: 'verified', collegeOrWork: 'pending', marksheet: 'verified' },
      { phone: 'pending', email: 'pending', officialEmail: 'verified', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'pending' },
      { phone: 'verified', email: 'pending', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'verified', marksheet: 'verified' },
      { phone: 'pending', email: 'verified', officialEmail: 'pending', aadharId: 'verified', collegeOrWork: 'pending', marksheet: 'pending' },
      { phone: 'verified', email: 'verified', officialEmail: 'verified', aadharId: 'pending', collegeOrWork: 'pending', marksheet: 'verified' },
      { phone: 'verified', email: 'pending', officialEmail: 'verified', aadharId: 'pending', collegeOrWork: 'verified', marksheet: 'pending' },
      { phone: 'pending', email: 'verified', officialEmail: 'pending', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'verified' },
      
      // Group 4: Some rejected (10 users)
      { phone: 'verified', email: 'verified', officialEmail: 'rejected', aadharId: 'pending', collegeOrWork: 'rejected', marksheet: 'pending' },
      { phone: 'verified', email: 'verified', officialEmail: 'pending', aadharId: 'rejected', collegeOrWork: 'pending', marksheet: 'rejected' },
      { phone: 'rejected', email: 'verified', officialEmail: 'verified', aadharId: 'pending', collegeOrWork: 'pending', marksheet: 'pending' },
      { phone: 'verified', email: 'rejected', officialEmail: 'pending', aadharId: 'verified', collegeOrWork: 'rejected', marksheet: 'pending' },
      { phone: 'pending', email: 'pending', officialEmail: 'rejected', aadharId: 'rejected', collegeOrWork: 'pending', marksheet: 'pending' },
      { phone: 'verified', email: 'verified', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'pending', marksheet: 'rejected' },
      { phone: 'pending', email: 'rejected', officialEmail: 'verified', aadharId: 'pending', collegeOrWork: 'rejected', marksheet: 'verified' },
      { phone: 'rejected', email: 'pending', officialEmail: 'pending', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'rejected' },
      { phone: 'verified', email: 'pending', officialEmail: 'rejected', aadharId: 'rejected', collegeOrWork: 'pending', marksheet: 'pending' },
      { phone: 'pending', email: 'verified', officialEmail: 'verified', aadharId: 'pending', collegeOrWork: 'rejected', marksheet: 'rejected' },
      
      // Group 5: Not submitted patterns (10 users)
      { phone: 'verified', email: 'verified', officialEmail: 'not_submitted', aadharId: 'not_submitted', collegeOrWork: 'not_submitted', marksheet: 'not_submitted' },
      { phone: 'pending', email: 'verified', officialEmail: 'not_submitted', aadharId: 'pending', collegeOrWork: 'not_submitted', marksheet: 'not_submitted' },
      { phone: 'verified', email: 'not_submitted', officialEmail: 'not_submitted', aadharId: 'not_submitted', collegeOrWork: 'pending', marksheet: 'not_submitted' },
      { phone: 'not_submitted', email: 'verified', officialEmail: 'verified', aadharId: 'not_submitted', collegeOrWork: 'not_submitted', marksheet: 'pending' },
      { phone: 'verified', email: 'verified', officialEmail: 'not_submitted', aadharId: 'verified', collegeOrWork: 'not_submitted', marksheet: 'not_submitted' },
      { phone: 'not_submitted', email: 'not_submitted', officialEmail: 'pending', aadharId: 'pending', collegeOrWork: 'verified', marksheet: 'not_submitted' },
      { phone: 'pending', email: 'not_submitted', officialEmail: 'not_submitted', aadharId: 'not_submitted', collegeOrWork: 'not_submitted', marksheet: 'verified' },
      { phone: 'verified', email: 'pending', officialEmail: 'not_submitted', aadharId: 'not_submitted', collegeOrWork: 'pending', marksheet: 'not_submitted' },
      { phone: 'not_submitted', email: 'verified', officialEmail: 'not_submitted', aadharId: 'verified', collegeOrWork: 'not_submitted', marksheet: 'not_submitted' },
      { phone: 'pending', email: 'pending', officialEmail: 'not_submitted', aadharId: 'not_submitted', collegeOrWork: 'not_submitted', marksheet: 'not_submitted' },
      
      // Group 6: Partially verified (10 users)
      { phone: 'verified', email: 'verified', officialEmail: 'verified', aadharId: 'not_submitted', collegeOrWork: 'not_submitted', marksheet: 'not_submitted' },
      { phone: 'verified', email: 'not_submitted', officialEmail: 'not_submitted', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'not_submitted' },
      { phone: 'verified', email: 'verified', officialEmail: 'not_submitted', aadharId: 'verified', collegeOrWork: 'pending', marksheet: 'rejected' },
      { phone: 'not_submitted', email: 'verified', officialEmail: 'verified', aadharId: 'verified', collegeOrWork: 'not_submitted', marksheet: 'pending' },
      { phone: 'verified', email: 'pending', officialEmail: 'verified', aadharId: 'not_submitted', collegeOrWork: 'verified', marksheet: 'not_submitted' },
      { phone: 'pending', email: 'verified', officialEmail: 'verified', aadharId: 'rejected', collegeOrWork: 'not_submitted', marksheet: 'not_submitted' },
      { phone: 'verified', email: 'rejected', officialEmail: 'not_submitted', aadharId: 'verified', collegeOrWork: 'verified', marksheet: 'pending' },
      { phone: 'verified', email: 'verified', officialEmail: 'pending', aadharId: 'not_submitted', collegeOrWork: 'rejected', marksheet: 'not_submitted' },
      { phone: 'rejected', email: 'verified', officialEmail: 'verified', aadharId: 'pending', collegeOrWork: 'not_submitted', marksheet: 'not_submitted' },
      { phone: 'verified', email: 'not_submitted', officialEmail: 'rejected', aadharId: 'verified', collegeOrWork: 'pending', marksheet: 'not_submitted' },
    ];

    // Generate exactly 50 mock users with proper distribution
    for (let i = 1; i <= 50; i++) {
      // Determine user type: 25 students, 25 professionals
      const userType = i <= 25 ? 'college_student' : 'working_professional';
      
      // Alternate between male and female names
      const isMale = i % 2 === 0;
      const firstName = isMale 
        ? firstNamesMale[Math.floor(Math.random() * firstNamesMale.length)]
        : firstNamesFemale[Math.floor(Math.random() * firstNamesFemale.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Distribute cities evenly
      const city = cities[i % cities.length];

      // Select verification pattern based on user index (50 users, 50 patterns)
      const patternIndex = (i - 1) % verificationPatterns.length;
      const pattern = verificationPatterns[patternIndex];
      
      // Create base user object
      const user: UserVerification = {
        id: `user_${i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
        phone: `+91${Math.floor(9000000000 + Math.random() * 1000000000)}`,
        city,
        state: this.getStateForCity(city),
        country: 'India',
        userType: userType as 'college_student' | 'working_professional',
        profilePicture: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
        joinedDate: this.randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
        lastActive: this.randomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date()).toISOString(),
        
        verificationStatus: {
          phone: pattern.phone as VerificationStatus,
          email: pattern.email as VerificationStatus,
          officialEmail: userType === 'working_professional' ? pattern.officialEmail as VerificationStatus : 'not_submitted',
          aadharId: pattern.aadharId as VerificationStatus,
          collegeId: userType === 'college_student' ? pattern.collegeOrWork as VerificationStatus : undefined,
          workId: userType === 'working_professional' ? pattern.collegeOrWork as VerificationStatus : undefined,
          collegeMarksheet: userType === 'college_student' ? pattern.marksheet as VerificationStatus : undefined,
        },
        
        documents: {
          aadharUploaded: pattern.aadharId !== 'not_submitted',
          aadharUrl: pattern.aadharId !== 'not_submitted' ? '/mock-documents/aadhar.pdf' : undefined,
          aadharNumber: pattern.aadharId !== 'not_submitted' ? 'XXXX-XXXX-' + (1000 + i) : undefined,
        }
      };

      // Add college details for students
      if (userType === 'college_student') {
        const college = colleges[i % colleges.length];
        const degree = degrees[i % degrees.length];
        const graduationYear = 2024 + (i % 3);
        
        user.college = {
          name: college,
          degree: degree,
          graduationYear: graduationYear.toString(),
          marksheetUploaded: pattern.marksheet !== 'not_submitted',
          marksheetUrl: pattern.marksheet !== 'not_submitted' ? '/mock-documents/marksheet.pdf' : undefined,
          studentIdUploaded: pattern.collegeOrWork !== 'not_submitted',
          studentIdUrl: pattern.collegeOrWork !== 'not_submitted' ? '/mock-documents/student-id.jpg' : undefined,
        };
      }

      // Add work details for professionals
      if (userType === 'working_professional') {
        const company = companies[(i - 26) % companies.length];
        const designation = designations[(i - 26) % designations.length];
        
        user.work = {
          company,
          designation,
          officialEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s/g, '')}.com`,
          workIdUploaded: pattern.collegeOrWork !== 'not_submitted',
          workIdUrl: pattern.collegeOrWork !== 'not_submitted' ? '/mock-documents/work-id.jpg' : undefined,
        };
      }

      this.users.push(user);
    }
  }

  private generateEmailTemplates() {
    this.emailTemplates = [
      {
        id: 'template_1',
        name: 'Phone Verification Reminder',
        subject: 'Complete your phone verification on Datifyy',
        body: `Hi {{userName}},\n\nWe noticed you haven't verified your phone number yet. Verifying your phone helps us ensure the security of your account.\n\nClick here to verify: {{verificationLink}}\n\nBest regards,\nDatifyy Team`,
        category: 'verification',
        variables: ['userName', 'verificationLink'],
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString(),
      },
      {
        id: 'template_2',
        name: 'College ID Verification',
        subject: 'Upload your College ID for verification',
        body: `Hi {{userName}},\n\nTo complete your student verification, please upload your college ID card.\n\nUpload here: {{uploadLink}}\n\nThis helps us maintain a trusted community of students.\n\nThanks,\nDatifyy Team`,
        category: 'verification',
        variables: ['userName', 'uploadLink'],
        createdAt: new Date('2024-01-02').toISOString(),
        updatedAt: new Date('2024-01-02').toISOString(),
      },
      {
        id: 'template_3',
        name: 'Work Email Verification',
        subject: 'Verify your work email address',
        body: `Hi {{userName}},\n\nPlease verify your work email ({{workEmail}}) to complete your professional profile.\n\nVerify now: {{verificationLink}}\n\nBest,\nDatifyy Team`,
        category: 'verification',
        variables: ['userName', 'workEmail', 'verificationLink'],
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-03').toISOString(),
      },
      {
        id: 'template_4',
        name: 'Document Rejection Notice',
        subject: 'Document verification update',
        body: `Hi {{userName}},\n\nYour {{documentType}} was not approved due to: {{rejectionReason}}\n\nPlease upload a clear, valid document.\n\nRe-upload here: {{uploadLink}}\n\nThanks,\nDatifyy Team`,
        category: 'verification',
        variables: ['userName', 'documentType', 'rejectionReason', 'uploadLink'],
        createdAt: new Date('2024-01-04').toISOString(),
        updatedAt: new Date('2024-01-04').toISOString(),
      },
      {
        id: 'template_5',
        name: 'Complete Your Profile',
        subject: 'You\'re almost there! Complete your Datifyy profile',
        body: `Hi {{userName}},\n\nYou're just {{remainingSteps}} steps away from a fully verified profile!\n\nComplete your profile: {{profileLink}}\n\nA verified profile gets 3x more matches!\n\nBest,\nDatifyy Team`,
        category: 'general',
        variables: ['userName', 'remainingSteps', 'profileLink'],
        createdAt: new Date('2024-01-05').toISOString(),
        updatedAt: new Date('2024-01-05').toISOString(),
      }
    ];
  }

  private getStateForCity(city: string): string {
    const cityStateMap: Record<string, string> = {
      'Mumbai': 'Maharashtra',
      'Delhi': 'Delhi',
      'Bangalore': 'Karnataka',
      'Chennai': 'Tamil Nadu',
      'Pune': 'Maharashtra',
      'Hyderabad': 'Telangana',
      'Kolkata': 'West Bengal',
      'Jaipur': 'Rajasthan',
      'Ahmedabad': 'Gujarat',
      'Lucknow': 'Uttar Pradesh'
    };
    return cityStateMap[city] || 'Unknown';
  }


  private randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // Public methods
  async getUsers(
    page: number,
    limit: number,
    filters?: VerificationFilter
  ): Promise<ServiceResponse<{
    users: UserVerification[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    let filteredUsers = [...this.users];

    // Apply filters
    if (filters) {
      if (filters.userType && filters.userType !== 'all') {
        filteredUsers = filteredUsers.filter(u => u.userType === filters.userType);
      }

      if (filters.verificationStatus && filters.verificationStatus !== 'all') {
        filteredUsers = filteredUsers.filter(u => {
          return Object.values(u.verificationStatus).some(
            status => status === filters.verificationStatus
          );
        });
      }

      if (filters.specificVerification) {
        filteredUsers = filteredUsers.filter(u => {
          const status = u.verificationStatus[filters.specificVerification!];
          return status && status !== 'verified';
        });
      }

      if (filters.city) {
        filteredUsers = filteredUsers.filter(u => 
          u.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }

      if (filters.country) {
        filteredUsers = filteredUsers.filter(u => 
          u.country.toLowerCase().includes(filters.country!.toLowerCase())
        );
      }

      if (filters.dateRange) {
        filteredUsers = filteredUsers.filter(u => {
          const joinedDate = new Date(u.joinedDate);
          return joinedDate >= filters.dateRange!.from && joinedDate <= filters.dateRange!.to;
        });
      }
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return {
      response: {
        users: paginatedUsers,
        total: filteredUsers.length,
        page,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    };
  }

  async getStats(): Promise<ServiceResponse<VerificationStats>> {
    const stats: VerificationStats = {
      totalUsers: this.users.length,
      verifiedUsers: 0,
      pendingVerifications: 0,
      rejectedVerifications: 0,
      byType: {
        phone: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
        email: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
        officialEmail: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
        aadharId: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
        collegeId: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
        workId: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
        collegeMarksheet: { verified: 0, pending: 0, rejected: 0, notSubmitted: 0 },
      }
    };

    // Calculate stats
    this.users.forEach(user => {
      const allVerified = Object.entries(user.verificationStatus)
        .filter(([key, value]) => value !== undefined)
        .every(([key, value]) => value === 'verified');
      
      if (allVerified) stats.verifiedUsers++;

      Object.entries(user.verificationStatus).forEach(([type, status]) => {
        if (status) {
          const statType = stats.byType[type as keyof typeof stats.byType];
          if (statType) {
            if (status === 'not_submitted') {
              statType.notSubmitted++;
            } else {
              statType[status]++;
            }
            if (status === 'pending') stats.pendingVerifications++;
            if (status === 'rejected') stats.rejectedVerifications++;
          }
        }
      });
    });

    return { response: stats };
  }

  async updateVerificationStatus(
    request: VerificationUpdateRequest
  ): Promise<ServiceResponse<{ success: boolean; user: UserVerification }>> {
    const user = this.users.find(u => u.id === request.userId);
    if (!user) {
      return {
        error: { code: 404, message: 'User not found' }
      };
    }

    // Update the verification status
    user.verificationStatus[request.verificationType] = request.status;

    return {
      response: {
        success: true,
        user
      }
    };
  }

  async sendBulkEmail(
    request: BulkEmailRequest
  ): Promise<ServiceResponse<{ success: boolean; emailsSent: number }>> {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      response: {
        success: true,
        emailsSent: request.userIds.length
      }
    };
  }

  async getEmailTemplates(
    category?: 'verification' | 'reminder' | 'general'
  ): Promise<ServiceResponse<EmailTemplate[]>> {
    let templates = [...this.emailTemplates];
    
    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    return { response: templates };
  }

  async getDocumentPreview(
    userId: string,
    documentType: string
  ): Promise<ServiceResponse<{ url: string }>> {
    // Return mock document URL
    return {
      response: {
        url: `/mock-documents/${documentType}-${userId}.pdf`
      }
    };
  }
}

// Create and export singleton instance
export const mockVerificationData = new MockVerificationData();