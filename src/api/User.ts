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
  CheckIdData,
  DeleteAccountData,
  FindIdData,
  FindPasswordData,
  InfoData,
  LogoutData,
  MemberCheckIdReqeustDto,
  MemberDeleteAccountRequestDto,
  MemberFindIdRequestDto,
  MemberFindPasswordRequestDto,
  MemberSaveRequestDto,
  RatingsData,
  ReissueData,
  SignUpData,
  TokenReissueRequestDto,
  UpdateInfoData,
  UpdateInfoPayload,
} from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class User<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 회원 관리
   * @name SignUp
   * @summary 회원가입
   * @request POST:/user/signup
   * @response `200` `SignUpData` OK
   */
  signUp = (data: MemberSaveRequestDto, params: RequestParams = {}) =>
    this.request<SignUpData, any>({
      path: `/user/signup`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name Reissue
   * @summary 토큰 재발급
   * @request POST:/user/reissue
   * @response `200` `ReissueData` OK
   */
  reissue = (data: TokenReissueRequestDto, params: RequestParams = {}) =>
    this.request<ReissueData, any>({
      path: `/user/reissue`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name Logout
   * @summary 로그아웃
   * @request POST:/user/logout
   * @response `200` `LogoutData` OK
   */
  logout = (params: RequestParams = {}) =>
    this.request<LogoutData, any>({
      path: `/user/logout`,
      method: "POST",
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name FindPassword
   * @summary 비밀번호 찾기
   * @request POST:/user/find/password
   * @response `200` `FindPasswordData` OK
   */
  findPassword = (
    data: MemberFindPasswordRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<FindPasswordData, any>({
      path: `/user/find/password`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name FindId
   * @summary 아이디 찾기
   * @request POST:/user/find/id
   * @response `200` `FindIdData` OK
   */
  findId = (data: MemberFindIdRequestDto, params: RequestParams = {}) =>
    this.request<FindIdData, any>({
      path: `/user/find/id`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name CheckId
   * @summary 아이디 중복검사
   * @request POST:/user/check/id
   * @response `200` `CheckIdData` OK
   */
  checkId = (data: MemberCheckIdReqeustDto, params: RequestParams = {}) =>
    this.request<CheckIdData, any>({
      path: `/user/check/id`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name Info
   * @summary 내 정보 조회
   * @request GET:/user/info
   * @response `200` `InfoData` OK
   */
  info = (params: RequestParams = {}) =>
    this.request<InfoData, any>({
      path: `/user/info`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name UpdateInfo
   * @summary 내 정보 수정
   * @request PATCH:/user/info
   * @response `200` `UpdateInfoData` OK
   */
  updateInfo = (data: UpdateInfoPayload, params: RequestParams = {}) =>
    this.request<UpdateInfoData, any>({
      path: `/user/info`,
      method: "PATCH",
      body: data,
      type: ContentType.FormData,
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name Ratings
   * @summary 내 후기 조회
   * @request GET:/user/ratings
   * @response `200` `RatingsData` OK
   */
  ratings = (params: RequestParams = {}) =>
    this.request<RatingsData, any>({
      path: `/user/ratings`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags 회원 관리
   * @name DeleteAccount
   * @summary 회원 탈퇴
   * @request DELETE:/user/account
   * @response `200` `DeleteAccountData` OK
   */
  deleteAccount = (
    data: MemberDeleteAccountRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<DeleteAccountData, any>({
      path: `/user/account`,
      method: "DELETE",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
