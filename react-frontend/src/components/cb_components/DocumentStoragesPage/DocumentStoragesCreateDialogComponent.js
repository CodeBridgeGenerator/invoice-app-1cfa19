import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg[key] = element.message;
      }
    }
  }
  return errMsg.length
    ? errMsg
    : errorObj.message
      ? { error: errorObj.message }
      : {};
};

const DocumentStoragesCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization({ ...props?.entity, ...init }, [], setError);
    }
    set_entity({ ...init });
  }, [props.show]);

  const validate = () => {
    let ret = true;
    const error = {};

    if (_.isEmpty(_entity?.name)) {
      error["name"] = `Document Name field is required`;
      ret = false;
    }

    if (_.isEmpty(_entity?.path)) {
      error["path"] = `Path field is required`;
      ret = false;
    }

    if (_.isEmpty(_entity?.eTag)) {
      error["eTag"] = `AWS ETag field is required`;
      ret = false;
    }

    if (_.isEmpty(_entity?.versionId)) {
      error["versionId"] = `AWS Version Id field is required`;
      ret = false;
    }

    if (_.isEmpty(_entity?.url)) {
      error["url"] = `Url field is required`;
      ret = false;
    }

    if (_.isEmpty(_entity?.tableId)) {
      error["tableId"] = `Table Id field is required`;
      ret = false;
    }

    if (_.isEmpty(_entity?.tableName)) {
      error["tableName"] = `Table Name field is required`;
      ret = false;
    }
    if (!ret) setError(error);
    return ret;
  };

  const onSave = async () => {
    if (!validate()) return;
    let _data = {
      name: _entity?.name,
      size: _entity?.size,
      path: _entity?.path,
      lastModifiedDate: _entity?.lastModifiedDate,
      lastModified: _entity?.lastModified,
      eTag: _entity?.eTag,
      versionId: _entity?.versionId,
      url: _entity?.url,
      tableId: _entity?.tableId,
      tableName: _entity?.tableName,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("documentStorages").create(_data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Document Storages created successfully",
      });
      props.onCreateResult(result);
    } catch (error) {
      console.log("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Document Storages",
      });
    }
    setLoading(false);
  };

  const renderFooter = () => (
    <div className="flex justify-content-end">
      <Button
        label="save"
        className="p-button-text no-focus-effect"
        onClick={onSave}
        loading={loading}
      />
      <Button
        label="close"
        className="p-button-text no-focus-effect p-button-secondary"
        onClick={props.onHide}
      />
    </div>
  );

  const setValByKey = (key, val) => {
    let new_entity = { ..._entity, [key]: val };
    set_entity(new_entity);
    setError({});
  };

  return (
    <Dialog
      header="Create Document Storages"
      visible={props.show}
      closable={false}
      onHide={props.onHide}
      modal
      style={{ width: "40vw" }}
      className="min-w-max"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="documentStorages-create-dialog-component"
      >
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="name">Document Name:</label>
            <InputText
              id="name"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.name}
              onChange={(e) => setValByKey("name", e.target.value)}
              required
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["name"]) ? (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="size">Size:</label>
            <InputNumber
              id="size"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.size}
              useGrouping={false}
              onChange={(e) => setValByKey("size", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["size"]) ? (
              <p className="m-0" key="error-size">
                {error["size"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="path">Path:</label>
            <InputText
              id="path"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.path}
              onChange={(e) => setValByKey("path", e.target.value)}
              required
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["path"]) ? (
              <p className="m-0" key="error-path">
                {error["path"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="lastModifiedDate">Last Modified Date:</label>
            undefined
          </span>
          <small className="p-error">
            {!_.isEmpty(error["lastModifiedDate"]) ? (
              <p className="m-0" key="error-lastModifiedDate">
                {error["lastModifiedDate"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="lastModified">Last Modified:</label>
            <InputNumber
              id="lastModified"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.lastModified}
              onChange={(e) => setValByKey("lastModified", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["lastModified"]) ? (
              <p className="m-0" key="error-lastModified">
                {error["lastModified"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="eTag">AWS ETag:</label>
            <InputText
              id="eTag"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.eTag}
              onChange={(e) => setValByKey("eTag", e.target.value)}
              required
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["eTag"]) ? (
              <p className="m-0" key="error-eTag">
                {error["eTag"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="versionId">AWS Version Id:</label>
            <InputText
              id="versionId"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.versionId}
              onChange={(e) => setValByKey("versionId", e.target.value)}
              required
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["versionId"]) ? (
              <p className="m-0" key="error-versionId">
                {error["versionId"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="url">Url:</label>
            <InputText
              id="url"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.url}
              onChange={(e) => setValByKey("url", e.target.value)}
              required
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["url"]) ? (
              <p className="m-0" key="error-url">
                {error["url"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="tableId">Table Id:</label>
            <InputText
              id="tableId"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.tableId}
              onChange={(e) => setValByKey("tableId", e.target.value)}
              required
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["tableId"]) ? (
              <p className="m-0" key="error-tableId">
                {error["tableId"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field mt-5">
          <span className="align-items-center">
            <label htmlFor="tableName">Table Name:</label>
            <InputText
              id="tableName"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.tableName}
              onChange={(e) => setValByKey("tableName", e.target.value)}
              required
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["tableName"]) ? (
              <p className="m-0" key="error-tableName">
                {error["tableName"]}
              </p>
            ) : null}
          </small>
        </div>
        <small className="p-error">
          {Array.isArray(Object.keys(error))
            ? Object.keys(error).map((e, i) => (
                <p className="m-0" key={i}>
                  {e}: {error[e]}
                </p>
              ))
            : error}
        </small>
      </div>
    </Dialog>
  );
};

const mapState = (state) => {
  const { user } = state.auth;
  return { user };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(
  mapState,
  mapDispatch,
)(DocumentStoragesCreateDialogComponent);
