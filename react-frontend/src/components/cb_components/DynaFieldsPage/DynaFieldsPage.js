import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import DynaFieldsDatatable from "./DynaFieldsDataTable";
import config from "../../../resources/config.json";
import standard from "../../../resources/standard.json";

const DynaFieldsPage = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const urlParams = useParams();

  useEffect(() => {
    //on mount
    client
      .service("dynaFields")
      .find({
        query: {
          $limit: 10000,
          dynaLoader: urlParams.singleDynaLoaderId,
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
              path: "dynaLoader",
              service: "dyna_loader",
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
          title: "Dyna Fields",
          type: "error",
          message: error.message || "Failed get Dyna Fields",
        });
      });
  }, []);

  return (
    <div className="mt-5">
      <div className="grid">
        <div className="col-6 flex justify-content-start">
          <h3 className="mb-0 ml-2">Dyna Fields </h3>
        </div>
      </div>
      <div className="grid align-items-center">
        <div className="col-12" role="dynaFields-datatable">
          <DynaFieldsDatatable items={data} loading={loading} />
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

export default connect(mapState, mapDispatch)(DynaFieldsPage);
