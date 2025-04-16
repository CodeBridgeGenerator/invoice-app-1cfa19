import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import entityCreate from "../../../utils/entity";
import AreYouSureDialog from "../../common/AreYouSureDialog";
import InboxDatatable from "./InboxDataTable";

const InboxPage = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fields, setFields] = useState([]);
  const [showAreYouSureDialog, setShowAreYouSureDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newRecord, setRecord] = useState({});
  const [showFakerDialog, setShowFakerDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showDeleteSelectedDialog, setShowDeleteSelectedDialog] =
    useState(false);
  const [selectedEntityIndex, setSelectedEntityIndex] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilterFields, setSelectedFilterFields] = useState([]);
  const [selectedHideFields, setSelectedHideFields] = useState([]);
  const [showColumns, setShowColumns] = useState(false);
  const [searchDialog, setSearchDialog] = useState(false);
  const [items, setItems] = useState([]);
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [selectedDelete, setSelectedDelete] = useState([]);
  const urlParams = useParams();

  const currentUserId = props.user._id;
  const service = props.service || "common";

  const handleInboxItemsChange = (updatedItems) => {
    setData(updatedItems);
  };

  useEffect(() => {
    const _getSchema = async () => {
      const _schema = await props.getSchema("inbox");
      let _fields = _schema.data.map((field, i) => i > 5 && field.field);
      setSelectedHideFields(_fields);
      _fields = _schema.data.map((field, i) => {
        return {
          name: field.field,
          value: field.field,
          type: field?.properties?.type,
        };
      });
      // Add service field to schema for display
      _fields.push({ name: "service", value: "service", type: "text" });
      setFields(_fields);
    };
    _getSchema();
    if (location?.state?.action === "create") {
      entityCreate(location, setRecord);
      setShowCreateDialog(true);
    } else if (location?.state?.action === "edit") {
      setShowCreateDialog(true);
    }
  }, [flaggedItems, selectedDelete]);

  useEffect(() => {
    //on mount
    setLoading(true);
    client
      .service("inbox")
      .find({
        query: {
          $limit: 10000,
          from: urlParams.singleUsersId,
          toUser: urlParams.singleUsersId,
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
              path: "from",
              service: "users",
              select: ["name"],
            },
            {
              path: "toUser",
              service: "users",
              select: ["name"],
            },
          ],
        },
      })
      .then((res) => {
        const results = res.data
          .filter(
            (record) =>
              record.from._id === currentUserId ||
              record.toUser._id === currentUserId,
          )
          .map((record) => ({
            ...record,
            service: record.service,
          }));

        setData(results);
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error });
        setLoading(false);
        props.alert({
          title: "Inbox",
          type: "error",
          message: error.message || "Failed get Inbox",
        });
      });
  }, [selectedDelete]);

  const onClickSaveFilteredfields = (ff) => {
    console.log(ff);
  };

  const onClickSaveHiddenfields = (ff) => {
    console.log(ff);
  };

  const markAllAsRead = async () => {
    try {
      for (const message of data) {
        await client.service("inbox").patch(message._id, { read: true });
      }

      setData((prevData) => prevData.map((item) => ({ ...item, read: true })));
    } catch (error) {
      console.error("Failed to mark all messages as read", error);
    }
  };

  const markAllAsUnread = async () => {
    try {
      for (const message of data) {
        await client.service("inbox").patch(message._id, { read: false });
      }

      setData((prevData) => prevData.map((item) => ({ ...item, read: false })));
    } catch (error) {
      console.error("Failed to mark all messages as read", error);
    }
  };

  const onShowDeleteAll = (rowData, rowIndex) => {
    setShowDeleteAllDialog(true);
  };

  const onDeleteSelected = (rowData, rowIndex) => {
    setShowDeleteSelectedDialog(true);
  };

  const deleteAll = async () => {
    if (process.env.REACT_APP_ENV !== "development") {
      props.alert({
        title: "Delete is disabled for non-dev envs",
        type: "error",
        message: "Delete is not recommended.",
      });
      return;
    }

    setShowDeleteAllDialog(false);
    const countDataItems = data?.length;
    const promises = data.map((e) => client.service("inbox").remove(e._id));
    await Promise.all(
      promises.map((p) =>
        p.catch((error) => {
          props.alert({
            title: "Inbox",
            type: "error",
            message: error.message || "Failed to delete all records",
          });
          console.log({ error });
        }),
      ),
    );
    await props.alert({
      title: "Inbox",
      type: "warn",
      message: `Successfully dropped ${countDataItems} records`,
    });
  };

  const deleteSelected = async () => {
    if (!selectedItems || selectedItems.length === 0) return;

    try {
      // Assuming `client` is your FeathersJS service client
      const promises = selectedItems.map((item) =>
        client.service("inbox").remove(item._id),
      );

      // Wait for all deletions to complete
      await Promise.all(promises);

      // After deletion, update the data state by removing the deleted records
      const updatedData = data.filter(
        (item) => !selectedItems.find((selected) => selected._id === item._id),
      );
      setData(updatedData);

      // Clear selected items after deletion
      deselectAllRows();

      // Optionally, show a success alert
      props.alert({
        title: "Inbox",
        type: "success",
        message: "Selected records have been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete selected records", error);
      props.alert({
        title: "Inbox",
        type: "error",
        message: error.message || "Failed to delete selected records",
      });
    }
  };

  const onRowClick = async ({ data }) => {
    // Check if the current user is the 'toUser'
    if (data.toUser._id === currentUserId && !data.read) {
      try {
        // Update the 'read' status to true
        await client.service("inbox").patch(data._id, { read: true });

        //  Update the local state to reflect the change
        setData((prevData) =>
          prevData.map((item) =>
            item._id === data._id ? { ...item, read: true } : item,
          ),
        );
      } catch (error) {
        console.error("Failed to update read status", error);
        props.alert({
          title: "Inbox",
          type: "error",
          message: error.message || "Failed to update message as read",
        });
      }
    }

    // Navigate to the message details
    navigate(`/inbox/${data._id}`);
  };

  return (
    <div className="mt-5">
      <div className="grid align-items-center">
        <div className="col-12" role="inbox-datatable">
          <InboxDatatable
            items={data}
            setItems={setData}
            flaggedItems={flaggedItems}
            setFlaggedItems={setFlaggedItems}
            selectedDelete={selectedDelete}
            setSelectedDelete={setSelectedDelete}
            fields={fields}
            onRowClick={onRowClick}
            searchDialog={searchDialog}
            setSearchDialog={setSearchDialog}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            showColumns={showColumns}
            setShowColumns={setShowColumns}
            onClickSaveFilteredfields={onClickSaveFilteredfields}
            selectedFilterFields={selectedFilterFields}
            setSelectedFilterFields={setSelectedFilterFields}
            selectedHideFields={selectedHideFields}
            setSelectedHideFields={setSelectedHideFields}
            onClickSaveHiddenfields={onClickSaveHiddenfields}
            loading={loading}
            user={props.user}
            markAllAsRead={markAllAsRead}
            markAllAsUnread={markAllAsUnread}
            onDeleteAll={onShowDeleteAll}
            onInboxItemsChange={handleInboxItemsChange}
            onDeleteSelected={onDeleteSelected}
          />
        </div>
      </div>
      <AreYouSureDialog
        header="Delete"
        body="Are you sure you want to delete this record?"
        show={showAreYouSureDialog}
        onHide={() => setShowAreYouSureDialog(false)}
        onYes={() => deleteRow()}
      />
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

export default connect(mapState, mapDispatch)(InboxPage);
