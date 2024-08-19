## 💻 **기술 스택**

**STACK**

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white">

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

---

## 시작 가이드

```

$ git clone https://github.com/Helpme0723/front-end.git
$ cd front-end
$ npm ci
$ npm run start

```

## 화면 구성
