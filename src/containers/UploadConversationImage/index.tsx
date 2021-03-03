import React, { useState } from "react";
import { storage } from "../../firebase";
import { updateGroupImage } from "../../firebase/groups";
import { Modal, Input } from "antd";

interface Props {
  isVisible: boolean;
  selectedChat: any;
  handleChangingGroupImage: any;
  //   handleChangeProfileImage: any;
  //   handleUpdateProfileImage: any;
}

export default function UploadProfileImage(props: Props) {
  const [file, setFile] = useState(null as any);
  const [preview, setPreview] = useState(null as any);
  const [loading, setLoading] = useState(false);

  const {
    isVisible,
    handleChangingGroupImage,
    selectedChat,
    // handleChangeProfileImage,
    // handleUpdateProfileImage,
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
          updateGroupImage(selectedChat.id, url);
          //   handleChangeProfileImage();
          //   handleUpdateProfileImage(url);
          handleChangingGroupImage();
        });
    });
  }
  return (
    <>
      <Modal
        title="Change current group image"
        visible={isVisible}
        onCancel={() => handleChangingGroupImage()}
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
