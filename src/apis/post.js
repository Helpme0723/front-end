import axiosInstance from './axiosInstance';

export const createPost = async (createPostDto) => {

	try {
		const response = await axiosInstance.post('/api/posts', createPostDto);

		return response.data;
	} catch (error) {
		console.error('Error creating post:', error);
		throw error;
	}
};

export const fetchPostDetails = async (postId) => {
	try {
		const response = await axiosInstance.get(`/api/posts/${postId}`);

		return response.data;
	} catch (error) {
		console.error('Error fetching post details:', error);
		throw error;
	}
};

export const createPostLike = async (postId) => {
	try {
		const response = await axiosInstance.post(`/api/posts/${postId}/postlike`);
		return response.data;
	} catch (error) {
		console.error('Error liking post:', error.response?.data?.message || 'Unknown error');
		throw error;
	}
};

// Function to unlike a post
export const deletePostLike = async (postId) => {
	try {
		const response = await axiosInstance.delete(`/api/posts/${postId}/postlike`);
		return response.data;
	} catch (error) {
		console.error('Error unliking post:', error.response?.data?.message || 'Unknown error');
		throw error;
	}
};

// 댓글에 좋아요
export const likeComment = async (commentId) => {
	try {
		const response = await axiosInstance.post(`/api/comments/${commentId}/likes`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Function to unlike a comment
export const unlikeComment = async (commentId) => {
	try {
		const response = await axiosInstance.delete(`/api/comments/${commentId}/likes`);
		return response.data;
	} catch (error) {
		throw error;
	}
};


export const fetchComments = async (postId, page = 1, limit = 5) => {
	try {
		const response = await axiosInstance.get('/api/comments', {
			params: { postId, page, limit },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching comments:', error);
		throw error;
	}
};

export const categoryPostView = async (categoryId = 1, page = 1, limit = 5) => {
	try {
		const response = await axiosInstance.get('/api/posts', {
			params: { categoryId, page, limit },
		});
		return response.data;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const getSeries = async (channelId, page = 1, limit = 9, sort = 'desc') => {
	try {
		const response = await axiosInstance.get('api/series/my', {
			params: { channelId, page, limit, sort }
		});

		return response.data;

	} catch (error) {
		console.error('Error fetching series:', error);
		throw error;
	}
}