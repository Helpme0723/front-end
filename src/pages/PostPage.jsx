import React, { useState, useEffect, useRef } from 'react';
import TextEditor from '../components/editor/TextEditor'; // TextEditor 컴포넌트 임포트
import { createPost } from '../apis/post'; // 포스트 생성 함수
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';
import '../styles/pages/PostPage.css';

const PostPage = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [price, setPrice] = useState(0);
  const [channelId, setChannelId] = useState('');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [seriesId, setSeriesId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const onEditorStateChange = (editorState) => {
    if (isMounted.current) {
      setEditorState(editorState);
    }
  };

  const saveContentAsHtml = async () => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(contentState));
    console.log('HTML Content:', htmlContent);

    const createPostDto = {
      title: title,
      preview: preview,
      content: htmlContent,
      price: price,
      channelId: parseInt(channelId), // 숫자형으로 변환
      visibility: visibility,
      seriesId: parseInt(seriesId), // 숫자형으로 변환
      categoryId: parseInt(categoryId), // 숫자형으로 변환
    };

    console.log('createPostDto:', createPostDto); // 요청 데이터 콘솔 로그

    try {
      const response = await createPost(createPostDto);
      console.log('Post created successfully:', response);
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
        onChange={(e) => setPrice(parseInt(e.target.value))} // 숫자형으로 변환
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
      <TextEditor editorState={editorState} onEditorStateChange={onEditorStateChange} />
      <button onClick={saveContentAsHtml} className="save-button">Save as HTML</button>
    </div>
  );
};

export default PostPage;
