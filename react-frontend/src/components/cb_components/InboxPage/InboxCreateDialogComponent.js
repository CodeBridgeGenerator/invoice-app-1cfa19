import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import initilization from "../../../utils/init";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Editor } from "primereact/editor";
import { Avatar } from "primereact/avatar";
import { Chip } from "primereact/chip";

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

const InboxCreateDialogComponent = (props) => {
  const [_entity, set_entity] = useState({});
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const urlParams = useParams();
  const [from, setFrom] = useState([]);
  const [toUser, setToUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSendButtonActive, setIsSendButtonActive] = useState(false);
  const [contentLinks, setContentLinks] = useState([]);

  useEffect(() => {
    setContentLinks(
      props.selectedItemsId.map((item) => ({
        id: item._id,
        name: item.name,
        url: `http://localhost:3000/${props.serviceInbox}/${item._id}`,
      })),
    );

    let init = {
      read: false,
      sent: new Date(),
      service: props.serviceInbox || "common",
      from: props.user._id,
      content: "", // Initialize content as empty string
    };
    if (!_.isEmpty(props?.entity)) {
      init = initilization(
        { ...props?.entity, ...init },
        [from, toUser],
        setError,
      );
    }
    set_entity({ ...init });
  }, [props.show]);

  const validate = () => {
    let ret = true;
    const error = {};

    if (_.isEmpty(_entity?.content)) {
      error["content"] = `Content field is required`;
      ret = false;
    }
    if (!ret) setError(error);
    return ret;
  };

  const resetForm = () => {
    set_entity({});
    setSearchTerm("");
    setSelectedUsers([]);
    setIsSendButtonActive(false);
    setContentLinks([]);
  };

  const onSave = async () => {
    if (!validate()) return;
    const contentLinksHTML = contentLinks
      .map(
        (link) => `<div style="text-align: right;">
       <a href="${link.url}" target="_blank"><u>${link.name}</u></a><br/><br/> </div>`,
      )
      .join("");

    let _data = {
      from: props.user?._id,
      // toUser: _entity?.toUser?._id,
      toUser: selectedUsers.map((user) => user.value),
      subject: _entity?.subject,
      content: _entity?.content + contentLinksHTML,
      read: _entity?.read || false,
      sent: _entity?.sent,
      createdBy: props.user._id,
      updatedBy: props.user._id,
      service: _entity?.service,
    };

    setLoading(true);

    try {
      const result = await client.service("inbox").create(_data);
      const eagerResult = await client.service("inbox").find({
        query: {
          $limit: 10000,
          _id: { $in: [result._id] },
          $populate: [
            {
              path: "from",
              service: "users",
              select: ["name"],
            },
            {
              path: "subject",
              service: "users",
              select: ["name"],
            },
          ],
        },
      });
      props.onHide();
      props.alert({
        type: "success",
        title: "Create info",
        message: "Info Inbox updated successfully",
      });
      props.onCreateResult(eagerResult.data[0]);
      resetForm();
    } catch (error) {
      console.log("error", error);
      setError(getSchemaValidationErrorsStrings(error) || "Failed to create");
      props.alert({
        type: "error",
        title: "Create",
        message: "Failed to create in Inbox",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // on mount users
    client
      .service("users")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
          _id: urlParams.singleUsersId,
        },
      })
      .then((res) => {
        const currentUser = res.data.find(
          (user) => user._id === props.user._id,
        );

        if (currentUser) {
          setFrom([{ name: currentUser.name, value: currentUser._id }]);
        }

        setToUser(
          res.data.map((e) => ({
            name: e.name,
            value: e._id,
          })),
        );
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Users",
          type: "error",
          message: error.message || "Failed get users",
        });
      });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filteredSuggestions = toUser.filter((user) =>
        user.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm, toUser]);

  useEffect(() => {
    setIsSendButtonActive(
      selectedUsers.length > 0 && _entity.subject && _entity.content,
    );
  }, [selectedUsers, _entity.subject, _entity.content]);

  const handleUserSelect = (user) => {
    if (!selectedUsers.find((u) => u.value === user.value)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
    setSearchTerm("");
    setSuggestions([]);
  };

  const handleTagRemove = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u.value !== user.value));
  };

  const renderFooter = () => (
    <div className="flex justify-content-center mt-3">
      <Button
        label="Discard"
        className="p-button-text no-focus-effect p-button-secondary"
        onClick={() => {
          props.onHide();
          resetForm();
        }}
        style={{
          width: "400px",
          border: "1px solid #D30000",
          marginRight: "10px",
          borderRadius: "20px",
          color: "#D30000",
        }}
      />
      <Button
        label="Send message"
        onClick={onSave}
        loading={loading}
        disabled={!isSendButtonActive}
        style={{
          width: "400px",
          border: "1px solid #ccc",
          borderRadius: "20px",
        }}
      />
    </div>
  );

  const setValByKey = (key, val) => {
    let new_entity = { ..._entity, [key]: val };
    set_entity(new_entity);
    setError({});
  };
  const handleLinkRemove = (id) => {
    setContentLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
  };

  const fromOptions = from.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));
  const toUserOptions = toUser.map((elem) => ({
    name: elem.name,
    value: elem.value,
  }));

  return (
    <Dialog
      header="Message"
      visible={props.show}
      closable={false}
      onHide={() => {
        props.onHide();
        resetForm();
      }}
      modal
      style={{ width: "40vw" }}
      className="min-w-max"
      footer={renderFooter()}
      resizable={false}
    >
      <div
        className="grid p-fluid overflow-y-auto"
        style={{ maxWidth: "55vw" }}
        role="inbox-create-dialog-component"
      >
        <div className="col-12 field mt-4">
          <span className="align-items-center">
            <div
              className="flex flex-wrap"
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "5px",
                marginBottom: "-35px",
                marginTop: "-20px",
              }}
            >
              {selectedUsers.map((user) => (
                <div
                  key={user.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #2A4454",
                    padding: "5px",
                    borderRadius: "5px",
                    marginRight: "5px",
                    // backgroundColor: "#f0f0f0",
                  }}
                >
                  <Avatar
                    label={user.name ? user.name.charAt(0) : " "}
                    style={{
                      backgroundColor: "#D30000",
                      color: "#ffffff",
                      marginRight: "10px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  />
                  <span className="tag">{user.name}</span>
                  <span
                    className="pi pi-times"
                    style={{
                      cursor: "pointer",
                      marginLeft: "10px",
                      color: "#2A4454",
                    }}
                    onClick={() => handleTagRemove(user)}
                  />
                </div>
              ))}
              <InputText
                id="toUser"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="To"
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  color: "#000",
                }}
              />
            </div>
          </span>
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((user) => (
                <div
                  key={user.value}
                  onClick={() => handleUserSelect(user)}
                  className="suggestion-item"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "5px",
                    cursor: "pointer",
                  }} // Added styles for better layout
                >
                  <Avatar
                    label={user.name ? user.name.charAt(0) : "U"}
                    style={{
                      backgroundColor: "#D30000",
                      color: "#ffffff",
                      marginRight: "10px",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                    }}
                  />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-12 field mt-3" style={{ marginBottom: "-20px" }}>
          <span className="align-items-center">
            {/* <FloatLabel> */}
            <InputText
              id="subject"
              value={_entity?.subject}
              onChange={(e) => setValByKey("subject", e.target.value)}
              placeholder="Subject"
              required
            />
            {/* <label htmlFor="subject">Subject</label> */}
            {/* </FloatLabel> */}
          </span>
          <small className="p-error">
            {!_.isEmpty(error["subject"]) ? (
              <p className="m-0" key="error-subject">
                {error["subject"]}
              </p>
            ) : null}
          </small>
        </div>

        <div className="col-12 field mt-4">
          <span className="align-items-center">
            <div className="content-links md-4">
              {contentLinks.map((link, index) => (
                <Chip
                  key={link.id} // Use unique id as key
                  label={link.name}
                  className="content-link-chip"
                  removable
                  onRemove={() => handleLinkRemove(link.id)} // Remove based on unique id
                />
              ))}
            </div>
            <br />
            <Editor
              id="content"
              style={{ height: "320px" }}
              value={_entity?.content}
              onTextChange={(e) => setValByKey("content", e.htmlValue)}
            />
          </span>
          <small className="p-error">
            {!_.isEmpty(error["content"]) ? (
              <p className="m-0" key="error-stuName">
                {error["content"]}
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

export default connect(mapState, mapDispatch)(InboxCreateDialogComponent);
