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

const DynaLoaderDataTable = ({
  items,
  fields,
  onEditRow,
  onRowDelete,
  onRowClick,
  loading,
  user,
}) => {
  const dt = useRef(null);
  const urlParams = useParams();

  const pTemplate0 = (rowData, { rowIndex }) => <p>{rowData.from}</p>;
  const pTemplate1 = (rowData, { rowIndex }) => <p>{rowData.to2}</p>;
  const pTemplate2 = (rowData, { rowIndex }) => <p>{rowData.name}</p>;
  const editTemplate = (rowData, { rowIndex }) => (
    <Button
      onClick={() => onEditRow(rowData, rowIndex)}
      icon={`pi ${rowData.isEdit ? "pi-check" : "pi-send"}`}
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

  return (
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
    >
      <Column
        field="from"
        header="Source"
        body={pTemplate0}
        sortable
        frozen
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="to2"
        header="Destination"
        body={pTemplate1}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="name"
        header="Action"
        body={pTemplate2}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column header="Check & run" body={editTemplate} />
      <Column header="Delete" body={deleteTemplate} />
    </DataTable>
  );
};

export default DynaLoaderDataTable;
