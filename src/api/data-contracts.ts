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

export interface MemberSaveRequestDto {
  /**
   * 회원 아이디
   * @minLength 1
   */
  userId: string;
  /**
   * 회원 이름
   * @minLength 1
   */
  userName: string;
  /**
   * 회원 생일
   * @minLength 1
   */
  birthday: string;
  /**
   * 회원 이메일
   * @minLength 1
   */
  email: string;
  /**
   * 회원 비밀번호
   * @minLength 1
   */
  password: string;
  /**
   * 회원 닉네임
   * @minLength 1
   */
  nickName: string;
}

export interface ApiResponseObject {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: any;
}

export interface TokenReissueRequestDto {
  /**
   * 리프레시 토큰
   * @minLength 1
   */
  refreshToken: string;
}

export interface ApiResponseMemberLoginResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: MemberLoginResponseDto;
}

export interface MemberLoginResponseDto {
  /** 액세스 토큰 */
  accessToken?: string;
  /** 리프레시 토큰 */
  refreshToken?: string;
  /**
   * 로그인 시간
   * @format date-time
   */
  createdAt?: string;
}

export interface ApiResponseVoid {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: any;
}

export interface MemberFindPasswordRequestDto {
  /**
   * 아이디
   * @minLength 1
   */
  accountId: string;
  /**
   * 이메일
   * @minLength 1
   */
  email: string;
}

export interface MemberFindIdRequestDto {
  /**
   * 이메일
   * @minLength 1
   */
  email: string;
  /** 인증코드 */
  validCode?: string;
}

export interface MemberCheckIdReqeustDto {
  /** 회원 아이디 */
  userId?: string;
}

export interface ReviewSaveRequestDto {
  /**
   * 게시글 ID
   * @format int64
   */
  boardId?: number;
  /**
   * 평점
   * @format double
   */
  rating?: number;
  /** 후기 내용 */
  content?: string;
}

export interface RequestSaveRequestDto {
  /**
   * 배달 ID
   * @format int64
   */
  deliveryId?: number;
  /**
   * 물품 ID
   * @format int64
   */
  productId?: number;
}

export interface ReportUserRequestDto {
  /**
   * 신고할 유저 ID
   * @format int64
   */
  userId?: number;
  /**
   * 신고 유형 (최대 3개)
   * @uniqueItems true
   */
  categories?: (
    | "PROHIBITED_ITEM"
    | "INFO_MISMATCH"
    | "DUPLICATE_POSTING"
    | "ADVERTISEMENT"
    | "SCHEDULE_VIOLATION"
    | "NO_RESPONSE"
    | "UNFAIR_PAYMENT_DEMAND"
    | "ITEM_DAMAGE"
    | "FALSE_IDENTITY"
    | "SAFETY_THREAT"
    | "ABUSIVE_LANGUAGE"
  )[];
  /** 신고 내용 */
  content?: string;
}

export interface ReportBoardRequestDto {
  /**
   * 신고할 게시글 ID
   * @format int64
   */
  boardId?: number;
  /** 게시글 종류 (PRODUCT 또는 DELIVERY) */
  boardType?: "USER" | "PRODUCT" | "DELIVERY";
  /**
   * 신고 유형 (최대 3개)
   * @uniqueItems true
   */
  categories?: (
    | "PROHIBITED_ITEM"
    | "INFO_MISMATCH"
    | "DUPLICATE_POSTING"
    | "ADVERTISEMENT"
    | "SCHEDULE_VIOLATION"
    | "NO_RESPONSE"
    | "UNFAIR_PAYMENT_DEMAND"
    | "ITEM_DAMAGE"
    | "FALSE_IDENTITY"
    | "SAFETY_THREAT"
    | "ABUSIVE_LANGUAGE"
  )[];
  /** 신고 내용 */
  content?: string;
}

export interface ProductSaveRequestDto {
  /** 상품명 */
  productName?: string;
  /** 배송지 주소 */
  productDeliveryAddress?: string;
  /** 물건 수령지(productDeliveryAddress)의 위도 */
  productDeliveryLatitude?: number;
  /** 물건 수령지(productDeliveryAddress)의 경도 */
  productDeliveryLongitude?: number;
  /** 도착지 주소 */
  endAddress?: string;
  /** 도착지(endAddress)의 위도 */
  endLatitude?: number;
  /** 도착지(endAddress)의 경도 */
  endLongitude?: number;
  /** 상품 정보 */
  productInfo?: string;
  /**
   * 배송비
   * @format int32
   */
  deliveryFee?: number;
  /**
   * 수령 예정 시간
   * @format date-time
   */
  receivingTime?: string;
  /**
   * 희망 배송 시간
   * @format date-time
   */
  desiredDeliveryTime?: string;
  /** 결제 방식 */
  paymentType?: "PREPAID" | "POSTPAID";
}

export interface ApiResponseProductSaveResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: ProductSaveResponseDto;
}

export interface ProductSaveResponseDto {
  /**
   * 등록된 물품 ID
   * @format int64
   */
  productId?: number;
  /**
   * 생성 일시
   * @format date-time
   */
  createdAt?: string;
}

export interface ProcessRequestDto {
  /**
   * 배송 ID
   * @format int64
   */
  deliveryId?: number;
  /**
   * 요청 ID
   * @format int64
   */
  requestId?: number;
  /** 배송 실패 사유 */
  failReason?: string;
  /** 배송 취소 사유 */
  cancelReason?: string;
}

export interface ApiResponseProcessResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: ProcessResponseDto;
}

export interface ProcessResponseDto {
  /**
   * 생성 일시
   * @format date-time
   */
  createdAt?: string;
  /** 처리 후 배송 상태 */
  deliveryStatus?:
    | "MATCHING_WAITING"
    | "PICKING_UP"
    | "DELIVERY_WAITING"
    | "DELIVERING"
    | "COMPLETION_REQUESTED"
    | "COMPLETED"
    | "FAILED"
    | "CANCELED"
    | "REJECTED";
}

export interface EmailValidRequestDto {
  /**
   * 이메일
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * 인증 코드
   * @minLength 1
   */
  authCode: string;
  /** 이메일 인증 용도 */
  purpose: "SIGN_UP" | "FIND_ID" | "FIND_PASSWORD" | "CHANGE_EMAIL";
}

export interface EmailAuthRequestDto {
  /**
   * 이메일
   * @format email
   * @minLength 1
   */
  email: string;
  /** 이메일 인증 용도 */
  purpose: "SIGN_UP" | "FIND_ID" | "FIND_PASSWORD" | "CHANGE_EMAIL";
}

export interface DeliverySaveRequestDto {
  /** 출발지 주소 */
  startAddress?: string;
  /** 도착지 주소 */
  endAddress?: string;
  /**
   * 배송 일시
   * @format date-time
   */
  deliveryDate?: string;
  /** 추가 정보 */
  addInfo?: string;
  /**
   * 희망금액
   * @format int32
   */
  hopePrice?: number;
  /**
   * 배송 예정 시간
   * @format date-time
   */
  estimatedDeliveryTime?: string;
}

export interface ApiResponseDeliverySaveResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: DeliverySaveResponseDto;
}

export interface DeliverySaveResponseDto {
  /**
   * 생성 일시
   * @format date-time
   */
  createdAt?: string;
}

export interface MemberUpdateInfoRequestDto {
  /** 닉네임 */
  nickName?: string;
  /** 새로운 비밀번호 */
  newPassword?: string;
  /** 이메일 */
  newEmail?: string;
  /** 생일 */
  newBirthday?: string;
}

export interface ProductUpdateRequestDto {
  /**
   * 상품 ID
   * @format int64
   */
  productId?: number;
  /** 상품명 */
  productName?: string;
  /** 배송지 주소 */
  productDeliveryAddress?: string;
  /** 물건 수령지(productDeliveryAddress)의 위도 */
  productDeliveryLatitude?: number;
  /** 물건 수령지(productDeliveryAddress)의 경도 */
  productDeliveryLongitude?: number;
  /** 도착지 주소 */
  endAddress?: string;
  /** 도착지(endAddress)의 위도 */
  endLatitude?: number;
  /** 도착지(endAddress)의 경도 */
  endLongitude?: number;
  /** 상품 정보 */
  productInfo?: string;
  /**
   * 배송비
   * @format int32
   */
  deliveryFee?: number;
  /**
   * 수령 예정 시간
   * @format date-time
   */
  receivingTime?: string;
  /**
   * 희망 배송 시간
   * @format date-time
   */
  desiredDeliveryTime?: string;
  /** 결제 방식 */
  paymentType?: "PREPAID" | "POSTPAID";
}

export interface ApiResponseProductUpdateResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: ProductUpdateResponseDto;
}

export interface ProductUpdateResponseDto {
  /**
   * 수정 일시
   * @format date-time
   */
  updatedAt?: string;
}

export interface DeliveryUpdateRequestDto {
  /**
   * 배송 ID
   * @format int64
   */
  deliveryId?: number;
  /** 출발지 주소 */
  startAddress?: string;
  /** 도착지 주소 */
  endAddress?: string;
  /**
   * 배송 일시
   * @format date-time
   */
  deliveryDate?: string;
  /** 추가 정보 */
  addInfo?: string;
  /**
   * 희망금액
   * @format int32
   */
  hopePrice?: number;
  /**
   * 배송 예정 시간
   * @format date-time
   */
  estimatedDeliveryTime?: string;
}

export interface ApiResponseDeliveryUpdateResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: DeliveryUpdateResponseDto;
}

export interface DeliveryUpdateResponseDto {
  /**
   * 수정 일시
   * @format date-time
   */
  updatedAt?: string;
}

export interface ReviewListRequestDto {
  /**
   * 페이지 번호
   * @format int32
   */
  page?: number;
  /**
   * 페이지당 항목수
   * @format int32
   */
  size?: number;
}

export interface ProductDetailRequestDto {
  /**
   * 상품 ID
   * @format int64
   */
  productId?: number;
}

export interface ApiResponseProductDetailResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: ProductDetailResponseDto;
}

export interface ProductDetailResponseDto {
  /**
   * 물품 ID
   * @format int64
   */
  productId?: number;
  /** 물품명 */
  productName?: string;
  /** 사용자 이미지 */
  userImage?: string;
  /** 사용자 이름 */
  userName?: string;
  /** 물품 수령지(주소) */
  productDeliveryAddress?: string;
  /** 물품 수령지 위도. 수정 요청의 productDeliveryLatitude 와 같은 값 */
  productDeliveryLatitude?: number;
  /** 물품 수령지 경도. 수정 요청의 productDeliveryLongitude 와 같은 값 */
  productDeliveryLongitude?: number;
  /** 배송 목적지 */
  deliveryDestination?: string;
  /** 배송 목적지 위도. 수정 요청의 endLatitude 와 같은 값 */
  endLatitude?: number;
  /** 배송 목적지 경도. 수정 요청의 endLongitude 와 같은 값 */
  endLongitude?: number;
  /** 물품 정보 */
  productInfo?: string;
  /**
   * 배송료
   * @format int32
   */
  deliveryFee?: number;
  /** 물건 수령 시간 */
  receivingTime?: string;
  /** 희망배도착시간 */
  desiredDeliveryTime?: string;
  /** 결제 방식 */
  paymentType?: string;
  /**
   * 게시 등록일
   * @format date-time
   */
  createdAt?: string;
}

export interface ProductListRequestDto {
  /** 검색어 */
  keyword?: string;
  /**
   * 페이지 번호
   * @format int32
   */
  page?: number;
  /**
   * 페이지당 항목수
   * @format int32
   */
  size?: number;
}

export interface ApiResponseProductListResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: ProductListResponseDto;
}

export interface Product {
  /**
   * 물품 게시글 ID
   * @format int64
   */
  productId?: number;
  /**
   * 물품 일련번호
   * @format int64
   */
  productSerialNumber?: number;
  /** 물품 이름 */
  productName?: string;
  /**
   * 배송비
   * @format int32
   */
  deliveryPrice?: number;
}

export interface ProductListResponseDto {
  /** 물품 목록 */
  productList?: Product[];
  /** 다음 페이지 존재 여부 */
  hasNext?: boolean;
}

export interface HistoryListRequestDto {
  /**
   * 페이지 번호
   * @format int32
   */
  page?: number;
  /**
   * 페이지당 항목수
   * @format int32
   */
  size?: number;
}

export interface ApiResponseHistoryListResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: HistoryListResponseDto;
}

export interface HistoryList {
  /**
   * 배송 ID
   * @format int64
   */
  deliveryId?: number;
  /** 배송 상태 */
  deliveryStatus?:
    | "MATCHING_WAITING"
    | "PICKING_UP"
    | "DELIVERY_WAITING"
    | "DELIVERING"
    | "COMPLETION_REQUESTED"
    | "COMPLETED"
    | "FAILED"
    | "CANCELED"
    | "REJECTED";
  /** 게시글 타입 */
  boardType?: "DELIVERY" | "REQUEST" | "FAILED_AND_CANCELLED";
  /** 출발지 주소 */
  startAddress?: string;
  /** 도착지 주소 */
  endAddress?: string;
  /**
   * 배송 일시
   * @format date-time
   */
  deliveryDate?: string;
  /**
   * 배송금액
   * @format int32
   */
  deliveryFee?: number;
}

export interface HistoryListResponseDto {
  historyList?: HistoryList[];
}

export interface DeliveryDetailRequestDto {
  /**
   * 배송 ID
   * @format int64
   */
  deliveryId?: number;
}

export interface ApiResponseDeliveryDetailResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: DeliveryDetailResponseDto;
}

export interface DeliveryCancel {
  /** 배송 취소 사유 */
  cancelReason?: string;
}

export interface DeliveryDetailResponseDto {
  /**
   * 배송 ID
   * @format int64
   */
  deliveryId?: number;
  /** 현재 배송 상태 */
  currentDeliveryStatus?:
    | "MATCHING_WAITING"
    | "PICKING_UP"
    | "DELIVERY_WAITING"
    | "DELIVERING"
    | "COMPLETION_REQUESTED"
    | "COMPLETED"
    | "FAILED"
    | "CANCELED"
    | "REJECTED";
  /** 출발지 주소 */
  startAddress?: string;
  /** 도착지 주소 */
  endAddress?: string;
  /**
   * 배송 일시
   * @format date-time
   */
  deliveryDate?: string;
  /** 추가 정보 */
  addInfo?: string;
  /**
   * 희망금액
   * @format int32
   */
  hopePrice?: number;
  /**
   * 배송 예정 시간
   * @format date-time
   */
  estimatedDeliveryTime?: string;
  /**
   * 생성 일시
   * @format date-time
   */
  createdAt?: string;
  /** 배송 상태 변경 이력 목록 */
  deliveryStatusHistory?: DeliveryStatusHistory[];
  /** 사용자 프로필 이미지 URL */
  userImage?: string;
  /** 사용자 이름 */
  userName?: string;
  /** 요청자 정보 */
  requesterInfo?: RequesterInfo;
  /** 배송 실패 정보 */
  deliveryFail?: DeliveryFail;
  /** 배송 취소 정보 */
  deliveryCancel?: DeliveryCancel;
  /** 배송완료확인요청 정보 */
  deliverySuccessCheck?: DeliverySuccessCheck;
}

export interface DeliveryFail {
  /** 배송 실패 사유 */
  failReason?: string;
}

export interface DeliveryStatusHistory {
  /** 배송 상태 */
  deliveryStatus?:
    | "MATCHING_WAITING"
    | "PICKING_UP"
    | "DELIVERY_WAITING"
    | "DELIVERING"
    | "COMPLETION_REQUESTED"
    | "COMPLETED"
    | "FAILED"
    | "CANCELED"
    | "REJECTED";
  /**
   * 상태 변경 일시
   * @format date-time
   */
  deliveryDate?: string;
}

export interface DeliverySuccessCheck {
  /** 배송완료 확인요청 이미지 URL */
  deliverySuccessCheckImage?: string;
}

export interface RequesterInfo {
  /** 사용자 프로필 이미지 URL */
  userImage?: string;
  /** 사용자 이름 */
  userName?: string;
  /** 물품 수령지(주소) */
  productDeliveryAddress?: string;
  /** 배송 목적지 */
  deliveryDestination?: string;
  /** 물품 정보 */
  productInfo?: string;
  /**
   * 배송비
   * @format int32
   */
  deliveryFee?: number;
  /**
   * 물건 수령 시간
   * @format date-time
   */
  receivingTime?: string;
  /**
   * 희망 배송 도착 시간
   * @format date-time
   */
  desiredDeliveryTime?: string;
  /** 결제 방식 */
  paymentType?: "PREPAID" | "POSTPAID";
}

export interface MyBoardDeliveryListRequestDto {
  /**
   * 만족도
   * @format double
   */
  rating?: number;
  /** 배송출발지 */
  startAddress?: string;
  /** 배송목적지 */
  endAddress?: string;
  /**
   * 희망금액
   * @format int32
   */
  hopePrice?: number;
  /**
   * 페이지 번호
   * @format int32
   */
  page?: number;
  /**
   * 페이지당 항목수
   * @format int32
   */
  size?: number;
}

export interface ApiResponseMyBoardDeliveryListResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: MyBoardDeliveryListResponseDto;
}

export interface DeliveryList {
  /**
   * 배송 ID
   * @format int64
   */
  deliveryId?: number;
  /** 출발지 */
  startAddress?: string;
  /** 배송목적지 */
  endAddress?: string;
  /**
   * 희망금액
   * @format int32
   */
  hopePrice?: number;
  /**
   * 배송 의뢰 요청글 수
   * @format int32
   */
  requestCount?: number;
  /**
   * 배송예정시간
   * @format date-time
   */
  deliveryDate?: string;
}

export interface MyBoardDeliveryListResponseDto {
  /** 의뢰 요청 목록 */
  deliveryList?: DeliveryList[];
}

export interface DeliveryListRequestDto {
  /**
   * 만족도
   * @format double
   */
  rating?: number;
  /** 배송출발지 */
  startAddress?: string;
  /** 배송목적지 */
  endAddress?: string;
  /**
   * 희망금액
   * @format int32
   */
  hopePrice?: number;
  /**
   * 페이지 번호
   * @format int32
   */
  page?: number;
  /**
   * 페이지당 항목수
   * @format int32
   */
  size?: number;
}

export interface ApiResponseDeliveryListResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: DeliveryListResponseDto;
}

export interface DeliveryListResponseDto {
  /** 의뢰 요청 목록 */
  deliveryList?: DeliveryList[];
}

export interface MemberDeleteAccountRequestDto {
  /**
   * 비밀번호 확인
   * @minLength 1
   */
  password: string;
}

export interface ApiResponseProductDeleteResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: ProductDeleteResponseDto;
}

export interface ProductDeleteResponseDto {
  /**
   * 수정 일시
   * @format date-time
   */
  updatedAt?: string;
}

export interface ApiResponseDeliveryDeleteResponseDto {
  success?: boolean;
  /** @format int32 */
  status?: number;
  message?: string;
  data?: DeliveryDeleteResponseDto;
}

export interface DeliveryDeleteResponseDto {
  /**
   * 수정 일시
   * @format date-time
   */
  updatedAt?: string;
}

export type SignUpData = ApiResponseObject;

export type ReissueData = ApiResponseMemberLoginResponseDto;

export type LogoutData = ApiResponseVoid;

export type FindPasswordData = ApiResponseObject;

export type FindIdData = ApiResponseObject;

export type CheckIdData = ApiResponseObject;

export type CreateData = ApiResponseObject;

export type RegisterData = ApiResponseObject;

export type UserData = ApiResponseObject;

export type BoardData = ApiResponseObject;

export type DetailData = ApiResponseProductDetailResponseDto;

export type Create1Data = ApiResponseProductSaveResponseDto;

export type UpdateData = ApiResponseProductUpdateResponseDto;

export interface ProcessPayload {
  processRequestDto: ProcessRequestDto;
  /** @format binary */
  image?: File;
}

export type ProcessData = ApiResponseProcessResponseDto;

export type VerifyCodeData = ApiResponseObject;

export type SendCodeData = ApiResponseObject;

export type Detail1Data = ApiResponseDeliveryDetailResponseDto;

export type Create2Data = ApiResponseDeliverySaveResponseDto;

export type Update1Data = ApiResponseDeliveryUpdateResponseDto;

export type InfoData = ApiResponseObject;

export interface UpdateInfoPayload {
  dto: MemberUpdateInfoRequestDto;
  /** @format binary */
  image?: File;
}

export type UpdateInfoData = ApiResponseObject;

export type RatingsData = ApiResponseObject;

export type ListData = ApiResponseObject;

export type DeliveryRequestListData = ApiResponseObject;

export type List1Data = ApiResponseProductListResponseDto;

export type RequestListData = ApiResponseHistoryListResponseDto;

export type List2Data = ApiResponseHistoryListResponseDto;

export type DeliveryListData = ApiResponseHistoryListResponseDto;

export type CancelListData = ApiResponseHistoryListResponseDto;

export type HealthData = string;

export type MyListData = ApiResponseMyBoardDeliveryListResponseDto;

export type List3Data = ApiResponseDeliveryListResponseDto;

export type DeleteAccountData = ApiResponseObject;

export type DeleteData = ApiResponseProductDeleteResponseDto;

export type Delete1Data = ApiResponseDeliveryDeleteResponseDto;
