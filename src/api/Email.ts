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
  EmailAuthRequestDto,
  EmailValidRequestDto,
  SendCodeData,
  VerifyCodeData,
} from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class Email<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 이메일 인증
   * @name VerifyCode
   * @summary 이메일 인증 확인
   * @request POST:/email/valid
   * @response `200` `VerifyCodeData` OK
   */
  verifyCode = (data: EmailValidRequestDto, params: RequestParams = {}) =>
    this.request<VerifyCodeData, any>({
      path: `/email/valid`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 이메일 인증
   * @name SendCode
   * @summary 이메일 인증 요청
   * @request POST:/email/auth
   * @response `200` `SendCodeData` OK
   */
  sendCode = (data: EmailAuthRequestDto, params: RequestParams = {}) =>
    this.request<SendCodeData, any>({
      path: `/email/auth`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
