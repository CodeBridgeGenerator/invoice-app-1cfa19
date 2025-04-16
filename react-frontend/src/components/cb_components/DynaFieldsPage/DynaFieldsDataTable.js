import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useRef } from "react";
import _ from "lodash";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

const DynaFieldsDataTable = ({ items, onRowDelete }) => {
  const dt = useRef(null);
  const urlParams = useParams();

  const dropdownTemplate0 = (rowData, { rowIndex }) => (
    <p>{rowData.dynaLoader?.name}</p>
  );
  const pTemplate1 = (rowData, { rowIndex }) => <p>{rowData.from}</p>;
  const pTemplate2 = (rowData, { rowIndex }) => <p>{rowData.fromType}</p>;
  const pTemplate3 = (rowData, { rowIndex }) => <p>{rowData.to2}</p>;
  const pTemplate4 = (rowData, { rowIndex }) => <p>{rowData.toType}</p>;
  const pTemplate5 = (rowData, { rowIndex }) => <p>{rowData.toService}</p>;
  const pTemplate6 = (rowData, { rowIndex }) => <p>{rowData.toRefService}</p>;
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
      scrollable
      rowHover
      stripedRows
      paginator
      rows={10}
      rowsPerPageOptions={[10, 50, 250, 500]}
      size={"small"}
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      alwaysShowPaginator={!urlParams.singleUsersId}
    >
      <Column
        field="dynaLoader"
        header="From"
        body={dropdownTemplate0}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="from"
        header="Field"
        body={pTemplate1}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="fromType"
        header="Type"
        body={pTemplate2}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="to2"
        header="To"
        body={pTemplate3}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="toType"
        header="Type"
        body={pTemplate4}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="fromRefService"
        header="Service"
        body={pTemplate5}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="toRefService"
        header="To Ref Service"
        body={pTemplate6}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column header="Delete" body={deleteTemplate} />
    </DataTable>
  );
};

export default DynaFieldsDataTable;
