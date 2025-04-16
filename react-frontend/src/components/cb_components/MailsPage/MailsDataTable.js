import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useRef } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";

const MailsDataTable = ({ items, onRowClick, loading }) => {
  const dt = useRef(null);
  const urlParams = useParams();

  const p_dateTemplate0 = (rowData, { rowIndex }) => (
    <p>{new Date(rowData.sentDateTime).toLocaleDateString()}</p>
  );
  const p_booleanTemplate1 = (rowData, { rowIndex }) => (
    <p>{String(rowData.sentStatus)}</p>
  );
  const pTemplate2 = (rowData, { rowIndex }) => <p>{rowData.mailType}</p>;
  const pTemplate3 = (rowData, { rowIndex }) => <p>{rowData.toHistory}</p>;

  const pCreatedBy = (rowData, { rowIndex }) => (
    <p>{rowData.createdBy?.name}</p>
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
        field="sentDateTime"
        header="Sent Date Time"
        body={p_dateTemplate0}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="sentStatus"
        header="Sent Status"
        body={p_booleanTemplate1}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="mailType"
        header="Mail Type"
        body={pTemplate2}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="toHistory"
        header="To History"
        body={pTemplate3}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="createdBy"
        header="createdBy"
        body={pCreatedBy}
        sortable
        style={{ minWidth: "8rem" }}
      />
    </DataTable>
  );
};

export default MailsDataTable;
