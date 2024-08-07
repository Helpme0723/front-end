import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw, ContentState, Modifier } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { fetchPostDetails, updatePost, uploadImage } from '../apis/post';
import '../styles/pages/PostEditPage.css';
import AuthContext from '../context/AuthContext';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
import htmlToDraft from 'html-to-draftjs';

function PostEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [channelId, setChannelId] = useState('');
  const [seriesId, setSeriesId] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    let isMounted = true; // 마운트 상태 플래그

    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    const fetchDetails = async () => {
      try {
        const response = await fetchPostDetails(postId);

        if (response && response.data) {
          const { content, ...rest } = response.data;

          if (isMounted) {
            // 컴포넌트가 마운트된 상태인지 확인
            setPost(rest);
            setTitle(response.data.title);
            setPreview(response.data.preview);
            setPrice(response.data.price);
            setCategoryId(response.data.categoryId);
            setChannelId(response.data.channelId);
            setSeriesId(String(response.data.seriesId || ''));
            setVisibility(response.data.visibility);

            // HTML을 Draft.js 콘텐츠 상태로 변환
            const blocksFromHtml = htmlToDraft(content);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(
              contentBlocks,
              entityMap,
            );
            setEditorState(EditorState.createWithContent(contentState));
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
      isMounted = false; // 컴포넌트가 언마운트될 때 플래그를 false로 설정
    };
  }, [isAuthenticated, navigate, postId]);

  const handleEditorStateChange = state => {
    setEditorState(state);
  };

  // 이미지 삭제 핸들러 추가
  const handleDeleteEntity = () => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    // 현재 선택된 블록의 타입을 확인
    const blockKey = selection.getAnchorKey();
    const block = contentState.getBlockForKey(blockKey);
    const blockType = block.getType();

    // 'atomic' 블록 타입이면 이미지 블록을 의미하므로 삭제
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

  // 이미지 업로드 콜백 함수
  const uploadImageCallBack = async file => {
    try {
      const response = await uploadImage(file); // AWS S3에 이미지 업로드
      // 서버로부터 반환된 이미지 URL을 올바른 형식으로 변경
      return { data: { link: response.imageUrl } };
    } catch (error) {
      console.error('Failed to upload image:', error);
      return Promise.reject(error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    const updatePostDto = {
      title,
      content,
      preview,
      price: parseInt(price, 10),
      channelId: parseInt(channelId, 10),
      categoryId: parseInt(categoryId, 10),
      visibility,
    };

    // seriesId가 빈 문자열이 아닐 때만 업데이트 요청에 포함
    if (typeof seriesId === 'string' && seriesId.trim() !== '') {
      updatePostDto.seriesId = parseInt(seriesId, 10);
    }

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

  // 사용자 정의 블록 렌더러 함수
  function imageBlockRenderer(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: false,
      };
    }
  }

  // 미디어 컴포넌트
  function MediaComponent({ block, contentState }) {
    const entity = contentState.getEntity(block.getEntityAt(0));
    const { src, alt, height, width } = entity.getData();

    return (
      <div>
        <img
          src={src}
          alt={alt || ''}
          style={{ height: height || 'auto', width: width || 'auto' }}
          onClick={handleDeleteEntity} // 클릭 시 엔티티 삭제
        />
      </div>
    );
  }

  if (!post) return <div>로딩중...</div>;

  return (
    <div className="pe-post-edit-container">
      <h2 className="pe-post-edit-h2">포스트 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="pe-form-group">
          <label className="pe-post-edit-label">제목</label>
          <input
            className="pe-post-edit-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">미리보기</label>
          <textarea
            className="form-control"
            value={preview}
            onChange={e => setPreview(e.target.value)}
            placeholder="구매 여부와 관계없이 열람 가능한 필드입니다."
            required
            rows="3"
          />
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">가격</label>
          <input
            className="pe-post-edit-input"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">카테고리 ID</label>
          <input
            className="pe-post-edit-input"
            type="number"
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">채널 ID</label>
          <input
            className="pe-post-edit-input"
            type="number"
            value={channelId}
            onChange={e => setChannelId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="pe-post-edit-label">시리즈 ID</label>
          <input
            className="pe-post-edit-input"
            type="text" // 문자열로 다루기 위해 타입을 text로 설정
            value={seriesId}
            onChange={e => setSeriesId(e.target.value)}
          />
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
                uploadCallback: uploadImageCallBack, // 이미지 업로드 콜백 설정
                alt: { present: true, mandatory: false },
                previewImage: true,
                inputAccept:
                  'image/gif,image/jpeg,image/jpg,image/png,image/svg', // 허용되는 이미지 타입
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
            customBlockRenderFunc={imageBlockRenderer} // 사용자 정의 블록 렌더러 추가
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
