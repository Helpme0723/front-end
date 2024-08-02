import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChannel, uploadImage } from '../apis/channel';

function CreateChannel() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [createChannelMessage, setCreateChannelMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const channelData = { title, description };
      if (imageUrl) {
        channelData.imageUrl = imageUrl;
      }

      await createChannel(channelData);

      setCreateChannelMessage('채널 생성에 성공했습니다.');
      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      setCreateChannelMessage(`채널 생성 실패: ${error.message}`);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const data = await uploadImage(file);
      setImageUrl(data.imageUrl);
    } catch (error) {
      setCreateChannelMessage(`이미지 업로드 실패: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>채널 생성</h2>
      {createChannelMessage && <div>{createChannelMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>이미지 업로드</label>
          <div>
            <input
              type="text"
              placeholder="이미지 url을 입력해 주세요."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <input type="file" onChange={handleImageUpload} />
          </div>
        </div>
        <div>
          <label>채널 이름</label>
          <div>
            <input
              type="text"
              placeholder="채널 이름을 입력해 주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label>채널 소개</label>
          <div>
            <textarea
              type="text"
              placeholder="채널 소개를 입력해 주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit">채널 생성</button>
      </form>
    </div>
  );
}

export default CreateChannel;
