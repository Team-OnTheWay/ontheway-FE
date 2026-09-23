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
  Create1Data,
  DeleteData,
  DetailData,
  List1Data,
  ProductDetailRequestDto,
  ProductListRequestDto,
  ProductSaveRequestDto,
  ProductUpdateRequestDto,
  UpdateData,
} from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class Product<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags 물품 게시글
   * @name Detail
   * @summary 물품 게시글 상세 조회
   * @request GET:/product
   * @response `200` `DetailData` OK
   */
  detail = (
    query: {
      productDetailRequestDto: ProductDetailRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<DetailData, any>({
      path: `/product`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 물품 게시글
   * @name Create1
   * @summary 물품 게시글 등록
   * @request POST:/product
   * @response `200` `Create1Data` OK
   */
  create1 = (data: ProductSaveRequestDto, params: RequestParams = {}) =>
    this.request<Create1Data, any>({
      path: `/product`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 물품 게시글
   * @name Update
   * @summary 물품 게시글 수정
   * @request PATCH:/product
   * @response `200` `UpdateData` OK
   */
  update = (data: ProductUpdateRequestDto, params: RequestParams = {}) =>
    this.request<UpdateData, any>({
      path: `/product`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 물품 게시글
   * @name List1
   * @summary 물품 게시글 목록 조회
   * @request GET:/product/list
   * @response `200` `List1Data` OK
   */
  list1 = (
    query: {
      productListRequestDto: ProductListRequestDto;
    },
    params: RequestParams = {},
  ) =>
    this.request<List1Data, any>({
      path: `/product/list`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags 물품 게시글
   * @name Delete
   * @summary 물품 게시글 삭제
   * @request DELETE:/product/{id}
   * @response `200` `DeleteData` OK
   */
  delete = (id: number, params: RequestParams = {}) =>
    this.request<DeleteData, any>({
      path: `/product/${id}`,
      method: "DELETE",
      ...params,
    });
}
