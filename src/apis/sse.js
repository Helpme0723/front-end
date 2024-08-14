export const connectToNotifications = (onMessageCallback, onErrorCallback) => {
  const token = localStorage.getItem('accessToken'); // JWT 토큰 가져오기
  if (!token) {
    console.error('No JWT token found.');
    return () => {};
  }

  // SSE 요청 URL
  const url = `${process.env.REACT_APP_API_URL}/api/notifications/stream?token=${encodeURIComponent(token)}`;

  // EventSource 객체 생성
  const eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log('SSE 연결 성공');
  };

  eventSource.onmessage = (event) => {
    console.log('알림 수신:', event.data);
    const data = JSON.parse(event.data);
    onMessageCallback(data);
  };

  eventSource.onerror = (error) => {
    console.error('SSE 연결 오류:', error);
    onErrorCallback();
    eventSource.close(); // 오류 발생 시 연결 종료
  };

  // 연결을 종료하는 함수 반환
  return () => {
    eventSource.close();
    console.log('SSE 연결이 종료되었습니다.');
  };
};
