import axios from './axiosInstance';

export const fetchPostDetails = async (postId) => {
	try {
		const response = await axios.get(`/api/posts/${postId}`);
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching post details:', error);
		throw error;
	}
};

export const createPostLike = async (postId) => {
	try {
		const response = await axios.post(`/api/posts/${postId}/postlike`);
		return response.data;
	} catch (error) {
		console.error('Error liking post:', error.response?.data?.message || 'Unknown error');
		throw error;
	}
};

// Function to unlike a post
export const deletePostLike = async (postId) => {
	try {
		const response = await axios.delete(`/api/posts/${postId}/postlike`);
		return response.data;
	} catch (error) {
		console.error('Error unliking post:', error.response?.data?.message || 'Unknown error');
		throw error;
	}
};

// 댓글에 좋아요
export const likeComment = async (commentId) => {
	try {
		const response = await axios.post(`/api/comments/${commentId}/likes`);
		return response.data;
	} catch (error) {
		throw error;
	}
};

// Function to unlike a comment
export const unlikeComment = async (commentId) => {
	try {
		const response = await axios.delete(`/api/comments/${commentId}/likes`);
		return response.data;
	} catch (error) {
		throw error;
	}
};


export const fetchComments = async (postId, page = 1, limit = 5) => {
	try {
		const response = await axios.get('/api/comments', {
			params: { postId, page, limit },
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching comments:', error);
		throw error;
	}
};