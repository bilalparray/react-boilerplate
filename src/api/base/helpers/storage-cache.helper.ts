import type { Method } from "axios";
import { AppConstants } from "../../../app-constants";
import { environment } from "../../../environment";
import type { AdditionalRequestDetails } from "../../../models/internal/additional-request-details";
import { CacheItem } from "../../../models/internal/cache-item";
import type { ApiResponse } from "../../../models/service/foundation/api-contracts/base/api-response";
import { storageService } from "../../../store/storageService";
import { CommonLogger } from "./common-logger.helper";
import * as Flatted from "flatted";
export class StorageCache {
  /* same behavior as Angular injectable singleton */
  private static instance: StorageCache;
  static getInstance() {
    if (!this.instance) this.instance = new StorageCache();
    return this.instance;
  }

  // ─────────────────────────────────────────────────────────────

  async getResponseFromDbIfPresent<OutResp>(
    fullUrlToHit: string,
    reqMethod: Method,
    additionalRequestDetails: AdditionalRequestDetails<OutResp>
  ): Promise<ApiResponse<OutResp> | null> {
    if (!environment.enableResponseCacheProcessing) return null;

    if (
      additionalRequestDetails.useCacheIfPossible &&
      !additionalRequestDetails.forceGetResponseFromApi &&
      reqMethod === "GET"
    ) {
      const cacheItem = await this.getCacheItemIfPresent<ApiResponse<OutResp>>(
        fullUrlToHit
      );
      if (cacheItem != null) return cacheItem;
    }

    return null;
  }

  async addOrUpdateResponseInCacheIfApplicable<OutResp>(
    fullUrlToHit: string,
    reqMethod: Method,
    additionalRequestDetails: AdditionalRequestDetails<OutResp>,
    responseEntity: ApiResponse<OutResp>
  ): Promise<boolean> {
    if (!environment.enableResponseCacheProcessing) return false;

    if (
      additionalRequestDetails.useCacheIfPossible &&
      reqMethod === "GET" &&
      responseEntity.axiosResponse?.status === 200 &&
      !responseEntity.isError
    ) {
      await this.addOrUpdateCacheItem<ApiResponse<OutResp>>(
        fullUrlToHit,
        responseEntity
      );
    }

    return false;
  }

  // ─────────────────────────────────────────────────────────────

  private async getCacheItemIfPresent<T>(key: string): Promise<T | null> {
    if (!key) return null;

    const cacheMap = await this.getMapFromDb();

    if (cacheMap.has(key)) {
      const cacheItem = cacheMap.get(key);
      if (cacheItem) {
        if (cacheItem.ValidUptoDateTimeTicks >= Date.now()) {
          if (environment.LoggingInfo.cacheLogs) {
            CommonLogger.logTextOrObject(
              `StorageCache - Response Returned from cache -- '${key}'`
            );
          }
          return cacheItem.Data as T;
        } else {
          if (environment.LoggingInfo.cacheLogs) {
            CommonLogger.logTextOrObject(
              `StorageCache - Cache object expired -- '${key}'`
            );
          }
        }
      }
    }

    return null;
  }

  private async addOrUpdateCacheItem<T>(
    key: string,
    data: T,
    cacheTimeout = 0
  ): Promise<boolean> {
    if (!key || !data) return false;

    const cacheMap = await this.getMapFromDb();

    if (cacheMap.has(key)) {
      cacheMap.delete(key);
      if (environment.LoggingInfo.cacheLogs) {
        CommonLogger.logTextOrObject(
          `StorageCache - Old Key Deleted -- '${key}'`
        );
      }
    }

    this.removeExpiredKeys(cacheMap);

    const cacheItem = new CacheItem();
    const now = new Date();

    cacheItem.CreatedDateTimeTicks = now.valueOf();
    const timeout =
      cacheTimeout === 0
        ? environment.apiResponseCacheTimeoutInMinutes
        : cacheTimeout;

    now.setMinutes(now.getMinutes() + timeout);

    cacheItem.ValidUptoDateTimeTicks = now.valueOf();
    cacheItem.AccessKey = key;
    cacheItem.Data = data;

    cacheMap.set(key, cacheItem);

    if (environment.LoggingInfo.cacheLogs) {
      CommonLogger.logTextOrObject(`StorageCache - New Key Added -- '${key}'`);
    }

    await this.saveOrUpdateMapInDb(cacheMap);
    return true;
  }

  // ─────────────────────────────────────────────────────────────

  private removeExpiredKeys(cacheMap: Map<string, CacheItem>) {
    const now = Date.now();
    const keysToDelete: string[] = [];

    cacheMap.forEach((item, key) => {
      if (item && item.ValidUptoDateTimeTicks <= now) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      if (environment.LoggingInfo.cacheLogs) {
        CommonLogger.logTextOrObject(
          `StorageCache - Item deleted after expiry -- '${key}'`
        );
      }
      cacheMap.delete(key);
    });
  }

  // ─────────────────────────────────────────────────────────────

  private async getMapFromDb(): Promise<Map<string, CacheItem>> {
    const cacheMapTxt = await storageService.getFromStorage(
      AppConstants.DATABASE_KEYS.API_RESP_CACHE
    );

    if (!cacheMapTxt) return new Map<string, CacheItem>();

    const parsed = Flatted.parse(cacheMapTxt);

    if (!Array.isArray(parsed)) return new Map<string, CacheItem>();

    return new Map<string, CacheItem>(parsed);
  }

  private async saveOrUpdateMapInDb(
    cacheMap: Map<string, CacheItem>
  ): Promise<boolean> {
    const cacheMapTxt = Flatted.stringify(Array.from(cacheMap.entries()));

    await storageService.saveToStorage(
      AppConstants.DATABASE_KEYS.API_RESP_CACHE,
      cacheMapTxt
    );

    return true;
  }
}
