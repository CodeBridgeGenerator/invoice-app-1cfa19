import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";

const getSchemaValidationErrorsStrings = (errorObj) => {
  let errMsg = {};
  for (const key in errorObj.errors) {
    if (Object.hasOwnProperty.call(errorObj.errors, key)) {
      const element = errorObj.errors[key];
      if (element?.message) {
        errMsg.push(element.message);
      }
    }
  }
  return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const CompaniesCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  const onSave = async () => {
    let _data = {
      name: _entity?.name,
      companyNo: _entity?.companyNo,
      newCompanyNumber: _entity?.newCompanyNumber,
      DateIncorporated: _entity?.DateIncorporated,
      isdefault: _entity?.isdefault,
    };

    setLoading(true);
    try {
      const result = await client
        .service("companies")
        .patch(_entity._id, _data);
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info companies updated successfully",
      });
      props.onEditResult(result);
    } catch (error) {
      console.log("error", error);
      setError(
        getSchemaValidationErrorsStrings(error) || "Failed to update info",
      );
      props.alert({
        type: "error",
        title: "Edit info",
        message: "Failed to update info",
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
      header="Edit Companies"
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
        role="companies-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="name">Name:</label>
            <InputText
              id="name"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.name}
              onChange={(e) => setValByKey("name", e.target.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["name"]) && (
              <p className="m-0" key="error-name">
                {error["name"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="companyNo">Company no:</label>
            <InputText
              id="companyNo"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.companyNo}
              onChange={(e) => setValByKey("companyNo", e.target.value)}
              required
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["companyNo"]) && (
              <p className="m-0" key="error-companyNo">
                {error["companyNo"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="newCompanyNumber">New company number:</label>
            <InputNumber
              id="newCompanyNumber"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.newCompanyNumber}
              useGrouping={false}
              onChange={(e) => setValByKey("newCompanyNumber", e.value)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["newCompanyNumber"]) && (
              <p className="m-0" key="error-newCompanyNumber">
                {error["newCompanyNumber"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="DateIncorporated">Date Incorporated:</label>
            <Calendar
              id="DateIncorporated"
              value={
                _entity?.DateIncorporated
                  ? new Date(_entity?.DateIncorporated)
                  : new Date()
              }
              onChange={(e) =>
                setValByKey("DateIncorporated", new Date(e.target.value))
              }
              showIcon
              showButtonBar
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["DateIncorporated"]) && (
              <p className="m-0" key="error-DateIncorporated">
                {error["DateIncorporated"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field flex">
          <span className="align-items-center">
            <label htmlFor="isdefault">Is default:</label>
            <Checkbox
              id="isdefault"
              className="ml-3"
              checked={_entity?.isdefault}
              onChange={(e) => setValByKey("isdefault", e.checked)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["isdefault"]) && (
              <p className="m-0" key="error-isdefault">
                {error["isdefault"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12">&nbsp;</div>
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

export default connect(mapState, mapDispatch)(CompaniesCreateDialogComponent);
