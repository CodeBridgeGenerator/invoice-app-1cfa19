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
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";

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

const InvoicesCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [companyId, setCompanyId] = useState([]);
  const [itemId, setItemId] = useState([]);

  useEffect(() => {
    set_entity(props.entity);
  }, [props.entity, props.show]);

  useEffect(() => {
    //on mount companies
    client
      .service("companies")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleCompaniesId,
        },
      })
      .then((res) => {
        setCompanyId(
          res.data.map((e) => {
            return { name: e["name"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Companies",
          type: "error",
          message: error.message || "Failed get companies",
        });
      });
  }, []);
  useEffect(() => {
    //on mount items
    client
      .service("items")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleItemsId,
        },
      })
      .then((res) => {
        setItemId(
          res.data.map((e) => {
            return { name: e["details"], value: e._id };
          }),
        );
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Items",
          type: "error",
          message: error.message || "Failed get items",
        });
      });
  }, []);

  const onSave = async () => {
    let _data = {
      companyId: _entity?.companyId?._id,
      itemId: _entity?.itemId?._id,
      quantity: _entity?.quantity,
      subTotal: _entity?.subTotal,
      discount: _entity?.discount,
      total: _entity?.total,
    };

    setLoading(true);
    try {
      await client.service("invoices").patch(_entity._id, _data);
      const eagerResult = await client.service("invoices").find({
        query: {
          $limit: 10000,
          _id: { $in: [_entity._id] },
          $populate: [
            {
              path: "companyId",
              service: "companies",
              select: ["name"],
            },
            {
              path: "itemId",
              service: "items",
              select: ["details"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Edit info",
        message: "Info invoices updated successfully",
      });
      props.onEditResult(eagerResult.data[0]);
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

  const companyIdOptions = companyId.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const itemIdOptions = itemId.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Edit Invoices"
      visible={props.show}
      closable={false}
      onHide={props.onHide}
      modal
      style={{ width: "40vw" }}
      className="min-w-max scalein animation-ease-in-out animation-duration-1000"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="invoices-edit-dialog-component"
      >
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="companyId">Company ID:</label>
            <Dropdown
              id="companyId"
              value={_entity?.companyId?._id}
              optionLabel="name"
              optionValue="value"
              options={companyIdOptions}
              onChange={(e) => setValByKey("companyId", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["companyId"]) && (
              <p className="m-0" key="error-companyId">
                {error["companyId"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="itemId">Item ID:</label>
            <Dropdown
              id="itemId"
              value={_entity?.itemId?._id}
              optionLabel="name"
              optionValue="value"
              options={itemIdOptions}
              onChange={(e) => setValByKey("itemId", { _id: e.value })}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["itemId"]) && (
              <p className="m-0" key="error-itemId">
                {error["itemId"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="quantity">Quantity:</label>
            <InputNumber
              id="quantity"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.quantity}
              onChange={(e) => setValByKey("quantity", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["quantity"]) && (
              <p className="m-0" key="error-quantity">
                {error["quantity"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="subTotal">Sub Total:</label>
            <InputNumber
              id="subTotal"
              className="w-full mb-3"
              mode="currency"
              currency="MYR"
              locale="en-US"
              value={_entity?.subTotal}
              onValueChange={(e) => setValByKey("subTotal", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["subTotal"]) && (
              <p className="m-0" key="error-subTotal">
                {error["subTotal"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="discount">Discount:</label>
            <InputNumber
              id="discount"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.discount}
              onChange={(e) => setValByKey("discount", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["discount"]) && (
              <p className="m-0" key="error-discount">
                {error["discount"]}
              </p>
            )}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="total">Total:</label>
            <InputNumber
              id="total"
              className="w-full mb-3"
              mode="currency"
              currency="MYR"
              locale="en-US"
              value={_entity?.total}
              onValueChange={(e) => setValByKey("total", e.value)}
              useGrouping={false}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["total"]) && (
              <p className="m-0" key="error-total">
                {error["total"]}
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

export default connect(mapState, mapDispatch)(InvoicesCreateDialogComponent);
