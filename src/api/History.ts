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
  CancelListData,
  DeliveryListData,
  HistoryListRequestDto,
  List2Data,
  RequestListData,
} from "./data-contracts";
import { HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class History<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 이용 내역
   * @name RequestList
   * @summary 이용 내역 의뢰 요청 목록 조회
   * @request GET:/history/request/list
   * @response `200` `RequestListData` OK
   */
  requestList = (
    query: {
      historyListRequestDto: HistoryListRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<RequestListData, any>({
      path: `/history/request/list`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이용 내역
   * @name List2
   * @summary 이용 내역 전체 목록 조회
   * @request GET:/history/list
   * @response `200` `List2Data` OK
   */
  list2 = (
    query: {
      historyListRequestDto: HistoryListRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<List2Data, any>({
      path: `/history/list`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이용 내역
   * @name DeliveryList
   * @summary 이용 내역 이동 경로 목록 조회
   * @request GET:/history/delivery/list
   * @response `200` `DeliveryListData` OK
   */
  deliveryList = (
    query: {
      historyListRequestDto: HistoryListRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<DeliveryListData, any>({
      path: `/history/delivery/list`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이용 내역
   * @name CancelList
   * @summary 취소/실패 목록 조회
   * @request GET:/history/cancel/list
   * @response `200` `CancelListData` OK
   */
  cancelList = (
    query: {
      historyListRequestDto: HistoryListRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<CancelListData, any>({
      path: `/history/cancel/list`,
      method: "GET",
      query: query,
      ...params,
    });
}
