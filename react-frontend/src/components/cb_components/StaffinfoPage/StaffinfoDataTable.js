import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useRef } from "react";
import _ from "lodash";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import moment from "moment";
import UploadService from "../../../services/UploadService";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import DownloadCSV from "../../../utils/DownloadCSV";
import InboxCreateDialogComponent from "../../cb_components/InboxPage/InboxCreateDialogComponent";
import InviteIcon from "../../../assets/media/Invite.png";
import ExportIcon from "../../../assets/media/Export & Share.png";
import CopyIcon from "../../../assets/media/Clipboard.png";
import DuplicateIcon from "../../../assets/media/Duplicate.png";
import DeleteIcon from "../../../assets/media/Trash.png";

const StaffinfoDataTable = ({
  items,
  fields,
  onEditRow,
  onRowDelete,
  onRowClick,
  searchDialog,
  setSearchDialog,
  showUpload,
  setShowUpload,
  showFilter,
  setShowFilter,
  showColumns,
  setShowColumns,
  onClickSaveFilteredfields,
  selectedFilterFields,
  setSelectedFilterFields,
  selectedHideFields,
  setSelectedHideFields,
  onClickSaveHiddenfields,
  loading,
  user,
  selectedDelete,
  setSelectedDelete,
  onCreateResult,
}) => {
  const dt = useRef(null);
  const urlParams = useParams();
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [data, setData] = useState([]);

  const p_numberTemplate0 = (rowData, { rowIndex }) => <p>{rowData.empno}</p>;
  const pTemplate1 = (rowData, { rowIndex }) => <p>{rowData.name}</p>;
  const pTemplate2 = (rowData, { rowIndex }) => <p>{rowData.namenric}</p>;
  const p_numberTemplate3 = (rowData, { rowIndex }) => (
    <p>{rowData.compcode}</p>
  );
  const pTemplate4 = (rowData, { rowIndex }) => <p>{rowData.compname}</p>;
  const pTemplate5 = (rowData, { rowIndex }) => <p>{rowData.deptcode}</p>;
  const pTemplate6 = (rowData, { rowIndex }) => <p>{rowData.deptdesc}</p>;
  const p_numberTemplate7 = (rowData, { rowIndex }) => (
    <p>{rowData.sectcode}</p>
  );
  const pTemplate8 = (rowData, { rowIndex }) => <p>{rowData.sectdesc}</p>;
  const pTemplate9 = (rowData, { rowIndex }) => <p>{rowData.designation}</p>;
  const pTemplate10 = (rowData, { rowIndex }) => <p>{rowData.email}</p>;
  const pTemplate11 = (rowData, { rowIndex }) => <p>{rowData.resign}</p>;
  const pTemplate12 = (rowData, { rowIndex }) => <p>{rowData.supervisor}</p>;
  const p_numberTemplate13 = (rowData, { rowIndex }) => (
    <p>{rowData.datejoin}</p>
  );
  const pTemplate14 = (rowData, { rowIndex }) => <p>{rowData.empgroup}</p>;
  const pTemplate15 = (rowData, { rowIndex }) => <p>{rowData.empgradecode}</p>;
  const pTemplate16 = (rowData, { rowIndex }) => (
    <p>{rowData.terminationdate}</p>
  );
  const editTemplate = (rowData, { rowIndex }) => (
    <Button
      onClick={() => onEditRow(rowData, rowIndex)}
      icon={`pi ${rowData.isEdit ? "pi-check" : "pi-pencil"}`}
      className={`p-button-rounded p-button-text ${rowData.isEdit ? "p-button-success" : "p-button-warning"}`}
    />
  );
  const deleteTemplate = (rowData, { rowIndex }) => (
    <Button
      onClick={() => onRowDelete(rowData._id)}
      icon="pi pi-times"
      className="p-button-rounded p-button-danger p-button-text"
    />
  );

  const checkboxTemplate = (rowData) => (
    <Checkbox
      checked={selectedItems.some((item) => item._id === rowData._id)}
      onChange={(e) => {
        let _selectedItems = [...selectedItems];

        if (e.checked) {
          _selectedItems.push(rowData);
        } else {
          _selectedItems = _selectedItems.filter(
            (item) => item._id !== rowData._id,
          );
        }
        setSelectedItems(_selectedItems);
      }}
    />
  );
  const deselectAllRows = () => {
    // Logic to deselect all selected rows
    setSelectedItems([]); // Assuming setSelectedItems is used to manage selected items state
  };

  const handleDelete = async () => {
    if (!selectedItems || selectedItems.length === 0) return;

    try {
      const promises = selectedItems.map((item) =>
        client.service("companies").remove(item._id),
      );
      await Promise.all(promises);
      const updatedData = data.filter(
        (item) => !selectedItems.find((selected) => selected._id === item._id),
      );
      setData(updatedData);
      setSelectedDelete(selectedItems.map((item) => item._id));

      deselectAllRows();
    } catch (error) {
      console.error("Failed to delete selected records", error);
    }
  };

  const handleMessage = () => {
    setShowDialog(true); // Open the dialog
  };

  const handleHideDialog = () => {
    setShowDialog(false); // Close the dialog
  };

  return (
    <>
      <DataTable
        value={items}
        ref={dt}
        removableSort
        onRowClick={onRowClick}
        scrollable
        rowHover
        stripedRows
        paginator
        rows={10}
        rowsPerPageOptions={[10, 50, 250, 500]}
        size={"small"}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        rowClassName="cursor-pointer"
        alwaysShowPaginator={!urlParams.singleUsersId}
        selection={selectedItems}
        onSelectionChange={(e) => setSelectedItems(e.value)}
        onCreateResult={onCreateResult}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
          body={checkboxTemplate}
        />
        <Column
          field="empno"
          header="Empno"
          body={p_numberTemplate0}
          filter={selectedFilterFields.includes("empno")}
          hidden={selectedHideFields?.includes("empno")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="name"
          header="Name"
          body={pTemplate1}
          filter={selectedFilterFields.includes("name")}
          hidden={selectedHideFields?.includes("name")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="namenric"
          header="Namenric"
          body={pTemplate2}
          filter={selectedFilterFields.includes("namenric")}
          hidden={selectedHideFields?.includes("namenric")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="compcode"
          header="Compcode"
          body={p_numberTemplate3}
          filter={selectedFilterFields.includes("compcode")}
          hidden={selectedHideFields?.includes("compcode")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="compname"
          header="Compname"
          body={pTemplate4}
          filter={selectedFilterFields.includes("compname")}
          hidden={selectedHideFields?.includes("compname")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="deptcode"
          header="Deptcode"
          body={pTemplate5}
          filter={selectedFilterFields.includes("deptcode")}
          hidden={selectedHideFields?.includes("deptcode")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="deptdesc"
          header="Deptdesc"
          body={pTemplate6}
          filter={selectedFilterFields.includes("deptdesc")}
          hidden={selectedHideFields?.includes("deptdesc")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="sectcode"
          header="Sectcode"
          body={p_numberTemplate7}
          filter={selectedFilterFields.includes("sectcode")}
          hidden={selectedHideFields?.includes("sectcode")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="sectdesc"
          header="Sectdesc"
          body={pTemplate8}
          filter={selectedFilterFields.includes("sectdesc")}
          hidden={selectedHideFields?.includes("sectdesc")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="designation"
          header="Designation"
          body={pTemplate9}
          filter={selectedFilterFields.includes("designation")}
          hidden={selectedHideFields?.includes("designation")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="email"
          header="Email"
          body={pTemplate10}
          filter={selectedFilterFields.includes("email")}
          hidden={selectedHideFields?.includes("email")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="resign"
          header="Resign"
          body={pTemplate11}
          filter={selectedFilterFields.includes("resign")}
          hidden={selectedHideFields?.includes("resign")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="supervisor"
          header="Supervisor"
          body={pTemplate12}
          filter={selectedFilterFields.includes("supervisor")}
          hidden={selectedHideFields?.includes("supervisor")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="datejoin"
          header="Datejoin"
          body={p_numberTemplate13}
          filter={selectedFilterFields.includes("datejoin")}
          hidden={selectedHideFields?.includes("datejoin")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="empgroup"
          header="Empgroup"
          body={pTemplate14}
          filter={selectedFilterFields.includes("empgroup")}
          hidden={selectedHideFields?.includes("empgroup")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="empgradecode"
          header="Empgradecode"
          body={pTemplate15}
          filter={selectedFilterFields.includes("empgradecode")}
          hidden={selectedHideFields?.includes("empgradecode")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="terminationdate"
          header="Terminationdate"
          body={pTemplate16}
          filter={selectedFilterFields.includes("terminationdate")}
          hidden={selectedHideFields?.includes("terminationdate")}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column header="Edit" body={editTemplate} />
        <Column header="Delete" body={deleteTemplate} />
      </DataTable>

      {selectedItems.length > 0 ? (
        <div
          className="card center"
          style={{
            width: "51rem",
            margin: "20px auto 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px",
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
            color: "#2A4454",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #2A4454",
              padding: "5px",
              borderRadius: "5px",
            }}
          >
            {selectedItems.length} selected
            <span
              className="pi pi-times"
              style={{
                cursor: "pointer",
                marginLeft: "10px",
                color: "#2A4454",
              }}
              onClick={() => {
                deselectAllRows();
              }}
            />
          </div>

          {/* New buttons section */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Copy button */}
            <Button
              label="Copy"
              labelposition="right"
              icon={
                <img
                  src={CopyIcon}
                  style={{ marginRight: "4px", width: "1em", height: "1em" }}
                />
              }
              // tooltip="Copy"
              // onClick={handleCopy}
              className="p-button-rounded p-button-text"
              style={{
                backgroundColor: "white",
                color: "#2A4454",
                border: "1px solid transparent",
                transition: "border-color 0.3s",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                marginRight: "8px",
                gap: "4px",
              }}
            />

            {/* Duplicate button */}
            <Button
              label="Duplicate"
              labelposition="right"
              icon={
                <img
                  src={DuplicateIcon}
                  style={{ marginRight: "4px", width: "1em", height: "1em" }}
                />
              }
              // tooltip="Duplicate"
              // onClick={handleDuplicate}
              className="p-button-rounded p-button-text"
              style={{
                backgroundColor: "white",
                color: "#2A4454",
                border: "1px solid transparent",
                transition: "border-color 0.3s",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                marginRight: "8px",
                gap: "4px",
              }}
            />

            {/* Export button */}
            <Button
              label="Export"
              labelposition="right"
              icon={
                <img
                  src={ExportIcon}
                  style={{ marginRight: "4px", width: "1em", height: "1em" }}
                />
              }
              // tooltip="Export"
              // onClick={handleExport}
              className="p-button-rounded p-button-text"
              style={{
                backgroundColor: "white",
                color: "#2A4454",
                border: "1px solid transparent",
                transition: "border-color 0.3s",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                marginRight: "8px",
                gap: "4px",
              }}
            />

            {/* Message button */}
            <Button
              label="Message"
              labelposition="right"
              icon={
                <img
                  src={InviteIcon}
                  style={{ marginRight: "4px", width: "1em", height: "1em" }}
                />
              }
              onClick={handleMessage}
              className="p-button-rounded p-button-text"
              style={{
                backgroundColor: "white",
                color: "#2A4454",
                border: "1px solid transparent",
                transition: "border-color 0.3s",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                marginRight: "8px",
                gap: "4px",
              }}
            />

            {/* InboxCreateDialogComponent */}
            <InboxCreateDialogComponent
              show={showDialog}
              onHide={handleHideDialog}
              serviceInbox="companies"
              onCreateResult={onCreateResult}
              // selectedItemsId={selectedItems.map(item => item._id)}
              selectedItemsId={selectedItems}
            />

            {/* <div style={{ display: 'flex', alignItems: 'center' }}> */}
            <Button
              label="Delete"
              labelposition="right"
              icon={
                <img
                  src={DeleteIcon}
                  style={{ marginRight: "4px", width: "1em", height: "1em" }}
                />
              }
              onClick={handleDelete}
              style={{
                backgroundColor: "white",
                color: "#2A4454",
                border: "1px solid transparent",
                transition: "border-color 0.3s",
                fontSize: "14px",
                fontFamily: "Arial, sans-serif",
                gap: "4px",
              }}
            />
          </div>
        </div>
      ) : null}

      <Dialog
        header="Upload Staffinfo Data"
        visible={showUpload}
        onHide={() => setShowUpload(false)}
      >
        <UploadService
          user={user}
          serviceName="staffinfo"
          onUploadComplete={() => {
            setShowUpload(false); // Close the dialog after upload
          }}
        />
      </Dialog>

      <Dialog
        header="Search Staffinfo"
        visible={searchDialog}
        onHide={() => setSearchDialog(false)}
      >
        Search
      </Dialog>
      <Dialog
        header="Filter Users"
        visible={showFilter}
        onHide={() => setShowFilter(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedFilterFields}
            onChange={(e) => setSelectedFilterFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            console.log(selectedFilterFields);
            onClickSaveFilteredfields(selectedFilterFields);
            setSelectedFilterFields(selectedFilterFields);
            setShowFilter(false);
          }}
        ></Button>
      </Dialog>

      <Dialog
        header="Hide Columns"
        visible={showColumns}
        onHide={() => setShowColumns(false)}
      >
        <div className="card flex justify-content-center">
          <MultiSelect
            value={selectedHideFields}
            onChange={(e) => setSelectedHideFields(e.value)}
            options={fields}
            optionLabel="name"
            optionValue="value"
            filter
            placeholder="Select Fields"
            maxSelectedLabels={6}
            className="w-full md:w-20rem"
          />
        </div>
        <Button
          text
          label="save as pref"
          onClick={() => {
            console.log(selectedHideFields);
            onClickSaveHiddenfields(selectedHideFields);
            setSelectedHideFields(selectedHideFields);
            setShowColumns(false);
          }}
        ></Button>
      </Dialog>
    </>
  );
};

export default StaffinfoDataTable;
