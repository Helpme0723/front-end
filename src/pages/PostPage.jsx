import React, { useState, useEffect, useRef } from 'react';
import TextEditorForm from '../components/editor/TextEditorForm';
import { createPost } from '../apis/post';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';
import React, { useState, useEffect, useContext } from 'react';
import { createPost, getSeries } from '../apis/post'; // 포스트 생성 함수
import '../styles/pages/PostPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PostPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { channelId } = useParams();
  const [series, setSeries] = useState([]);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [price, setPrice] = useState(0);
  const [visibility, setVisibility] = useState('PUBLIC');
  const [seriesId, setSeriesId] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [content, setContent] = useState('');

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const saveContentAsHtml = async () => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(contentState));
    
    if (!isAuthenticated) {
      alert('로그인 후 이용해 주세요.');
      navigate('/');
      return;
    }
  });

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const data = await getSeries(channelId);
        setSeries(data.data.series);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchSeries();
  }, [channelId]);

  const categories = [
    { id: 1, name: '웹툰' },
    { id: 2, name: '영화' },
    { id: 3, name: '소설' },
    { id: 4, name: '정치' },
    { id: 5, name: '경제' },
    { id: 6, name: '지식' },
    { id: 7, name: '일상' },
  ];

  const clickButton = async () => {
    const createPostDto = {
      title: title,
      preview: preview,
      content: content,
      price: price,
      channelId: parseInt(channelId),
      visibility: visibility,
      seriesId: parseInt(seriesId),
      categoryId: parseInt(categoryId),
    };

    try {
      const response = await createPost(createPostDto);

      alert('포스트 생성했습니다.');
      navigate(`/post/${response.data.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };

  return (
    <div className="post-page">
      <h1 className="post-page-title">Create a New Post</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        className="post-title-input"
      />
      <input
        type="text"
        value={preview}
        onChange={(e) => setPreview(e.target.value)}
        placeholder="Enter post preview"
        className="post-preview-input"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(parseInt(e.target.value))}
        placeholder="Enter post price"
        className="post-price-input"
      />
      <input
        type="text"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
        placeholder="Enter channel ID"
        className="post-channelId-input"
      />
      <input
        type="text"
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        placeholder="Enter visibility"
        className="post-visibility-input"
      />
      <input
        type="text"
        value={seriesId}
        onChange={(e) => setSeriesId(e.target.value)}
        placeholder="Enter series ID"
        className="post-seriesId-input"
      />
      <input
        type="text"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder="Enter category ID"
        className="post-categoryId-input"
      />
      <TextEditorForm
        editorState={editorState}
        onEditorStateChange={setEditorState}
      />
      <button onClick={saveContentAsHtml} className="save-button">Save as HTML</button>
      <div className="post-inline-inputs">
        <select
          value={visibility}
          onChange={e => setVisibility(e.target.value)}
          className="post-visibility-select"
        >
          <option value="PUBLIC">PUBLIC</option>
          <option value="PRIVATE">PRIVATE</option>
        </select>
        <select
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          className="post-category-select"
        >
          {categories.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        <select
          value={seriesId}
          onChange={e => setSeriesId(e.target.value)}
          className="post-series-select"
        >
          {series.map(option => (
            <option key={option.id} value={option.id}>
              {option.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(parseInt(e.target.value))} // 숫자형으로 변환
          placeholder="Enter post price"
          className="post-price-input"
        />
      </div>
      <hr />
      <h3>프리뷰</h3>
      <textarea
        value={preview}
        onChange={e => setPreview(e.target.value)}
        placeholder="Enter post preview"
        className="post-preview-textarea"
      ></textarea>
      <h3>콘텐츠</h3>
      <TextEditorForm
        editorState={editorState}
        onEditorStateChange={setEditorState}
      />
      <button onClick={clickButton} className="save-button">
        작성
      </button>
    </div>
  );
};

export default PostPage;
