import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { signOut } from '../apis/auth';

function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
        logout(); // 로그아웃 상태 업데이트
        navigate('/login'); // 로그인 페이지로 리디렉션
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    };

    performLogout();
  }, [navigate, logout]); // `logout` 의존성 배열에서 삭제

  return null;
}

export default Logout;
