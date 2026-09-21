import './App.css'
 
// ===== 컴포넌트 데모 (전부 주석 처리) =====
// import CustomButton from './components/CustomButton.tsx'
import CustomProfile from './components/CustomProfile.tsx'
// import CustomChips from './components/CustomChips.tsx'
import CustomProfileCard from './components/CustomProfileCard.tsx'
// import TextField from './components/TextField.tsx'
import TextArea from './components/TextArea.tsx'
import TimeInput from './components/TimeInput.tsx'
// import Dropdown from './components/Dropdown.tsx'
import DateInput from './components/DateInput.tsx'
// import EmptyState from './components/EmptyState.tsx'
// import CustomReviewCard from './components/CustomReviewCard.tsx'
// import CustomProductCard from './components/CustomProductCard.tsx'
// import CustomDeliveryCard from './components/CustomDeliveryCard.tsx'
// import CustomDiv from './components/CustomDiv.tsx'
// 최인하 컴포넌트
// import CustomTopAppBar from './components/CustomTopAppBar.tsx'
// import CustomNavBar from './components/CustomNavBar.tsx'
// import CustomNavIcon from './components/CustomNavIcon.tsx'
// import CustomList from './components/CustomList.tsx'
// import CustomFilterChip from './components/CustomFilterChip.tsx'
// import CustomCheckbox from './components/CustomCheckbox.tsx'
// import CustomTab from './components/CustomTab.tsx'
// import CustomFab from './components/CustomFab.tsx'
// import CustomAccordion from './components/CustomAccordion.tsx'
 
// ===== 페이지 =====
import LoginPage from './pages/CustomLoginPage.tsx'
import SignUpPage from './pages/CustomSignUpPage.tsx'
import Agree from './pages/Agree.tsx'
import FindId from './pages/FindId'
import FindPw from './pages/FindPw'
import HomePage from './pages/CustomHomePage.tsx'
import RouteDetailPage from './pages/CustomRouteDetailPage.tsx'
import ReportUserPage from './pages/CustomReportUserPage.tsx'
import ReportPostPage from './pages/CustomReportPostPage.tsx'
import Request from './pages/Request.tsx'
import CreateRequest from './pages/CreateRequest.tsx'
import RequestDetail from './pages/RequestDetail.tsx'
import PathSetup from './pages/PathSetup.tsx'
import RouteDetailWaitingPage from './pages/CustomRouteDetailPage_waiting.tsx'
import UsageHistory from './pages/UsageHistory.tsx'
import MyPosts from './pages/MyPosts.tsx'
import MyPage from './pages/CustomMyPage.tsx'
import ProfileEdit from './pages/CustomProfileEditPage.tsx'
import ReviewPage from './pages/CustomReviewPage.tsx'
import ReviewWritePage from './pages/CustomReviewWritePage.tsx'
import WithdrawlPage from './pages/CustomWithdrawlPage.tsx'
 
function App() {
  return (
    <>
      <TextArea label="상세 내용" borderColor="lightGray"/>
      <DateInput label="날짜" borderColor="lightGray" />
      <TimeInput borderColor="gray" backgroundColor="white"/>

      <CustomProfileCard
            width={361}
            nickname="하늘고양이"
            date="2026.09.08"
            rateing={0}
            review={0}
            chipElement={null}
            profileElement={<CustomProfile width={16} height={20} strok="#FD5D35" strokWidth={2} diameter={40} backgroundColor="#FEF1ED" />}
        />

      {/* 1. 로그인 */}
      <LoginPage />
      <br />
      {/* 2. 회원가입 */}
      <SignUpPage />
      <br />
      {/* 3. 약관동의 */}
      <Agree />
      <br />
      {/* 4. 아이디찾기 */}
      <FindId />
      <br />
      {/* 5. 비밀번호찾기 */}
      <FindPw />
      <br />
      {/* 6. 홈화면 */}
      <HomePage />
      <br />
      {/* 7. 경로상세조회 */}
      <RouteDetailPage />
      <br />
      {/* 8. 유저신고 */}
      <ReportUserPage />
      <br />
      {/* 9. 게시글신고 */}
      <ReportPostPage />
      <br />
      {/* 10. 요청하기 */}
      <Request />
      <br />
      {/* 11. 의뢰새글작성 */}
      <CreateRequest />
      <br />
      {/* 12. 물품 게시글상세 */}
      <RequestDetail />
      <br />
      {/* 13. 경로등록 */}
      <PathSetup />
      <br />
      {/* 14. 게시자:경로상세조회 */}
      <RouteDetailWaitingPage />
      <br />
      {/* 15. 이용내역 */}
      <UsageHistory />
      <br />
      {/* 16~17. 내 게시글 (가는길 / 배송의뢰 탭) */}
      <MyPosts />
      <br />
      {/* 18. 마이페이지 */}
      <MyPage />
      <br />
      {/* 19. 프로필작성 */}
      <ProfileEdit />
      <br />
      {/* 20. 후기조회 */}
      <ReviewPage />
      <br />
      {/* 21. 후기작성 */}
      <ReviewWritePage />
      <br />
      {/* 22. 회원탈퇴 */}
      <WithdrawlPage />
    </>
  )
}
 
export default App
 