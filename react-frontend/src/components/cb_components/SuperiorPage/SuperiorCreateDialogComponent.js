import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

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

const SuperiorCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [superior, setSuperior] = useState([]);
  const [subordinate, setSubordinate] = useState([]);

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization(
        { ...props?.entity, ...init },
        [superior, subordinate],
        setError,
      );
    }
    set_entity({ ...init });
  }, [props.show]);

  const validate = () => {
    let ret = true;
    const error = {};

    if (!ret) setError(error);
    return ret;
  };

  const onSave = async () => {
    if (!validate()) return;
    let _data = {
      superior: _entity?.superior?._id,
      subordinate: _entity?.subordinate?._id,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("superior").create(_data);
      const eagerResult = await client.service("superior").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
          $populate: [
            {
              path: "superior",
              service: "staffinfo",
              select: ["supervisor"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Superior updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.log("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Superior",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount staffinfo
    client
      .service("staffinfo")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleStaffinfoId,
        },
      })
      .then((res) => {
        setSuperior(
          res.data.map((e) => {
            return { name: e["supervisor"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Staffinfo",
          type: "error",
          message: error.message || "Failed get staffinfo",
        });
      });
  }, []);

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

  const superiorOptions = superior.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const subordinateOptions = subordinate.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Create Superior"
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
        role="superior-create-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="superior">Superior:</label>
            <Dropdown
              id="superior"
              value={_entity?.superior?._id}
              optionLabel="name"
              optionValue="value"
              options={superiorOptions}
              onChange={(e) => setValByKey("superior", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["superior"]) ? (
              <p className="m-0" key="error-superior">
                {error["superior"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="subordinate">Subordinate:</label>
            <Dropdown
              id="subordinate"
              value={_entity?.subordinate?._id}
              optionLabel="name"
              optionValue="value"
              options={subordinateOptions}
              onChange={(e) => setValByKey("subordinate", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["subordinate"]) ? (
              <p className="m-0" key="error-subordinate">
                {error["subordinate"]}
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

export default connect(mapState, mapDispatch)(SuperiorCreateDialogComponent);
