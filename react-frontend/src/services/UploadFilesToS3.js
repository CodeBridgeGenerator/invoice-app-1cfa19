import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";

export const UploadFilesToS3 = (props) => {
  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [files, setFiles] = useState([]);
  const fileUploadRef = useRef(null);
  const uploadURL = `${process.env.REACT_APP_SERVER_URL}/s3uploader`;
  const controller = {};

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;
    setFiles(e.files);

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e) => {
    let _totalSize = 0;
    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onTemplateRemove = (file) => {
    setTotalSize(totalSize - file.size);
    const index = files?.findIndex((f) => f.name === file.name);
    if (index > -1) files.splice(index, 1);
    if (controller[index]) controller[index]?.abort();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 25 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const logo = (file) => {
    const regex = new RegExp("image/*");
    if (regex.test(file.type)) {
      return file.objectURL;
    }

    switch (file.type) {
      case "application/pdf":
        return "./assets/media/pdf.svg";
      case "text/csv":
        return "./assets/media/csv.svg";
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return "./assets/media/xlsx.svg";
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return "./assets/media/docx.svg";
      case "application/msword":
        return "./assets/media/doc.svg";
      case "vnd.ms-powerpoint":
        return "./assets/media/ppt.svg";
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        return "./assets/media/pptx.svg";
      case "image/jpeg":
        return "./assets/media/jpg.svg";
      case "image/jpg":
        return "./assets/media/jpg.svg";
      case "image/png":
        return "./assets/media/png.svg";
      case "text/plain":
        return "./assets/media/txt.svg";
      case "application/zip":
        return "./assets/media/zip.svg";
      default:
        return "./assets/media/txt.svg";
    }
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          <img
            alt={file.name}
            role="presentation"
            loading="lazy"
            src={logo(file)}
            width={25}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          rounded={true}
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Images & Docs Here
        </span>
      </div>
    );
  };
  const chooseOptions = {
    icon: "pi pi-fw pi-file-excel",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };
  const uploadFile = async (e) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const documentIds = [];

    if (e.files.length > 0) {
      try {
        e.files.forEach(async (file, i) => {
          const reader = new FileReader();
          controller[i] = new AbortController();
          const request = new Request(file.objectURL, {
            signal: controller[i].signal,
          });
          const blob = await fetch(request).then((r) => r.blob());

          reader.readAsDataURL(blob);
          reader.onload = async function () {
            const base64data = reader.result;
            const _data = {
              content: base64data,
              lastModified: file.lastModified,
              lastModifiedDate: file.lastModifiedDate,
              name: file.name,
              type: file.type,
              size: file.size,
              tableId: props.id,
              tableName: props.serviceName,
              user: props.user ? props.user : {},
            };
            const response = await fetch(uploadURL, {
              method: "POST",
              body: JSON.stringify(_data),
              headers: myHeaders,
            });
            const result = await response.json();
            if (result?.documentId) {
              documentIds.push(result.documentId);
            }
            props.onFileLoaded(file);
          };
        });
        // Pass the ID back to the parent component
        if (documentIds.length > 0) props.onUploadComplete(documentIds);
      } catch (error) {
        props.alert({
          title: "Server Error",
          type: "error",
          message: error,
        });
      }
    }
    // insert into docs here with id and service name
    // props.onHide();
  };

  return (
    <div className="m-0">
      <Toast ref={toast}></Toast>
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />
      <FileUpload
        name="file"
        multiple
        customUpload
        uploadHandler={uploadFile}
        ref={fileUploadRef}
        onUpload={onTemplateUpload}
        onSelect={onTemplateSelect}
        onError={onTemplateClear}
        onClear={onTemplateClear}
        onRemove={onTemplateRemove}
        headerTemplate={headerTemplate}
        itemTemplate={itemTemplate}
        emptyTemplate={emptyTemplate}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        accept=".csv, .pdf, .doc, .docx, image/*, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        auto={false}
        maxFileSize={25000000} // 25MB limit for the file
      />
    </div>
  );
};

export default UploadFilesToS3;
