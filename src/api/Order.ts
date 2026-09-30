/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type {
  LocationData,
  LocationRequestDto,
  LocationUpdateRequestDto,
  ProcessData,
  ProcessPayload,
  UpdateLocationData,
} from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class Order<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 배송 로직
   * @name Process
   * @summary 배송 로직 처리
   * @request POST:/order
   * @response `200` `ProcessData` OK
   */
  process = (data: ProcessPayload, params: RequestParams = {}) =>
    this.request<ProcessData, any>({
      path: `/order`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @tags 배송 로직
   * @name Location
   * @summary 전달자 GPS 위치 조회 (의뢰자 전용, 배송중 상태에서만 조회 가능)
   * @request GET:/order/location
   * @response `200` `LocationData` OK
   */
  location = (
    query: {
      locationRequestDto: LocationRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<LocationData, any>({
      path: `/order/location`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 배송 로직
   * @name UpdateLocation
   * @summary 전달자 GPS 위치 갱신 (전달자 전용, 배송중 상태에서만 갱신 가능)
   * @request PATCH:/order/location
   * @response `200` `UpdateLocationData` OK
   */
  updateLocation = (data: LocationUpdateRequestDto, params: RequestParams = {}) =>
    this.request<UpdateLocationData, any>({
      path: `/order/location`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
