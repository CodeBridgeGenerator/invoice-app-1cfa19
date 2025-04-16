import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import ErrorLogsDatatable from "./ErrorLogsDataTable";

const ErrorLogsPage = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //on mount
    setLoading(true);
    client
      .service("errorLogs")
      .find({
        query: {
          $limit: 10000,
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
        let results = res.data;
        setData(results);
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
        props.alert({
          title: "Error Logs",
          type: "error",
          message: error.message || "Failed get Error Logs",
        });
      });
  }, []);

  const onRowClick = ({ data }) => {
    navigate(`/errorLogs/${data._id}`);
  };

  return (
    <div className="mt-5">
      <div className="grid">
        <div className="col-6 flex justify-content-start">
          <h4 className="mb-0 ml-2">
            <span>
              {" "}
              <small>Admin</small> /{" "}
            </span>
            <strong>Error Logs </strong>
          </h4>
        </div>
      </div>
      <div className="grid align-items-center">
        <div className="col-12" role="errorLogs-datatable">
          <ErrorLogsDatatable
            items={data}
            onRowClick={onRowClick}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};
const mapState = (state) => {
  const { user, isLoggedIn } = state.auth;
  return { user, isLoggedIn };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  getSchema: (serviceName) => dispatch.db.getSchema(serviceName),
});

export default connect(mapState, mapDispatch)(ErrorLogsPage);
