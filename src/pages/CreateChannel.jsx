import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChannel, uploadImage } from '../apis/channel';
import AuthContext from '../context/AuthContext';
import '../styles/pages/CreateChannel.css';

function CreateChannel() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [createChannelMessage, setCreateChannelMessage] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해 주세요.');
      navigate('/');
      return;
    }
  });

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const channelData = { title, description };

      if (imageUrl) {
        channelData.imageUrl = imageUrl;
      }

      const result = await createChannel(channelData);

      setCreateChannelMessage('채널 생성에 성공했습니다.');
      alert('채널 생성에 성공했습니다.');
      navigate(`/channel/${result.data.id}`);
    } catch (error) {
      setCreateChannelMessage(`채널 생성 실패: ${error.message}`);
    }
  };

  const handleImageUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const data = await uploadImage(file);
      setImageUrl(data.imageUrl);
      setImagePreview(data.imageUrl);
    } catch (error) {
      setCreateChannelMessage(`이미지 업로드 실패: ${error.message}`);
    }
  };

  return (
    <div className="create-channel-container">
      <h2>채널 생성</h2>
      {createChannelMessage && (
        <div className="message">{createChannelMessage}</div>
      )}
      <form onSubmit={handleSubmit} className="create-channel-form">
        <div className="form-group">
          <label>이미지 업로드</label>
          <div className="input-group">
            <input
              type="text"
              placeholder="이미지 URL을 입력해 주세요."
              value={imageUrl}
              onChange={e => {
                setImageUrl(e.target.value);
                setImagePreview(e.target.value);
              }}
            />
            <input type="file" onChange={handleImageUpload} />
          </div>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="이미지 미리보기" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label>채널 이름</label>
          <div className="input-group">
            <input
              type="text"
              placeholder="채널 이름을 입력해 주세요."
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>채널 소개</label>
          <div className="input-group">
            <textarea
              placeholder="채널 소개를 입력해 주세요"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="submit-button">
          채널 생성
        </button>
      </form>
    </div>
  );
}

export default CreateChannel;
