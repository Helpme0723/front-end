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
import LibraryPage from './pages/mainlibray';
import FindChannel from './pages/FindChannel';
import PurchasedPostsPage from './pages/mainlibrarypurchase';
import GetSubscribeChannels from './pages/GetSubscribeChannels';
import GetPostsFromSubscribeChannels from './pages/GetPostsFromSubscribeChannels';
import PostDetailsPage from './pages/PostDetail';
import GetChannelsComponent from './components/GetChannels';

function App() {
  return (
    <div>
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
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="channel/create" element={<CreateChannel />} />
            <Route path="library" element={<LibraryPage />} />
            <Route path="channel/:id" element={<FindChannel />} />
            {/* <Route path="subscribe/posts" element={<GetSubscribeChannels />} /> */}
            <Route path="library/purchases" element={<PurchasedPostsPage />} />
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
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
