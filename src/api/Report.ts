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
  BoardData,
  ReportBoardRequestDto,
  ReportUserRequestDto,
  UserData,
} from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class Report<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 신고
   * @name User
   * @summary 유저 신고하기
   * @request POST:/report/user
   * @response `200` `UserData` OK
   */
  user = (data: ReportUserRequestDto, params: RequestParams = {}) =>
    this.request<UserData, any>({
      path: `/report/user`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 신고
   * @name Board
   * @summary 게시글 신고하기
   * @request POST:/report/board
   * @response `200` `BoardData` OK
   */
  board = (data: ReportBoardRequestDto, params: RequestParams = {}) =>
    this.request<BoardData, any>({
      path: `/report/board`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
