import { AppConstants } from "../../../app-constants";
import { environment } from "../../../environment";
import { LogLocation } from "../../../models/internal/log-location";
import { LogType } from "../../../models/internal/log-type";
import { LoggerConfig } from "../../../models/internal/logger-config";
import type { SampleErrorLogModel } from "../../../models/internal/sample-error-model";
import { ApiErrorTypeSM } from "../../../models/service/foundation/enums/api-error-type-s-m.enum";
import { storageService } from "../../../store/storageService";
import { LoggerClient } from "./loggerClient";

export class CommonLogger {
  private static storageService = storageService;

  private static loggerConfig: LoggerConfig = (() => {
    return CommonLogger.getDefaultLoggerConfigObject();
  })();

  private static loggerClient = new LoggerClient();

  private constructor() {
    throw new Error("Static class");
  }

  // ─────────────────────────────────────────────────────────────

  private static getDefaultLoggerConfigObject(): LoggerConfig {
    const logConfig = new LoggerConfig();

    logConfig.exceptionLogLocations =
      environment.LoggingInfo.ExceptionLocation.split(",")
        .map((s) => s.trim())
        .map((s) => LogLocation[s as keyof typeof LogLocation])
        .filter((v) => typeof v === "number");

    logConfig.logLocations = environment.LoggingInfo.LogLocation.split(",")
      .map((s) => s.trim())
      .map((s) => LogLocation[s as keyof typeof LogLocation])
      .filter((v) => typeof v === "number");

    if (logConfig.exceptionLogLocations.length === 0)
      logConfig.exceptionLogLocations.push(LogLocation.None);

    if (logConfig.logLocations.length === 0)
      logConfig.logLocations.push(LogLocation.None);

    return logConfig;
  }

  // ─────────────────────────────────────────────────────────────

  static async logException(data: SampleErrorLogModel) {
    try {
      if (this.loggerConfig.exceptionLogLocations.includes(LogLocation.None))
        return;

      if (this.loggerConfig.exceptionLogLocations.includes(LogLocation.Console))
        console.error(data);

      if (this.loggerConfig.exceptionLogLocations.includes(LogLocation.File))
        await this.addItemToIndexDb(LogType.Exception, data);

      if (this.loggerConfig.exceptionLogLocations.includes(LogLocation.Api))
        await this.addItemToApi(LogType.Exception, data);
    } catch (e) {
      console.error(e);
    }
  }

  static async logTextOrObject(data: any) {
    try {
      if (this.loggerConfig.logLocations.includes(LogLocation.Console))
        console.log(data);

      if (this.loggerConfig.logLocations.includes(LogLocation.File))
        await this.addItemToIndexDb(LogType.Log, data);
    } catch (e) {
      console.error(e);
    }
  }

  // ─────────────────────────────────────────────────────────────

  private static async addItemToIndexDb(
    logType: LogType,
    data: any
  ): Promise<void> {
    try {
      let key =
        logType === LogType.Exception
          ? AppConstants.DATABASE_KEYS.EXCEPTION_LOGS
          : AppConstants.DATABASE_KEYS.APP_LOGS;

      let existingLogs = (await this.storageService.getFromStorage(
        key
      )) as SampleErrorLogModel[];

      if (!Array.isArray(existingLogs)) existingLogs = [];

      if (!(data instanceof Object && data.createdOnUTC)) {
        const sample = await this.convertToSampleErrorLogModel(data);
        existingLogs.push(sample);
      } else {
        existingLogs.push(data);
      }

      const MAX_LOGS = 100;
      const trimmed = existingLogs.slice(-MAX_LOGS);

      await this.storageService.saveToStorage(key, trimmed);
    } catch {}
  }

  // ─────────────────────────────────────────────────────────────

  private static async addItemToApi(logType: LogType, data: any) {
    try {
      const logs: SampleErrorLogModel[] = [];

      if (!(data instanceof Object && data.createdOnUTC)) {
        logs.push(await this.convertToSampleErrorLogModel(data));
      } else logs.push(data);

      await this.loggerClient.SendLogsToServerAsync(logs, null);
    } catch {}
  }

  // ─────────────────────────────────────────────────────────────

  private static async convertToSampleErrorLogModel(
    data: any
  ): Promise<SampleErrorLogModel> {
    const additionalProps = new Map<string, string>();

    const platform = await this.storageService.getFromStorage(
      AppConstants.DATABASE_KEYS.PLATFORM
    );

    additionalProps.set("data", String(data));
    additionalProps.set("Page", window.location.href);
    additionalProps.set("Platform", String(platform));

    return {
      apiErrorType: ApiErrorTypeSM.Fatal_Log,
      displayMessage: AppConstants.ERROR_PROMPTS.Unknown_Error,
      additionalProps,
      message: this.getSafeString(data?.message ?? data),
      name: this.getSafeString(data?.name ?? "Unknown"),
      cause: this.getSafeString(data?.cause ?? null),
      stack: this.getSafeString(data?.stack ?? null),
      createdOnUTC: new Date().toISOString(),
    };
  }

  private static getSafeString(value: unknown): string {
    if (value == null) return "";
    try {
      return typeof value === "string" ? value : JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
}
