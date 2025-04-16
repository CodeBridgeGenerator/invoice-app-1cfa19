import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import MailsDatatable from "./MailsDataTable";

const MailsPage = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    //on mount
    setLoading(true);
    client
      .service("mails")
      .find({
        query: {
          $limit: 10000,
          $populate: [
            {
              path: "createdBy",
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
          title: "Mail Logs",
          type: "error",
          message: error.message || "Failed get Mail Logs",
        });
      });
  }, []);

  const onRowClick = ({ data }) => {
    navigate(`/mails/${data._id}`);
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
            <strong>Mail Logs </strong>
          </h4>
        </div>
      </div>
      <div className="grid align-items-center">
        <div className="col-12" role="mails-datatable">
          <MailsDatatable
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

export default connect(mapState, mapDispatch)(MailsPage);
