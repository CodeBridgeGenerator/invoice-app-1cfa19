import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import client from "../../../services/restClient";
import { Button } from "primereact/button";
import CommentsSection from "../../common/CommentsSection";
import ProjectLayout from "../../Layouts/ProjectLayout";

const SingleDocumentStoragesPage = (props) => {
  const navigate = useNavigate();
  const urlParams = useParams();
  const [_entity, set_entity] = useState({});

  useEffect(() => {
    //on mount
    client
      .service("documentStorages")
      .get(urlParams.singleDocumentStoragesId, {
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
          ],
        },
      })
      .then((res) => {
        set_entity(res || {});
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "DocumentStorages",
          type: "error",
          message: error.message || "Failed get documentStorages",
        });
      });
  }, [props, urlParams.singleDocumentStoragesId]);

  const goBack = () => {
    navigate("/documentStorages");
  };

  return (
    <ProjectLayout>
      <div className="col-12 flex flex-column align-items-center">
        <div className="col-10">
          <div className="flex align-items-center justify-content-start">
            <Button
              className="p-button-text"
              icon="pi pi-chevron-left"
              onClick={() => goBack()}
            />
            <h3 className="m-0">Document Storages</h3>
          </div>
          <p>documentStorages/{urlParams.singleDocumentStoragesId}</p>
          {/* ~cb-project-dashboard~ */}
        </div>
        <div className="card w-full">
          <div className="grid ">
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Document Name</label>
              <p className="m-0 ml-3">{_entity?.name}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Size</label>
              <p className="m-0 ml-3">{Number(_entity?.size)}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Path</label>
              <p className="m-0 ml-3">{_entity?.path}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Last Modified</label>
              <p className="m-0 ml-3">{Number(_entity?.lastModified)}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">AWS ETag</label>
              <p className="m-0 ml-3">{_entity?.eTag}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">AWS Version Id</label>
              <p className="m-0 ml-3">{_entity?.versionId}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Url</label>
              <p className="m-0 ml-3">{_entity?.url}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Table Id</label>
              <p className="m-0 ml-3">{_entity?.tableId}</p>
            </div>
            <div className="col-12 md:col-6 lg:col-3">
              <label className="text-sm text-primary">Table Name</label>
              <p className="m-0 ml-3">{_entity?.tableName}</p>
            </div>

            <div className="col-12">&nbsp;</div>
          </div>
        </div>
      </div>
      <CommentsSection
        recordId={urlParams.singleDocumentStoragesId}
        user={props.user}
        alert={props.alert}
        serviceName="documentStorages"
      />
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

export default connect(mapState, mapDispatch)(SingleDocumentStoragesPage);
