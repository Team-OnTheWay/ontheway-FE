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

import type { ProcessData, ProcessPayload } from "./data-contracts";
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
}
