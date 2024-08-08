import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import {
  fetchPostDetails,
  updatePost,
  uploadImage,
  getSeries,
} from '../apis/post';
import AuthContext from '../context/AuthContext';
import '../styles/pages/PostEditPage.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
import htmlToDraft from 'html-to-draftjs';

const categories = [
  { id: 1, name: '웹툰' },
  { id: 2, name: '영화' },
  { id: 3, name: '소설' },
  { id: 4, name: '정치' },
  { id: 5, name: '경제' },
  { id: 6, name: '지식' },
  { id: 7, name: '일상' },
];

function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [errors, setErrors] = useState({});
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState('');

  // 각 입력 필드에 대한 참조 생성
  const titleRef = useRef(null);
  const previewRef = useRef(null);
  const categoryRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    const fetchDetails = async () => {
      try {
        const response = await fetchPostDetails(postId);
        console.log("포스트 응답 데이터:", response.data);

        if (response && response.data) {
          const { content, channelTitle, seriesTitle, ...rest } = response.data;

          if (isMounted) {
            setPost(rest);
            setTitle(rest.title);
            setPreview(rest.preview);
            setPrice(rest.price);
            setCategoryId(rest.categoryId);
            setChannelTitle(channelTitle);
            setVisibility(rest.visibility);

            const blocksFromHtml = htmlToDraft(content);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(
              contentBlocks,
              entityMap,
            );
            setEditorState(EditorState.createWithContent(contentState));
            // 시리즈 목록 가져오기
            try {
              const seriesResponse = await getSeries(rest.channelId);
              setSeriesList(seriesResponse.data.series || []); // 실제 응답 구조에 맞게 조정
              setSelectedSeriesId(seriesTitle?.id || ''); // 선택된 시리즈 설정
            } catch (seriesError) {
              console.error('Failed to fetch series:', seriesError);
            }
          }
        } else {
          console.error('Invalid response from server');
        }
      } catch (error) {
        console.error('Failed to fetch post details:', error);
        alert(
          '포스트 데이터를 가져오는 데 실패했습니다. 서버 응답을 확인하세요.',
        );
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, navigate, postId]);

  const handleEditorStateChange = state => {
    setEditorState(state);
  };

  const handleDeleteEntity = () => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getAnchorKey();
    const block = contentState.getBlockForKey(blockKey);
    const blockType = block.getType();

    if (blockType === 'atomic') {
      const entityKey = block.getEntityAt(0);
      if (entityKey) {
        const contentStateWithoutEntity = Modifier.removeRange(
          contentState,
          selection,
          'backward',
        );
        const newEditorState = EditorState.push(
          editorState,
          contentStateWithoutEntity,
          'remove-range',
        );
        setEditorState(newEditorState);
      }
    }
  };

  const uploadImageCallBack = async file => {
    try {
      const response = await uploadImage(file);
      return { data: { link: response.imageUrl } };
    } catch (error) {
      console.error('Failed to upload image:', error);
      return Promise.reject(error);
    }
  };

  const validateFields = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = '제목을 입력하세요.';
    if (!preview.trim()) newErrors.preview = '미리보기를 입력하세요.';
    if (!categoryId)
      newErrors.categoryId = '원하는 카테고리를 하나 선택하세요.';
    if (!editorState.getCurrentContent().hasText())
      newErrors.content = '내용을 입력하세요.';

    setErrors(newErrors);

    // 첫 번째 오류 필드로 포커스 이동
    if (newErrors.title && titleRef.current) {
      titleRef.current.focus();
    } else if (newErrors.preview && previewRef.current) {
      previewRef.current.focus();
    } else if (newErrors.categoryId && categoryRef.current) {
      categoryRef.current.focus();
    } else if (newErrors.content && editorRef.current) {
      editorRef.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateFields()) {
      return; // 오류가 있을 경우 제출을 중단
    }
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    const updatePostDto = {
      title,
      content,
      preview,
      price: parseInt(price, 10),
      categoryId: parseInt(categoryId, 10),
      seriesId: selectedSeriesId ? parseInt(selectedSeriesId, 10) : null, // 선택된 시리즈 ID 추가
      visibility,
    };

    try {
      const response = await updatePost(postId, updatePostDto);
      if (response) {
        alert('포스트가 성공적으로 수정되었습니다.');
        navigate(`/post/${postId}`);
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('포스트 수정에 실패했습니다.');
    }
  };

  const imageBlockRenderer = contentBlock => {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
      };
    }
  };

  const MediaComponent = ({ block, contentState }) => {
    const entity = contentState.getEntity(block.getEntityAt(0));
    const { src, alt, height, width } = entity.getData();

    return (
      <div>
        <img
          src={src}
          alt={alt || ''}
          style={{ height: height || 'auto', width: width || 'auto' }}
          onClick={handleDeleteEntity}
        />
      </div>
    );
  };

  if (!post) return <div>로딩중...</div>;

  return (
    <div className="pe-post-edit-container">
      <h2 className="pe-post-edit-h2">포스트 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="pe-form-group">
          <label className="pe-post-edit-label">제목</label>
          <input
            ref={titleRef}
            className={`pe-post-edit-input ${errors.title ? 'pe-error-border' : ''}`}
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prevErrors => ({ ...prevErrors, title: null }));
              }
            }}
            // required
          />
          {errors.title && (
            <div className="pe-error-message">{errors.title}</div>
          )}
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">미리보기</label>
          <textarea
            ref={previewRef}
            className={`form-control ${errors.preview ? 'pe-error-border' : ''}`}
            value={preview}
            onChange={e => {
              setPreview(e.target.value);
              if (e.target.value.trim()) {
                setErrors(prevErrors => ({ ...prevErrors, preview: null }));
              }
            }}
            placeholder="구매 여부와 관계없이 열람 가능한 필드입니다."
            // required
            rows="3"
          />
          {errors.preview && (
            <div className="pe-error-message">{errors.preview}</div>
          )}
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">가격</label>
          <input
            className="pe-post-edit-input"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            // required
          />
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">카테고리</label>
          <select
            ref={categoryRef}
            className={`pe-post-edit-input-select ${errors.categoryId ? 'pe-error-border' : ''}`}
            value={categoryId}
            onChange={e => {
              setCategoryId(e.target.value);
              if (e.target.value) {
                setErrors(prevErrors => ({ ...prevErrors, categoryId: null }));
              }
            }}
            required
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <div className="pe-error-message">{errors.categoryId}</div>
          )}
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">채널</label>
          <input
            className="pe-post-edit-input"
            type="text"
            value={channelTitle}
            readOnly
          />
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">시리즈</label>
          <select
            className="pe-post-edit-input-select"
            value={selectedSeriesId}
            onChange={e => setSelectedSeriesId(e.target.value)}
          >
            <option value="">지정안함</option>
            {seriesList.length > 0 ? (
              seriesList.map(series => (
                <option key={series.id} value={series.id}>
                  {series.title} 
                </option>
              ))
            ) : (
              <option disabled>시리즈를 불러오는 중입니다...</option>
            )}
          </select>
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">공개여부</label>
          <select
            className="pe-post-edit-input-select"
            value={visibility}
            onChange={e => setVisibility(e.target.value)}
          >
            <option value="PUBLIC">공개</option>
            <option value="PRIVATE">비공개</option>
          </select>
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">내용</label>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorStateChange}
            toolbar={{
              image: {
                uploadCallback: uploadImageCallBack,
                alt: { present: true, mandatory: false },
                previewImage: true,
                inputAccept:
                  'image/gif,image/jpeg,image/jpg,image/png,image/svg',
              },
              fontFamily: {
                options: [
                  'Arial',
                  'Georgia',
                  'Impact',
                  'Tahoma',
                  'Times New Roman',
                  'Verdana',
                ],
              },
              fontSize: {
                options: [
                  8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60, 72, 96,
                ],
              },
            }}
            customBlockRenderFunc={imageBlockRenderer}
            placeholder="유료 포스트인 경우 구매 후 열람할 수있는 필드입니다."
          />
        </div>
        <button type="submit" className="pe-submit-button">
          수정
        </button>
      </form>
    </div>
  );
}

export default PostEditPage;
