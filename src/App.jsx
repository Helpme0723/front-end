import React from 'react';
import Layout from './layouts/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import Login from './pages/Login';
import Logout from './pages/Logout';
import SignUp from './pages/SignUp';
import MainContent from './pages/MainContent';
import CreateChannel from './pages/CreateChannel';
import LibraryPage from './pages/Mainlibrary';
import FindChannel from './pages/FindChannel';
import PurchasedPostsPage from './pages/Mainlibrarypurchase';
import GetSubscribeChannels from './pages/GetSubscribeChannels';
import GetPostsFromSubscribeChannels from './pages/GetPostsFromSubscribeChannels';
import PostDetailsPage from './pages/PostDetail';
import GetChannelsComponent from './components/GetChannels';
import ChannelInsights from './components/ChannelInsight';
import SearchResultsPage from './pages/SearchResultsPage'; // 검색 결과 페이지 추가
import { SearchProvider } from './context/SearchContext';
import CategoryPostView from './pages/CategoryPostView';
import PointHistoryPage from './pages/PointHistory.jsx';
import DailyInsights from './pages/DailyInsights';
import MonthlyInsights from './pages/MonthlyInsights';
import PurchasePost from './pages/PurchasePost';
import PostPage from './pages/PostPage';
import MySeriesPage from './pages/MySeries.jsx';
import UpdateChannel from './pages/UpdateChannel';
import PostEditPage from './pages/PostEditPage';
import GetMySeriesDetail from './pages/GetMySeriesDetail.jsx';
import GetSeriesDetail from './pages/GetSeriesDetail.jsx';
import NotificationsPage from './pages/NotificationsPage';
import NotificationSettings from './pages/NotificationSettings';

function App() {
  return (
    <div>
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainContent />} />
              {/* MainContent as the default page */}
              <Route path="login" element={<Login />} />
              <Route path="logout" element={<Logout />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="profile" element={<Profile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="notification-settings" element={<NotificationSettings />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="channel/create" element={<CreateChannel />} />
              <Route path="library" element={<LibraryPage />} />
              <Route path="channel/:id" element={<FindChannel />} />
              {/* <Route path="subscribe/posts" element={<GetSubscribeChannels />} /> */}
              <Route
                path="library/purchases"
                element={<PurchasedPostsPage />}
              />
              <Route path="/post/:postId" element={<PostDetailsPage />} />
              <Route
                path="subscribes/channels"
                element={<GetSubscribeChannels />}
              />
              <Route
                path="subscribes/posts"
                element={<GetPostsFromSubscribeChannels />}
              />
              <Route path="channels" element={<GetChannelsComponent />} />
              <Route
                path="channel/:channelId/insights"
                element={<ChannelInsights />}
              />
              <Route path="search-results" element={<SearchResultsPage />} />
              <Route
                path="channel/:channelId/insights"
                element={<ChannelInsights />}
              />
              <Route path="posts" element={<CategoryPostView />} />

              <Route path="points" element={<PointHistoryPage />} />
              <Route path="post/create/:channelId" element={<PostPage />} />
              <Route
                path="channel/:channelId/insights/daily"
                element={<DailyInsights />}
              />
              <Route
                path="channel/:channelId/insights/monthly"
                element={<MonthlyInsights />}
              />
               <Route path="notifications" element={<NotificationsPage />} />
              <Route path="purchasesPost" element={<PurchasePost />} />

              <Route path="series/my" element={<MySeriesPage />} />
              <Route
                path="/channel/:channelId/update"
                element={<UpdateChannel />}
              />
              {/* 내 시리즈 상세 조회 */}
              <Route
                path="series/:seriesId/my"
                element={<GetMySeriesDetail />}
              />
              {/* 타 유저 시리즈 상세 조회 */}
              <Route path="series/:seriesId" element={<GetSeriesDetail />} />
            </Route>
            <Route path="/post/:postId/edit" element={<PostEditPage />} />
          </Routes>
        </Router>
      </SearchProvider>
    </div>
  );
}

export default App;
