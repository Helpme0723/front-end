import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { uploadImage } from '../../apis/aws';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TextEditor = ({ editorState, onEditorStateChange }) => {
  const uploadImageCallback = async (file) => {
    try {
      const response = await uploadImage(file);
      return { data: { link: response.url } }; // 서버에서 반환된 이미지 URL
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  return (
    <div className='text-editor'>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbar-class"
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        onEditorStateChange={onEditorStateChange}
        toolbar={{
          image: { uploadCallback: uploadImageCallback, alt: { present: true, mandatory: false } },
        }}
      />
    </div>
  );
};

export default TextEditor;
