import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { createSeries } from '../apis/series';
import '../styles/pages/CreateSeries.css';

const CreateSeries = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { channelId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      alert('시리즈는 로그인 후 생성할 수 있습니다.');
      navigate('/login');
      return;
    }
  }, [isAuthenticated]);

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const response = await createSeries(
        Number(channelId),
        title,
        description,
      );

      alert('시리즈를 생성했습니다.');
      navigate(`/series/${response.data.id}/my`);
    } catch (error) {
      console.error('시리즈 생성 실패');
      setErrMessage(error.response.data.message);
    }
  };

  return (
    <div className="create-series-container">
      <h2>시리즈 생성</h2>
      <form onSubmit={handleSubmit}>
        <label>제목</label>
        <input
          type="text"
          placeholder="시리즈 제목"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <label>설명</label>
        <textarea
          type="text"
          placeholder="시리즈 설명"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        {errMessage && (
          <div className="create-series-message">{errMessage}</div>
        )}
        <button type="submit">시리즈 생성</button>
      </form>
    </div>
  );
};

export default CreateSeries;
