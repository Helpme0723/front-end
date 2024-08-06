import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import styled from 'styled-components';
import { uploadImage } from '../../apis/aws'; 

const MyBlock = styled.div`
    .wrapper-class{
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

const TextEditorForm = ({ editorState, onEditorStateChange }) => {
  const uploadImageCallback = async (file) => {
    console.log('Uploading image:', file); // 파일 로그 확인
    try {
      const response = await uploadImage(file);
      console.log('Image uploaded successfully:', response); // 업로드 성공 로그
      return { data: { link: response.url } }; // 서버에서 반환된 이미지 URL
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };
  
  
  return (
    <MyBlock>
      <Editor
        wrapperClassName="wrapper-class"
        editorClassName="editor"
        toolbarClassName="toolbar-class"
        toolbar={{
          list: { inDropdown: true },
          textAlign: { inDropdown: true },
          link: { inDropdown: true },
          history: { inDropdown: false },
          image: {
            uploadCallback: uploadImageCallback,
            previewImage: true,
            alt: { present: true, mandatory: false },
          },
        }}
        placeholder="내용을 작성해주세요."
        localization={{ locale: 'ko' }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
      />
    </MyBlock>
  );
};

export default TextEditorForm;