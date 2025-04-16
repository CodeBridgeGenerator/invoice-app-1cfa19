import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import client from "../../../services/restClient";
import _ from "lodash";
import JobQuesDatatable from "./JobQuesDataTable";

const JobQuesPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("jobQues")
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
      })
      .catch((error) => {
        console.log({ error });
        props.alert({
          title: "Job Ques",
          type: "error",
          message: error.message || "Failed get Job Ques",
        });
      });
  }, []);

  return (
    <div className="mt-5">
      <div className="grid">
        <div className="col-6 flex justify-content-start">
          <h4 className="mb-0 ml-2">
            <span>
              {" "}
              <small>Admin</small> /{" "}
            </span>
            <strong>Dynaloader Jobs </strong>
          </h4>
        </div>
      </div>
      <div className="grid align-items-center">
        <div className="col-12" role="jobQues-datatable">
          <JobQuesDatatable items={data} loading={loading} />
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

export default connect(mapState, mapDispatch)(JobQuesPage);
