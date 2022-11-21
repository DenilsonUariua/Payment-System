import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
import React, { useState } from "react";
import { uploadFile } from "@firebaseFolder";

export const EP_UPLOAD = () => {
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "xxx.png",
      status: "done",
      url: "http://www.baidu.com/xxx.png"
    }
  ]);
  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      console.log("file", file);
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };
  const props = {
    action: async (file) => {
      // add status field to file
      file.status = "uploading";
     await uploadFile(file);
     file.status = "done";
     return file;

    },
    onChange: handleChange,
    multiple: true
  };
  return (
    <Upload {...props} fileList={fileList}>
      <Button icon={<UploadOutlined />}>Upload</Button>
    </Upload>
  );
};
