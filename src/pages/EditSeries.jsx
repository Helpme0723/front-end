import { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { findMyOneSeries, updateSeries } from '../apis/series';

const EditSeries = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { seriesId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [channelId, setChannelId] = useState('');
  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      alert('시리즈는 로그인 후 수정할 수 있습니다.');
      navigate('/login');
      return;
    }

    const fetchSeries = async () => {
      try {
        const response = await findMyOneSeries(seriesId);

        setTitle(response.data.title);
        setDescription(response.data.description);
        setChannelId(response.data.channelId);
      } catch (error) {
        console.error('Error fetching channel data:', error);
      }
    };

    fetchSeries();
  }, [isAuthenticated, seriesId]);

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await updateSeries(seriesId, channelId, title, description);

      alert('시리즈를 수정했습니다.');
      navigate(`/series/${seriesId}/my`);
    } catch (error) {
      console.error('시리즈 수정 실패');
      setErrMessage(error.response.data.message);
    }
  };

  return (
    <div className="create-series-container">
      <h2>시리즈 수정</h2>
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
        <button type="submit">시리즈 수정</button>
      </form>
    </div>
  );
};

export default EditSeries;
