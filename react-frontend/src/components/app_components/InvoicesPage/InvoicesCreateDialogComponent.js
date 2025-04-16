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

const InvoicesCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [companyId, setCompanyId] = useState([]);
  const [itemId, setItemId] = useState([]);
  const [availableItemQuantity, setAvailableItemQuantity] = useState(null);
  const [itemPrice, setItemPrice] = useState(0);

  useEffect(() => {
    let init = {};
    if (!_.isEmpty(props?.entity)) {
      init = initilization(
        { ...props?.entity, ...init },
        [companyId, itemId],
        setError,
      );
    }
    set_entity({ ...init });
    setError({});
  }, [props.show]);

  const validate = () => {
    const error = {};
    const qty = _entity?.quantity || 0;

    if (!_entity?.companyId?._id) error.companyId = "Company is required";
    if (!_entity?.itemId?._id) error.itemId = "Item is required";
    if (!qty || qty <= 0) error.quantity = "Quantity must be greater than 0";

    if (availableItemQuantity !== null && qty > availableItemQuantity) {
      error.quantity = `Cannot invoice more than available (${availableItemQuantity})`;
    }

    setError(error);
    return Object.keys(error).length === 0;
  };

  const onSave = async () => {
    if (!validate()) return;
    let _data = {
      companyId: _entity?.companyId?._id,
      itemId: _entity?.itemId?._id,
      quantity: _entity?.quantity,
      subTotal: _entity?.subTotal,
      discount: _entity?.discount,
      total: _entity?.total,
      createdBy: props.user._id,
      updatedBy: props.user._id,
    };

    setLoading(true);

    try {
      const result = await client.service("invoices").create(_data);
      const eagerResult = await client.service("invoices").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
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
        title: "Create info",
        message: "Info Invoices updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
    } catch (error) {
      console.log("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Invoices",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount companies
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
    // on mount items
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

  useEffect(() => {
    // calculate subtotal
    const quantity = _entity?.quantity || 0;
    const subTotal = quantity * itemPrice;

    set_entity((prev) => ({
      ...prev,
      subTotal,
    }));
  }, [_entity?.quantity, itemPrice]);

  useEffect(() => {
    // calculate total
    const subTotal = _entity?.subTotal || 0;
    const discountPercent = _entity?.discount || 0;

    const discountAmount = (subTotal * discountPercent) / 100;
    const total = subTotal - discountAmount;

    set_entity((prev) => ({
      ...prev,
      total,
    }));
  }, [_entity?.subTotal, _entity?.discount]);

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
      header="Create Invoices"
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
        role="invoices-create-dialog-component"
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
            {!_.isEmpty(error["companyId"]) ? (
              <p className="m-0" key="error-companyId">
                {error["companyId"]}
              </p>
            ) : null}
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
              onChange={async (e) => {
                const selectedItem = e.value;
                setValByKey("itemId", { _id: selectedItem });

                try {
                  const itemData = await client
                    .service("items")
                    .get(selectedItem);
                  setAvailableItemQuantity(itemData.quantity); // assuming the item has a 'quantity' field
                  setItemPrice(itemData.price || 0); // Assuming your item has a 'price' field
                } catch (err) {
                  console.log(err);
                  props.alert({
                    type: "error",
                    title: "Item Load",
                    message: "Failed to fetch item details",
                  });
                }
              }}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["itemId"]) ? (
              <p className="m-0" key="error-itemId">
                {error["itemId"]}
              </p>
            ) : null}
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
            />
          </span>
          {availableItemQuantity !== null && (
            <small className="text-xs text-gray-600">
              Available: {availableItemQuantity}
            </small>
          )}
          <small className="p-error">
            {!_.isEmpty(error["quantity"]) ? (
              <p className="m-0" key="error-quantity">
                {error["quantity"]}
              </p>
            ) : null}
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
              disabled
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["subTotal"]) ? (
              <p className="m-0" key="error-subTotal">
                {error["subTotal"]}
              </p>
            ) : null}
          </small>
        </div>
        <div className="col-12 md:col-6 field">
          <span className="align-items-center">
            <label htmlFor="discount">Discount:</label>
            <InputNumber
              id="discount"
              className="w-full mb-3 p-inputtext-sm"
              value={_entity?.discount}
              onValueChange={(e) => {
                const raw = e.value || 0;
                const clamped = Math.min(100, Math.max(0, raw)); // clamp between 0–100
                setValByKey("discount", clamped);
              }}
              mode="decimal"
              suffix="%"
              min={0}
              max={100}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["discount"]) ? (
              <p className="m-0" key="error-discount">
                {error["discount"]}
              </p>
            ) : null}
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
              disabled
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["total"]) ? (
              <p className="m-0" key="error-total">
                {error["total"]}
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

export default connect(mapState, mapDispatch)(InvoicesCreateDialogComponent);
