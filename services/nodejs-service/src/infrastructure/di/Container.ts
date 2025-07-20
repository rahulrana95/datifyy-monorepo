import { ApplicationServer } from "../server/ApplicationServer";
import { Config } from "../config/Config";
import { Logger } from "../logging/Logger";
import { DatabaseConnection } from "../database/DatabaseConnection";
import { MiddlewareFactory } from "../server/MiddlewareFactory";
import { RouteRegistry } from "../server/RouteRegistry";
import { HealthCheckService } from "../../services/health/HealthCheckService";
import { DataSource } from "typeorm";

type ServiceFactory<T> = () => T | Promise<T>;

export class Container {
  private static instance: Container;
  private dataSource: DataSource;
  private services: Map<string, any> = new Map();
  private factories: Map<string, ServiceFactory<any>> = new Map();

  private constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.registerServices();
  }

  static getInstance(dataSource: DataSource): Container {
    if (!Container.instance) {
      Container.instance = new Container(dataSource);
    }
    return Container.instance;
  }

  async initialize(): Promise<void> {
    // Initialize singleton services
    await this.resolve("DatabaseConnection");
  }

  register<T>(name: string, factory: ServiceFactory<T>): void {
    this.factories.set(name, factory);
  }

  async resolve<T>(name: string): Promise<T> {
    // Check if already instantiated
    if (this.services.has(name)) {
      return this.services.get(name);
    }

    // Get factory
    const factory = this.factories.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not registered`);
    }

    // Create instance
    const instance = await factory();
    this.services.set(name, instance);

    return instance;
  }

  private registerServices(): void {
    // Infrastructure services
    this.register("Config", () => Config.getInstance());
    this.register("Logger", () => Logger.getInstance());

    this.register("DatabaseConnection", async () => {
      const config = await this.resolve<Config>("Config");
      const logger = await this.resolve<Logger>("Logger");
      return new DatabaseConnection(config, logger);
    });

    this.register("MiddlewareFactory", async () => {
      const config = await this.resolve<Config>("Config");
      return new MiddlewareFactory(config);
    });

    this.register("RouteRegistry", async () => {
      const config = await this.resolve<Config>("Config");
      const logger = await this.resolve<Logger>("Logger");
      return new RouteRegistry(config, logger, this.dataSource);
    });

    this.register("HealthCheckService", async () => {
      const db = await this.resolve<DatabaseConnection>("DatabaseConnection");
      const logger = await this.resolve<Logger>("Logger");
      return new HealthCheckService(db, logger);
    });

    this.register("ApplicationServer", async () => {
      const config = await this.resolve<Config>("Config");
      const logger = await this.resolve<Logger>("Logger");
      const middlewareFactory = await this.resolve<MiddlewareFactory>(
        "MiddlewareFactory"
      );
      const routeRegistry = await this.resolve<RouteRegistry>("RouteRegistry");
      const databaseConnection = await this.resolve<DatabaseConnection>(
        "DatabaseConnection"
      );
      const healthCheckService = await this.resolve<HealthCheckService>(
        "HealthCheckService"
      );

      return new ApplicationServer(
        config,
        logger,
        middlewareFactory,
        routeRegistry,
        databaseConnection,
        healthCheckService
      );
    });
  }
}
