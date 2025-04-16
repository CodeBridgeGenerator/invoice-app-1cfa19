// REACT 18 TEMPLATE - <Service>Page.js

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import PromptsDatatable from "./PromptsDataTable";

const PromptsPage = (props) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    //on mount
    client
      .service("prompts")
      .find({
        query: {
          $limit: 10000,
          $sort: { createdAt: -1 },
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
            {
              path: "chatAiId",
              service: "chatai",
              select: ["name"],
            },
            {
              path: "configid",
              service: "config",
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
          title: "Prompts",
          type: "error",
          message: error.message || "Failed get prompts",
        });
      });
  }, []);

  const onRowClick = ({ data }) => {
    navigate(`/prompts/${data._id}`);
  };

  return (
    <div className="mt-5">
      <div className="grid">
        <div className="col-12 flex align-items-center justify-content-start">
          <h4 className="mb-0 ml-2">
            <span className="text-sm">Gen Ai / </span>
            <strong>Prompts </strong>
          </h4>
        </div>
      </div>
      <div className="grid align-items-center">
        <div className="col-12" role="prompts-datatable">
          <PromptsDatatable items={data} onRowClick={onRowClick} />
        </div>
      </div>
    </div>
  );
};
const mapState = (state) => ({
  //
});
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
  getSchema: (serviceName) => dispatch.db.getSchema(serviceName),
});

export default connect(mapState, mapDispatch)(PromptsPage);
