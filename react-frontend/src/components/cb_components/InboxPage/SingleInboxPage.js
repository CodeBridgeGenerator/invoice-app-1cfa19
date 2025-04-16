import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import client from "../../../services/restClient";
import { Tag } from "primereact/tag";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import ProjectLayout from "../../Layouts/ProjectLayout";
import { Avatar } from "primereact/avatar";
import { Calendar } from "primereact/calendar";
import { Chip } from "primereact/chip";
const SingleInboxPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});
  const { service } = props;

  const [from, setFrom] = useState([]);
  const [toUser, setToUser] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("inbox")
      .get(urlParams.singleInboxId, {
        query: {
          $populate: [
            {
              path: "createdBy",
              service: "users",
              select: ["name"],
            },
            {
              path: "updatedBy",
              service: "users",
              select: ["name"],
            },
            "from",
            "toUser",
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
        const from = Array.isArray(res.from)
          ? res.from.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.from
            ? [{ _id: res.from._id, name: res.from.name }]
            : [];
        setFrom(from);
        const toUser = Array.isArray(res.toUser)
          ? res.toUser.map((elem) => ({ _id: elem._id, name: elem.name }))
          : res.toUser
            ? [{ _id: res.toUser._id, name: res.toUser.name }]
            : [];
        setToUser(toUser);
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Inbox",
          type: "error",
          message: error.message || "Failed get inbox",
        });
      });
  }, [props, urlParams.singleInboxId]);

  const goBack = () => {
    navigate("/inbox");
  };

  return (
    <ProjectLayout>
      <div className="flex align-items-center justify-content-between mb-3">
        <div className="flex align-items-center">
          <Button
            className="p-button-text"
            icon="pi pi-chevron-left"
            onClick={() => goBack()}
          />
          <h3
            className="m-0 ml-2"
            // style={{ color: "#D30000"}}
          >
            Inbox
          </h3>
        </div>
      </div>
      <div className="surface-card p-4 shadow-2 border-round w-full">
        <div className="grid">
          <div className="col-12">
            <div className="flex align-items-center justify-between">
              <div className="flex align-items-center">
                <Avatar
                  label={from[0]?.name?.substring(0, 1) || ""}
                  className="mr-2"
                  size="large"
                  style={{
                    backgroundColor: "#D30000",
                    color: "#ffffff",
                    borderRadius: "50%",
                  }}
                />

                <div>
                  <div className="font-bold text-lg">{from[0]?.name}</div>
                  <div className="text-sm text-gray-600">
                    To: {toUser[0]?.name}
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {moment(_entity?.sent).format("MMMM Do YYYY, h:mm a")}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="text-xl font-medium mb-3">
              {_entity?.subject}
              {_entity?.service && (
                <Chip label={_entity?.service} className="ml-2" />
              )}
            </div>
            <div
              className="text-gray-800"
              dangerouslySetInnerHTML={{ __html: _entity?.content }}
            />
          </div>
        </div>
      </div>
    </ProjectLayout>
  );
};

const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};

const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(SingleInboxPage);
