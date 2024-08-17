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
import SearchResultsPage from './pages/SearchResultsPage';
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
import SocialLogin from './pages/SocialLogin.jsx';
import PaymentPage from './pages/payments.jsx';
import MyPostsPage from './pages/MyPosts.jsx';
import Resign from './pages/Resign.jsx';
import RecoverPassword from './pages/RecoverPassword.jsx';
import CreateSeries from './pages/CreateSeries.jsx';
import EditSeries from './pages/EditSeries.jsx';

function App() {
  return (
    <div>
      <SearchProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainContent />} />

              {/* Auth */}
              <Route path="sign-up" element={<SignUp />} />
              <Route path="login" element={<Login />} />
              <Route path="social" element={<SocialLogin />} />
              <Route path="logout" element={<Logout />} />
              <Route path="recover/password" element={<RecoverPassword />} />
              <Route path="resign" element={<Resign />} />

              {/* User */}
              <Route path="profile" element={<Profile />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />

              {/* Notification */}
              <Route path="notifications" element={<NotificationsPage />} />
              <Route
                path="notification-settings"
                element={<NotificationSettings />}
              />

              {/* Channel */}
              <Route path="channels" element={<GetChannelsComponent />} />
              <Route path="channel/:id" element={<FindChannel />} />
              <Route path="channel/create" element={<CreateChannel />} />
              <Route
                path="channel/:channelId/update"
                element={<UpdateChannel />}
              />
              <Route
                path="channel/:channelId/insights"
                element={<ChannelInsights />}
              />
              <Route
                path="channel/:channelId/insights/daily"
                element={<DailyInsights />}
              />
              <Route
                path="channel/:channelId/insights/monthly"
                element={<MonthlyInsights />}
              />

              {/* Series */}
              <Route path="series/my" element={<MySeriesPage />} />
              <Route
                path="series/:seriesId/my"
                element={<GetMySeriesDetail />}
              />
              <Route path="series/:seriesId" element={<GetSeriesDetail />} />
              <Route
                path="series/create/:channelId"
                element={<CreateSeries />}
              />
              <Route path="series/:seriesId/update" element={<EditSeries />} />

              {/* Post */}
              <Route path="posts/my" element={<MyPostsPage />} />
              <Route path="posts" element={<CategoryPostView />} />
              <Route path="post/:postId" element={<PostDetailsPage />} />
              <Route path="post/create/:channelId" element={<PostPage />} />
              <Route path="post/:postId/edit" element={<PostEditPage />} />

              {/* Subscribe */}
              <Route
                path="subscribes/channels"
                element={<GetSubscribeChannels />}
              />
              <Route
                path="subscribes/posts"
                element={<GetPostsFromSubscribeChannels />}
              />

              {/* Library */}
              <Route path="library" element={<LibraryPage />} />
              <Route
                path="library/purchases"
                element={<PurchasedPostsPage />}
              />

              {/* Search */}
              <Route path="search-results" element={<SearchResultsPage />} />

              {/* Purchase */}
              <Route path="purchasesPost" element={<PurchasePost />} />

              {/* Point */}
              <Route path="points" element={<PointHistoryPage />} />
              <Route path="point/charge" element={<PaymentPage />} />
            </Route>
          </Routes>
        </Router>
      </SearchProvider>
    </div>
  );
}

export default App;
