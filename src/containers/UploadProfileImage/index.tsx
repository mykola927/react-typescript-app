import React, { useState } from "react";
import { storage } from "../../firebase";
import { updateProfileImage } from "../../firebase/users";
import { Modal, Input } from "antd";

interface Props {
  isVisible: boolean;
  handleChangeProfileImage: any;
  handleUpdateProfileImage: any;
}

export default function UploadProfileImage(props: Props) {
  const [file, setFile] = useState(null as any);
  const [preview, setPreview] = useState(null as any);
  const [loading, setLoading] = useState(false);

  const {
    isVisible,
    handleChangeProfileImage,
    handleUpdateProfileImage,
  } = props;

  function handleChange(e: any) {
    setFile(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  }

  function handleUpload() {
    setLoading(true);
    const uniqueName = Date.now() + file.name;
    const uploadTask = storage.ref(`/images/${uniqueName}`).put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      storage
        .ref("images")
        .child(uniqueName)
        .getDownloadURL()
        .then((url) => {
          setFile(null);
          setLoading(false);
          setPreview(null);
          updateProfileImage(`/images/${uniqueName}`);
          handleChangeProfileImage();
          handleUpdateProfileImage(url);
        });
    });
  }
  return (
    <>
      <Modal
        title="Upload a new profile image"
        visible={isVisible}
        onCancel={handleChangeProfileImage}
        onOk={(e) => handleUpload()}
        okButtonProps={{ disabled: !file }}
        confirmLoading={loading}
        okText="Update"
      >
        <Input
          type="file"
          onChange={handleChange}
          style={{ marginBottom: 16 }}
        />
        <img
          src={preview}
          alt=""
          style={{ width: "256px", margin: "0 auto" }}
        />
      </Modal>
    </>
  );
}
