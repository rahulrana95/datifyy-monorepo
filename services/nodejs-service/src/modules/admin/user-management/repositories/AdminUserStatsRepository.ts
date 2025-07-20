import { DataSource } from 'typeorm';
import { Logger } from '../../../../infrastructure/logging/Logger';
import { 
  UserStatsOverview,
  UsersByStatus,
  UsersByGender,
  UsersByVerification,
  UsersByLocation,
  UserEngagementStats,
  TrustScoreDistribution,
  UserGrowthTrends
} from '../dtos/response/UserStatsResponseDto';
import { UserStatsFilters } from '../types/RepositoryTypes';

export class AdminUserStatsRepository {
  constructor(
    private dataSource: DataSource,
    private logger: Logger
  ) {}

  async getUserStatsOverview(filters?: UserStatsFilters): Promise<UserStatsOverview> {
    try {
      this.logger.info('Getting user stats overview', { filters });

      const whereClause = this.buildWhereClause(filters);
      
      const query = `
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN login.account_status = 'active' THEN 1 END) as active_users,
          COUNT(CASE WHEN DATE(login.created_at) = CURRENT_DATE THEN 1 END) as new_users_today,
          COUNT(CASE WHEN login.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_users_this_week,
          COUNT(CASE WHEN login.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_this_month,
          COUNT(CASE WHEN info.is_official_email_verified = true AND info.is_phone_verified = true THEN 1 END) as verified_users,
          COUNT(CASE WHEN info.is_official_email_verified = false OR info.is_phone_verified = false THEN 1 END) as unverified_users,
          COUNT(CASE WHEN trust.is_on_probation = true THEN 1 END) as users_on_probation,
          COUNT(CASE WHEN login.account_status = 'suspended' THEN 1 END) as suspended_users,
          COUNT(CASE WHEN info.is_deleted = true THEN 1 END) as deleted_users
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        LEFT JOIN datifyy_user_trust_scores trust ON login.id = trust.user_id
        ${whereClause}
      `;

      const result = await this.dataSource.query(query);
      const stats = result[0];

      return {
        totalUsers: parseInt(stats.total_users) || 0,
        activeUsers: parseInt(stats.active_users) || 0,
        newUsersToday: parseInt(stats.new_users_today) || 0,
        newUsersThisWeek: parseInt(stats.new_users_this_week) || 0,
        newUsersThisMonth: parseInt(stats.new_users_this_month) || 0,
        verifiedUsers: parseInt(stats.verified_users) || 0,
        unverifiedUsers: parseInt(stats.unverified_users) || 0,
        usersOnProbation: parseInt(stats.users_on_probation) || 0,
        suspendedUsers: parseInt(stats.suspended_users) || 0,
        deletedUsers: parseInt(stats.deleted_users) || 0
      };
    } catch (error) {
      this.logger.error('Error getting user stats overview', { error, filters });
      throw error;
    }
  }

  async getUsersByStatus(filters?: UserStatsFilters): Promise<UsersByStatus> {
    try {
      this.logger.info('Getting users by status', { filters });

      const whereClause = this.buildWhereClause(filters);
      
      const query = `
        SELECT 
          account_status,
          COUNT(*) as count
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        ${whereClause}
        GROUP BY account_status
      `;

      const results = await this.dataSource.query(query);
      
      const statusCounts: UsersByStatus = {
        active: 0,
        deactivated: 0,
        locked: 0,
        pending: 0,
        suspended: 0
      };

      results.forEach((row: any) => {
        if (row.account_status in statusCounts) {
          statusCounts[row.account_status as keyof UsersByStatus] = parseInt(row.count);
        }
      });

      return statusCounts;
    } catch (error) {
      this.logger.error('Error getting users by status', { error, filters });
      throw error;
    }
  }

  async getUsersByGender(filters?: UserStatsFilters): Promise<UsersByGender> {
    try {
      this.logger.info('Getting users by gender', { filters });

      const whereClause = this.buildWhereClause(filters);
      
      const query = `
        SELECT 
          COALESCE(info.gender, 'not_specified') as gender,
          COUNT(*) as count
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        ${whereClause}
        GROUP BY info.gender
      `;

      const results = await this.dataSource.query(query);
      
      const genderCounts: UsersByGender = {
        male: 0,
        female: 0,
        other: 0,
        notSpecified: 0
      };

      results.forEach((row: any) => {
        switch (row.gender) {
          case 'male':
            genderCounts.male = parseInt(row.count);
            break;
          case 'female':
            genderCounts.female = parseInt(row.count);
            break;
          case 'other':
            genderCounts.other = parseInt(row.count);
            break;
          default:
            genderCounts.notSpecified = parseInt(row.count);
            break;
        }
      });

      return genderCounts;
    } catch (error) {
      this.logger.error('Error getting users by gender', { error, filters });
      throw error;
    }
  }

  async getUsersByVerification(filters?: UserStatsFilters): Promise<UsersByVerification> {
    try {
      this.logger.info('Getting users by verification', { filters });

      const whereClause = this.buildWhereClause(filters);
      
      const query = `
        SELECT 
          COUNT(CASE WHEN info.is_official_email_verified = true THEN 1 END) as email_verified,
          COUNT(CASE WHEN info.is_phone_verified = true THEN 1 END) as phone_verified,
          COUNT(CASE WHEN info.is_aadhar_verified = true THEN 1 END) as id_verified,
          COUNT(CASE WHEN info.is_official_email_verified = true AND info.is_phone_verified = true AND info.is_aadhar_verified = true THEN 1 END) as fully_verified,
          COUNT(CASE WHEN info.is_official_email_verified = false AND info.is_phone_verified = false AND info.is_aadhar_verified = false THEN 1 END) as unverified
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        ${whereClause}
      `;

      const result = await this.dataSource.query(query);
      const stats = result[0];

      return {
        emailVerified: parseInt(stats.email_verified) || 0,
        phoneVerified: parseInt(stats.phone_verified) || 0,
        idVerified: parseInt(stats.id_verified) || 0,
        fullyVerified: parseInt(stats.fully_verified) || 0,
        unverified: parseInt(stats.unverified) || 0
      };
    } catch (error) {
      this.logger.error('Error getting users by verification', { error, filters });
      throw error;
    }
  }

  async getUsersByLocation(filters?: UserStatsFilters): Promise<UsersByLocation> {
    try {
      this.logger.info('Getting users by location', { filters });

      const whereClause = this.buildWhereClause(filters);
      
      // Get total users for percentage calculation
      const totalQuery = `
        SELECT COUNT(*) as total
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        ${whereClause}
      `;
      const totalResult = await this.dataSource.query(totalQuery);
      const totalUsers = parseInt(totalResult[0].total) || 1;

      // Get top cities
      const citiesQuery = `
        SELECT 
          info.current_city as city,
          COUNT(*) as user_count
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        ${whereClause}
        AND info.current_city IS NOT NULL AND info.current_city != ''
        GROUP BY info.current_city
        ORDER BY user_count DESC
        LIMIT 10
      `;

      const citiesResults = await this.dataSource.query(citiesQuery);
      
      const topCities = citiesResults.map((row: any) => ({
        city: row.city,
        userCount: parseInt(row.user_count),
        percentage: Math.round((parseInt(row.user_count) / totalUsers) * 100)
      }));

      // For countries, we'd need to add country field or derive from city
      // For now, returning placeholder data
      const topCountries = [
        { country: 'India', userCount: totalUsers, percentage: 100 }
      ];

      return {
        topCities,
        topCountries
      };
    } catch (error) {
      this.logger.error('Error getting users by location', { error, filters });
      throw error;
    }
  }

  async getUserEngagementStats(filters?: UserStatsFilters): Promise<UserEngagementStats> {
    try {
      this.logger.info('Getting user engagement stats', { filters });

      const whereClause = this.buildWhereClause(filters);
      
      const query = `
        SELECT 
          COUNT(CASE WHEN login.last_active_at >= CURRENT_DATE THEN 1 END) as daily_active_users,
          COUNT(CASE WHEN login.last_active_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as weekly_active_users,
          COUNT(CASE WHEN login.last_active_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as monthly_active_users,
          AVG(login.login_count) as average_logins_per_user
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        ${whereClause}
      `;

      const result = await this.dataSource.query(query);
      const stats = result[0];

      // Get users with dates
      const datesQuery = `
        SELECT 
          COUNT(DISTINCT CASE WHEN cd.user1_id IS NOT NULL OR cd.user2_id IS NOT NULL THEN 
            CASE WHEN cd.user1_id = login.id THEN cd.user1_id ELSE cd.user2_id END
          END) as users_with_dates,
          COUNT(DISTINCT login.id) as total_users_counted
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        LEFT JOIN datifyy_curated_dates cd ON (cd.user1_id = login.id OR cd.user2_id = login.id)
        ${whereClause}
      `;

      const datesResult = await this.dataSource.query(datesQuery);
      const datesStats = datesResult[0];

      const usersWithDates = parseInt(datesStats.users_with_dates) || 0;
      const totalUsers = parseInt(datesStats.total_users_counted) || 0;

      return {
        dailyActiveUsers: parseInt(stats.daily_active_users) || 0,
        weeklyActiveUsers: parseInt(stats.weekly_active_users) || 0,
        monthlyActiveUsers: parseInt(stats.monthly_active_users) || 0,
        averageSessionDuration: 0, // Would need session tracking
        averageLoginsPerUser: parseFloat(stats.average_logins_per_user) || 0,
        usersWithDates,
        usersWithoutDates: totalUsers - usersWithDates
      };
    } catch (error) {
      this.logger.error('Error getting user engagement stats', { error, filters });
      throw error;
    }
  }

  async getTrustScoreDistribution(filters?: UserStatsFilters): Promise<TrustScoreDistribution> {
    try {
      this.logger.info('Getting trust score distribution', { filters });

      const whereClause = this.buildWhereClause(filters);
      
      const query = `
        SELECT 
          COUNT(CASE WHEN trust.overall_score >= 90 THEN 1 END) as excellent,
          COUNT(CASE WHEN trust.overall_score >= 75 AND trust.overall_score < 90 THEN 1 END) as good,
          COUNT(CASE WHEN trust.overall_score >= 50 AND trust.overall_score < 75 THEN 1 END) as average,
          COUNT(CASE WHEN trust.overall_score >= 25 AND trust.overall_score < 50 THEN 1 END) as poor,
          COUNT(CASE WHEN trust.overall_score < 25 THEN 1 END) as critical,
          AVG(trust.overall_score) as average_score,
          PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY trust.overall_score) as median_score
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        LEFT JOIN datifyy_user_trust_scores trust ON login.id = trust.user_id
        ${whereClause}
        AND trust.overall_score IS NOT NULL
      `;

      const result = await this.dataSource.query(query);
      const stats = result[0];

      return {
        excellent: parseInt(stats.excellent) || 0,
        good: parseInt(stats.good) || 0,
        average: parseInt(stats.average) || 0,
        poor: parseInt(stats.poor) || 0,
        critical: parseInt(stats.critical) || 0,
        averageScore: parseFloat(stats.average_score) || 0,
        medianScore: parseFloat(stats.median_score) || 0
      };
    } catch (error) {
      this.logger.error('Error getting trust score distribution', { error, filters });
      throw error;
    }
  }

  async getUserGrowthTrends(days = 30, filters?: UserStatsFilters): Promise<UserGrowthTrends> {
    try {
      this.logger.info('Getting user growth trends', { days, filters });

      // Daily signups for the last N days
      const dailyQuery = `
        SELECT 
          DATE(login.created_at) as date,
          COUNT(*) as signups,
          COUNT(CASE WHEN info.is_official_email_verified = true THEN 1 END) as activations
        FROM datifyy_users_login login
        LEFT JOIN datifyy_users_information info ON login.id = info.user_login_id
        WHERE login.created_at >= CURRENT_DATE - INTERVAL '${days} days'
        GROUP BY DATE(login.created_at)
        ORDER BY date DESC
      `;

      const dailyResults = await this.dataSource.query(dailyQuery);
      
      const dailySignups = dailyResults.map((row: any) => ({
        date: row.date,
        signups: parseInt(row.signups),
        activations: parseInt(row.activations)
      }));

      // Weekly growth (placeholder - would need more complex logic)
      const weeklyGrowth: any[] = [];
      
      // Monthly growth (placeholder - would need more complex logic)
      const monthlyGrowth: any[] = [];

      return {
        dailySignups,
        weeklyGrowth,
        monthlyGrowth
      };
    } catch (error) {
      this.logger.error('Error getting user growth trends', { error, days, filters });
      throw error;
    }
  }

  private buildWhereClause(filters?: UserStatsFilters): string {
    if (!filters) return 'WHERE 1=1';

    const conditions = ['1=1'];

    if (filters.startDate) {
      conditions.push(`login.created_at >= '${filters.startDate.toISOString()}'`);
    }

    if (filters.endDate) {
      conditions.push(`login.created_at <= '${filters.endDate.toISOString()}'`);
    }

    if (filters.city) {
      conditions.push(`LOWER(info.current_city) = LOWER('${filters.city}')`);
    }

    if (filters.gender) {
      conditions.push(`info.gender = '${filters.gender}'`);
    }

    return `WHERE ${conditions.join(' AND ')}`;
  }
}