import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import MailQuesDatatable from "./MailQuesDataTable";

const MailQuesPage = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const urlParams = useParams();

  useEffect(() => {
    //on mount
    setLoading(true);
    client
      .service("mailQues")
      .find({
        query: {
          $limit: 10000,
          templateId: urlParams.singleTemplatesId,
          $sort: {
            createdAt: -1,
          },
          $populate: [
            {
              path: "templateId",
              service: "templates",
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
          title: "MailQuest",
          type: "error",
          message: error.message || "Failed get MailQuest",
        });
      });
  }, []);

  const onRowClick = ({ data }) => {
    navigate(`/mailQues/${data._id}`);
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
            <strong>Mail Jobs </strong>
          </h4>
        </div>
      </div>
      <div className="grid align-items-center">
        <div className="col-12" role="mailQues-datatable">
          <MailQuesDatatable
            items={data}
            loading={loading}
            onRowClick={onRowClick}
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

export default connect(mapState, mapDispatch)(MailQuesPage);
