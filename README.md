# <img src="https://github.com/user-attachments/assets/c9ce2feb-8b0e-42eb-ba95-0e16eec610cb" alt="favicon" width="30" height="30"> TalentVerse FE

_TalentVerse FE Repository_

&nbsp;

## 💻 **기술 스택**

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white">

&nbsp;

## 📁 **폴더 구조 및 환경 변수**

<details>

**<summary>Directory Structure</summary>**

```

📦src
 ┣ 📂apis
 ┃ ┣ auth.js
 ┃ ┣ aws.js
 ┃ ┣ axiosInstance.js
 ┃ ┣ channel.js
 ┃ ┣ library.js
 ┃ ┣ main.js
 ┃ ┣ notifications.js
 ┃ ┣ paymentPage.js
 ┃ ┣ payments.js
 ┃ ┣ pointhistory.js
 ┃ ┣ post.js
 ┃ ┣ purchase.js
 ┃ ┣ search.js
 ┃ ┣ series.js
 ┃ ┣ sse.js
 ┃ ┗ user.js
 ┣ 📂assets
 ┃ ┗ sample.jpg
 ┣ 📂components
 ┃ ┣ 📂editor
 ┃ ┃ ┗ TextEditorForm.jsx
 ┃ ┣ ChannelInsight.jsx
 ┃ ┣ Footer.jsx
 ┃ ┣ GetChannels.jsx
 ┃ ┣ Header.jsx
 ┃ ┣ Pagination.jsx
 ┃ ┗ Testpagenation.jsx
 ┣ 📂context
 ┃ ┣ AuthContext.js
 ┃ ┗ SearchContext.js
 ┣ 📂layouts
 ┃ ┗ Layout.jsx
 ┣ 📂pages
 ┃ ┣ CategoryPostView.jsx
 ┃ ┣ ChangePassword.jsx
 ┃ ┣ ChannelDetailsPage.jsx
 ┃ ┣ CreateChannel.jsx
 ┃ ┣ CreateSeries.jsx
 ┃ ┣ DailyInsights.jsx
 ┃ ┣ EditProfile.jsx
 ┃ ┣ EditSeries.jsx
 ┃ ┣ FindChannel.jsx
 ┃ ┣ GetMySeriesDetail.jsx
 ┃ ┣ GetPostsFromSubscribeChannels.jsx
 ┃ ┣ GetSeriesDetail.jsx
 ┃ ┣ GetSubscribeChannels.jsx
 ┃ ┣ Login.jsx
 ┃ ┣ Logout.jsx
 ┃ ┣ MainContent.jsx
 ┃ ┣ Mainlibrary.jsx
 ┃ ┣ Mainlibrarypurchase.jsx
 ┃ ┣ MonthlyInsights.jsx
 ┃ ┣ MyPosts.jsx
 ┃ ┣ MySeries.jsx
 ┃ ┣ NotificationSettings.jsx
 ┃ ┣ NotificationsPage.jsx
 ┃ ┣ payments.jsx
 ┃ ┣ PointHistory.jsx
 ┃ ┣ PostDetail.jsx
 ┃ ┣ PostEditPage.jsx
 ┃ ┣ PostPage.jsx
 ┃ ┣ Profile.jsx
 ┃ ┣ PurchasePost.jsx
 ┃ ┣ RecoverPassword.jsx
 ┃ ┣ Resign.jsx
 ┃ ┣ SearchResultsPage.jsx
 ┃ ┣ SignUp.jsx
 ┃ ┣ SocialLogin.jsx
 ┃ ┣ UpdateChannel.jsx
 ┃ ┗ UserPage.jsx
 ┣ 📂styles
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂editor
 ┃ ┃ ┃ ┗ TextEditorForm.css
 ┃ ┃ ┣ ChannelInsight.css
 ┃ ┃ ┣ GetChannels.css
 ┃ ┃ ┣ Header.css
 ┃ ┃ ┣ Pagination.css
 ┃ ┃ ┗ Testpagination.css
 ┃ ┗ 📂pages
 ┃ ┃ ┣ CategoryPostView.css
 ┃ ┃ ┣ ChangePassword.css
 ┃ ┃ ┣ ChannelDetailsPage.css
 ┃ ┃ ┣ CreateChannel.css
 ┃ ┃ ┣ CreateSeries.css
 ┃ ┃ ┣ EditProfile.css
 ┃ ┃ ┣ FindChannel.css
 ┃ ┃ ┣ GetPostsFromSubscribeChannels.css
 ┃ ┃ ┣ GetSubscribe.css
 ┃ ┃ ┣ Insights.css
 ┃ ┃ ┣ Login.css
 ┃ ┃ ┣ MainContent.css
 ┃ ┃ ┣ mainlibrary.css
 ┃ ┃ ┣ MyPosts.css
 ┃ ┃ ┣ MySeriesPage.css
 ┃ ┃ ┣ Notification.css
 ┃ ┃ ┣ NotificationSettings.css
 ┃ ┃ ┣ Payment.css
 ┃ ┃ ┣ PointHistory.css
 ┃ ┃ ┣ PostDetail.css
 ┃ ┃ ┣ PostEditPage.css
 ┃ ┃ ┣ PostPage.css
 ┃ ┃ ┣ Profile.css
 ┃ ┃ ┣ PurchasePost.css
 ┃ ┃ ┣ RecoverPassword.css
 ┃ ┃ ┣ Resign.css
 ┃ ┃ ┣ SeriesDetail.css
 ┃ ┃ ┣ SignUp.css
 ┃ ┃ ┗ UserDetail.css
 ┣ App.css
 ┣ App.jsx
 ┣ App.test.js
 ┣ index.css
 ┣ index.jsx
 ┣ logo.svg
 ┣ reportWebVitals.js
 ┗ setupTests.js

```

</details>
<details>

**<summary>env Example</summary>**

```
REACT_APP_API_URL=

REACT_APP_NAVER_SOCIAL_LOGIN=
REACT_APP_KAKAO_SOCIAL_LOGIN=
```

</details>

&nbsp;

## 시작 가이드

```

$ git clone https://github.com/Helpme0723/front-end.git
$ cd front-end
$ npm ci
$ npm run start

```

## 화면 구성

<table>
  <tbody>
    <tr>
      <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/3b3ca2f1-4e45-4b07-be1e-51afeb57b8d9">메인페이지</td>
     <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/be35c107-c893-47c8-b780-05f3ea7f2922">로그인화면</td>
    </tr>
   <tr>
    <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/56964e93-12ac-42f0-ba2f-ad56d0b2d4b2">포스트상세보기</td>
    <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/0eb7d5bd-8cf6-4fce-8d6f-375ac085dc17">포스트작성</td>
   </tr>
    <tr>
     <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/227c2c44-1176-4fc3-bd53-078030868381">포스트검색</td>
      <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/8ba27b6e-ace3-4abf-a56b-0aeb86ee614d">채널구독</td>
    </tr>
    <tr>
     <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/9a24bd7f-d28d-4d15-9f05-22a22f339b86">포스트구매 및 보관함</td>
     <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/6e69f2d6-0f4e-40b1-944a-567df41e9015">알림확인</td>
    </tr>
   <tr>
    <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/ec5034be-0a0a-4630-baa7-e8640ba9f76f">채널통계</td>
      <td align="center"><img width="1512" alt="스크린샷 2024-08-20 오후 12 30 18" src="https://github.com/user-attachments/assets/e003cdee-43a9-4c4f-9d9a-e6f8226dbabc">비밀번호변경</td>
   </tr>
  </tbody>
</table>
