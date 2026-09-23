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
  Create2Data,
  Delete1Data,
  DeliveryDetailRequestDto,
  DeliveryListRequestDto,
  DeliverySaveRequestDto,
  DeliveryUpdateRequestDto,
  Detail1Data,
  List3Data,
  MyBoardDeliveryListRequestDto,
  MyListData,
  Update1Data,
} from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class Delivery<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 이동 경로 게시글
   * @name Detail1
   * @summary 이동 경로 게시글 상세 조회
   * @request GET:/delivery
   * @response `200` `Detail1Data` OK
   */
  detail1 = (
    query: {
      deliveryDetailRequestDto: DeliveryDetailRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<Detail1Data, any>({
      path: `/delivery`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이동 경로 게시글
   * @name Create2
   * @summary 이동 경로 게시글 등록
   * @request POST:/delivery
   * @response `200` `Create2Data` OK
   */
  create2 = (data: DeliverySaveRequestDto, params: RequestParams = {}) =>
    this.request<Create2Data, any>({
      path: `/delivery`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이동 경로 게시글
   * @name Update1
   * @summary 이동 경로 게시글 수정
   * @request PATCH:/delivery
   * @response `200` `Update1Data` OK
   */
  update1 = (data: DeliveryUpdateRequestDto, params: RequestParams = {}) =>
    this.request<Update1Data, any>({
      path: `/delivery`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이동 경로 게시글
   * @name MyList
   * @summary 내 게시글 이동 경로 목록 조회
   * @request GET:/delivery/me/list
   * @response `200` `MyListData` OK
   */
  myList = (
    query: {
      myBoardDeliveryListRequestDto: MyBoardDeliveryListRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<MyListData, any>({
      path: `/delivery/me/list`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이동 경로 게시글
   * @name List3
   * @summary 이동 경로 게시글 목록 조회
   * @request GET:/delivery/list
   * @response `200` `List3Data` OK
   */
  list3 = (
    query: {
      deliveryListRequestDto: DeliveryListRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<List3Data, any>({
      path: `/delivery/list`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이동 경로 게시글
   * @name Delete1
   * @summary 이동 경로 게시글 삭제
   * @request DELETE:/delivery/{id}
   * @response `200` `Delete1Data` OK
   */
  delete1 = (id: number, params: RequestParams = {}) =>
    this.request<Delete1Data, any>({
      path: `/delivery/${id}`,
      method: "DELETE",
      ...params,
    });
}
