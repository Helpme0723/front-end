import React, { useState, useEffect, useContext } from 'react';
import TextEditorForm from '../components/editor/TextEditorForm';
import { createPost, getSeries, uploadImage } from '../apis/post'; // 포스트 생성 함수
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, AtomicBlockUtils } from 'draft-js';
import '../styles/pages/PostPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// 이미지가 입력될 경우 img 태그로 변환
function MediaComponent({ block, contentState }) {
  const data = contentState.getEntity(block.getEntityAt(0)).getData();
  return (
    <div>
      <img
        src={data.src}
        alt={data.alt || ''}
        style={{ height: data.height || 'auto', width: data.width || 'auto' }}
      />
    </div>
  );
}

// 이미지를 감지해 컴포넌트로 변환해주는 사용자 정의 함수
function imageBlockRenderer(contentBlock) {
  const type = contentBlock.getType();

  if (type === 'atomic') {
    return {
      component: MediaComponent,
      editable: false,
    };
  }
  return null;
}

const PostPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const { channelId } = useParams();
  const [series, setSeries] = useState([]);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [price, setPrice] = useState(0);
  const [thumbNail, setThumbNail] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [seriesId, setSeriesId] = useState('');
  const [categoryId, setCategoryId] = useState('1');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [pendingImageUrl, setPendingImageUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [createPostMessage, setCreatePostMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      alert('로그인 후 이용해 주세요.');
      navigate('/');
      return;
    }
  }, [isAuthenticated, navigate]);

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
    const contentState = editorState.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(contentState));

    const createPostDto = {
      title: title,
      preview: preview,
      content: htmlContent,
      price: price,
      thumbNail: thumbNail,
      channelId: parseInt(channelId), // 숫자형으로 변환
      visibility: visibility,
      seriesId: parseInt(seriesId), // 숫자형으로 변환
      categoryId: parseInt(categoryId), // 숫자형으로 변환
    };

    try {
      if (imageUrl) {
        createPostDto.thumbNail = imageUrl;
      }
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

  const handleImageUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const data = await uploadImage(file);
      setImageUrl(data.imageUrl);
      setImagePreview(data.imageUrl);
    } catch (error) {
      setCreatePostMessage(`이미지 업로드 실패: ${error.message}`);
    }
  };

  const handleInsertImage = () => {
    if (!pendingImageUrl) return;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'IMAGE',
      'IMMUTABLE',
      { src: pendingImageUrl },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      EditorState.set(editorState, { currentContent: contentStateWithEntity }),
      entityKey,
      ' ',
    );
    setEditorState(newEditorState);
    setPendingImageUrl(null); // 삽입 후 URL 초기화
  };

  return (
    <div className="post-page">
      <h1 className="post-page-title">포스트 작성</h1>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="포스트 제목을 입력해 주세요."
        className="post-title-input"
      />
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
      <div className="post-inline-inputs">
        <div className="post-inline-input">
          <label htmlFor="visibility-select">포스트 공개/비공개 설정</label>
          <select
            id="visibility-select"
            value={visibility}
            onChange={e => setVisibility(e.target.value)}
            className="post-visibility-select"
          >
            <option value="PUBLIC">공개</option>
            <option value="PRIVATE">비공개</option>
          </select>
        </div>
        <div className="post-inline-input">
          <label htmlFor="category-select">카테고리</label>
          <select
            id="category-select"
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
        </div>
        <div className="post-inline-input">
          <label htmlFor="series-select">시리즈</label>
          <select
            id="series-select"
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
        </div>
        <div className="post-inline-input">
          <label htmlFor="price-input">포인트</label>
          <input
            id="price-input"
            type="number"
            min="0"
            value={price}
            onChange={e => setPrice(parseInt(e.target.value))} // 숫자형으로 변환
            placeholder="포스트 가격을 입력해 주세요."
            className="post-price-input"
          />
        </div>
      </div>
      <hr />
      <h3>프리뷰</h3>
      <textarea
        value={preview}
        onChange={e => setPreview(e.target.value)}
        placeholder="구매 여부와 관계없이 열람 가능한 필드입니다."
        className="post-preview-textarea"
      ></textarea>
      <h3>콘텐츠</h3>
      <div className="content-container">
        <TextEditorForm
          editorState={editorState}
          onEditorStateChange={setEditorState}
          pendingImageUrl={pendingImageUrl}
          setPendingImageUrl={setPendingImageUrl}
          customBlockRenderFunc={imageBlockRenderer} // 이미지 블록 렌더러 추가
        />
      </div>
      <button onClick={clickButton} className="save-button">
        작성
      </button>
    </div>
  );
};

export default PostPage;
