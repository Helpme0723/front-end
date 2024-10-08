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

const TextEditorForm = ({
  editorState,
  onEditorStateChange,
  pendingImageUrl,
  setPendingImageUrl,
  customBlockRenderFunc // 추가: customBlockRenderFunc props 추가
}) => {
  const uploadImageCallBack = async file => {
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
        placeholder="유료 포스트인 경우 구매 후 열람할 수있는 필드입니다."
        localization={{
          locale: 'ko',
        }}
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        customBlockRenderFunc={customBlockRenderFunc} // 추가: customBlockRenderFunc 설정
      />
    </MyBlock>
  );
};

export default TextEditorForm;
