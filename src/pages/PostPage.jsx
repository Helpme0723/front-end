import React, { useState, useEffect, useRef } from 'react';
import TextEditorForm from '../components/editor/TextEditorForm';
import { createPost } from '../apis/post';
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

  const saveContentAsHtml = async () => {
    const contentState = editorState.getCurrentContent();
    const htmlContent = draftToHtml(convertToRaw(contentState));
    
    const createPostDto = {
      title: title,
      preview: preview,
      content: htmlContent,
      price: price,
      channelId: parseInt(channelId),
      visibility: visibility,
      seriesId: parseInt(seriesId),
      categoryId: parseInt(categoryId),
    };

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
    </div>
  );
};

export default PostPage;
