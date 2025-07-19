# Mock Data Distribution for Genie Section

## Overview
The mock data generation has been enhanced to provide a realistic distribution of dates with appropriate statuses, notes, and feedback.

## Date Status Distribution (50 Total Dates)

### 1. Upcoming Dates (15 dates - 30%)
- **Scheduled**: 1-7 days in the future
- **Reminder Status**: 80% have reminders sent (within last 24 hours)
- **Notes**: Focus on preparation and compatibility
  - "Both users have confirmed availability. High compatibility score."
  - "First date for both users. Please ensure smooth experience."
  - "VIP users - extra attention needed."

### 2. Ongoing Dates (10 dates - 20%)
- **Scheduled**: Today, started within last 2 hours
- **Reminder Status**: 100% have reminders sent
- **Notes**: Real-time observations
  - "Date started on time. Both users joined promptly."
  - "Initial conversation going well. Good chemistry observed."
  - "Both users seem comfortable and enjoying the interaction."

### 3. Completed Dates (15 dates - 30%)
- **Scheduled**: 1-30 days ago
- **Reminder Status**: 90% had reminders sent
- **Feedback**: 70% have user feedback
- **Notes**: Post-date analysis
  - "Date went exceptionally well. Both expressed interest in second date."
  - "Users had great chemistry. Exchanged contact information."
  - "Both users rated the experience highly."

### 4. Cancelled Dates (5 dates - 10%)
- **Scheduled**: Mix of past dates
- **Reminder Status**: 40% had reminders before cancellation
- **Notes**: Cancellation reasons
  - "User 1 had emergency. Requested reschedule."
  - "Technical issues prevented date from happening."
  - "Mutual cancellation due to changed preferences."

### 5. Rescheduled Dates (5 dates - 10%)
- **Scheduled**: Mix of past and future (1-5 days)
- **Reminder Status**: 60% have reminders sent
- **Notes**: Rescheduling context
  - "Original date postponed due to user 1 travel plans."
  - "Changed from online to offline mode per user request."
  - "Moved to next week for better preparation."

## User Profiles

### Verification Status Distribution
- Phone Verified: ~70%
- Email Verified: ~80%
- Office Email Verified: ~50%
- College Verified: ~40% (for students)
- ID Verified: ~60%
- Work Verified: ~50%
- LinkedIn Verified: ~30%

### Demographics
- **Age Range**: 24-34 years
- **Cities**: Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata
- **Occupations**: Mix of Software Engineers and Students
- **Companies**: Google, Microsoft, Amazon, Flipkart, Paytm, Swiggy, Zomato
- **Colleges**: IIT Delhi, IIT Bombay, IIM Ahmedabad, BITS Pilani, NIT Trichy, VIT

## Date Characteristics

### Mode Distribution
- **Online**: ~50% (includes meeting link)
- **Offline**: ~50% (includes location details)

### Time Slots
- Morning (9:00-12:00): 25%
- Afternoon (12:00-16:00): 25%
- Evening (16:00-20:00): 25%
- Night (20:00-23:00): 25%

### Locations (for Offline Dates)
- Cafes: Starbucks, Blue Tokai Coffee
- Parks: Cubbon Park
- Restaurants: Social Hauz Khas
- All include ratings, amenities, and Google Maps links

## Feedback Patterns

### Successful Dates
- "Had an amazing time! Would love to meet again."
- "Wonderful experience! Found so many common interests."
- "The conversation flowed naturally. Very comfortable."

### Neutral/No Chemistry
- "Nice person but didn't feel the romantic connection."
- "Enjoyed the conversation but more as friends."

### Positive but Exploring
- "Good date overall. Would like to know them better."
- "Interesting person. Open to exploring further."

## Usage in Development

This distribution ensures:
1. **Realistic Testing**: All date statuses are well-represented
2. **UI Testing**: Various states for cards, filters, and modals
3. **Edge Cases**: Includes VIP users, technical issues, rescheduling scenarios
4. **Performance**: 50 dates provide good pagination testing
5. **Search Testing**: Diverse names, cities, and companies for search functionality