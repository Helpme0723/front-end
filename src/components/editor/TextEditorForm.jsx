import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styled from 'styled-components';
import { uploadImage } from '../../apis/aws';

const MyBlock = styled.div`
  .wrapper-class {
    width: 100%;
    margin: 0 auto;
    margin-bottom: 4rem;
  }
  .editor {
    height: 500px !important;
    border: 1px solid #f1f1f1 !important;
    padding: 5px !important;
    border-radius: 2px !important;
  }
`;

const TextEditorForm = ({ editorState, onEditorStateChange, pendingImageUrl, setPendingImageUrl }) => {
  const uploadImageCallBack = async (file) => {
    try {
      const response = await uploadImage(file);
      setPendingImageUrl(response.imageUrl); // 이미지 URL을 상태로 저장
      return { data: { link: response.imageUrl } };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  return (
    <MyBlock>
      <Editor
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbar={{
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: false },
          image: {
            uploadCallback: uploadImageCallBack,
            alt: { present: true, mandatory: false },
            previewImage: true,
          },
        }}
        placeholder="내용을 작성해주세요."
        localization={{
          locale: 'ko',
        }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
    </MyBlock>
  );
};

export default TextEditorForm;
