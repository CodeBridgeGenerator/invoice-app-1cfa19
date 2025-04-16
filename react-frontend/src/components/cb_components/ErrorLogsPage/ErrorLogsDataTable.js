import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useRef } from "react";
import _ from "lodash";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";
import moment from "moment";

const ErrorLogsDataTable = ({ items, onRowClick, loading }) => {
  const dt = useRef(null);
  const urlParams = useParams();

  const pTemplate0 = (rowData, { rowIndex }) => <p>{rowData.serviceName}</p>;
  const pTemplate1 = (rowData, { rowIndex }) => <p>{rowData.errorMessage}</p>;
  const pTemplate2 = (rowData, { rowIndex }) => <p>{rowData.message}</p>;
  const pTemplate3 = (rowData, { rowIndex }) => <p>{rowData.stack}</p>;
  const pTemplate4 = (rowData, { rowIndex }) => <p>{rowData.details}</p>;
  const pCreatedAt = (rowData, { rowIndex }) => (
    <p>{moment(rowData.createdAt).fromNow()}</p>
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
      loading={loading}
    >
      <Column
        field="serviceName"
        header="Service Name"
        body={pTemplate0}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="errorMessage"
        header="Error Message"
        body={pTemplate1}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="message"
        header="Message"
        body={pTemplate2}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="stack"
        header="Stack"
        body={pTemplate3}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="details"
        header="Details"
        body={pTemplate4}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="createdAt"
        header="Created"
        body={pCreatedAt}
        sortable
        style={{ minWidth: "8rem" }}
      />
    </DataTable>
  );
};

export default ErrorLogsDataTable;
