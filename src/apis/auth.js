import axiosInstance from './axiosInstance';

export const signIn = async (email, password) => {
	try {
		const response = await axiosInstance.post('/api/auth/sign-in', {
			email,
			password,
		});
		return response.data;
	} catch (error) {
		console.error('Error signing in:', error);
		throw error;
	}
};

export const signOut = async () => {
	try {
		const response = await axiosInstance.delete('/api/auth/sign-out');
		return response.data;
	} catch (error) {
		console.error('Error signing out:', error);
		throw error;
	}
};

export const signUp = async signUpData => {
	try {
		const response = await axiosInstance.post('/api/auth/sign-up', signUpData);
		return response.data;
	} catch (error) {
		if (error.response) {
			throw new Error(
				error.response.data.message || '회원가입에 실패했습니다.',
			);
		}
		throw new Error('서버와의 통신에 실패했습니다.');
	}
};

export const checkEmailAvailability = async email => {
	try {
		const response = await axiosInstance.post('/api/auth/check-email', {
			email,
		});
		return response.data;
	} catch (error) {
		if (error.response) {
			throw new Error(
				error.response.data.message || '이메일 중복 검사에 실패했습니다.',
			);
		}
		throw new Error('서버와의 통신에 실패했습니다.');
	}
};

export const sendVerificationEmail = async email => {
	try {
		const response = await axiosInstance.post('/api/mail/send', {
			mail: email,
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || '메일 전송 실패');
	}
};

export const verifyEmailCode = async (email, code) => {
	try {
		// 입력받은 코드를 숫자형으로 변환
		const numericCode = parseInt(code, 10);
		const response = await axiosInstance.post('/api/auth/verify-email', {
			email,
			code: numericCode,
		});
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || '인증번호 검증 실패');
	}
};
// 구독한 채널 목록 조회
export const getSubscribes = async (page, limit) => {
	try {
		const response = await axiosInstance.get('api/subscribes', { page, limit });
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.message || '구독한 채널 목록 조회 실패')
	}
}
// 구독한 채널들의 포스트 목록 조회
export const getPostsFromSubscribeChannels = async (page, limit) => {
	try {
		const response = await axiosInstance.get('api/subscribes/posts', { page, limit });
		return response.data;
	} catch (error) {
		throw new Error(error.response?.data?.messsage || '구독한 채널의 포스트 목록 조회 실패')
	}

}

export const refreshAccessToken = async () => {
	const refreshToken = localStorage.getItem('refreshToken');
	try {
		const response = await axiosInstance.post('/api/auth/tokens', {}, {
			headers: {
				'Authorization': `Bearer ${refreshToken}`
			}
		});
		const { accessToken, refreshToken: refreshedToken } = response.data.data;
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('refreshToken', refreshedToken);
		return { accessToken, refreshToken: refreshedToken };
	} catch (error) {
		throw new Error('Token refresh failed');
	}
};

export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
};


