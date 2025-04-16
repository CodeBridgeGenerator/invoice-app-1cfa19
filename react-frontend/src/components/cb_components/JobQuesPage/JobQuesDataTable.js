import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import _ from "lodash";
import moment from "moment";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const JobQuesDataTable = ({ items }) => {
  const dt = useRef(null);
  const urlParams = useParams();

  const pTemplate0 = (rowData, { rowIndex }) => <p>{rowData.name}</p>;
  const pTemplate1 = (rowData, { rowIndex }) => <p>{rowData.type}</p>;
  const pTemplate2 = (rowData, { rowIndex }) => <p>{rowData.data}</p>;
  const pTemplate3 = (rowData, { rowIndex }) => <p>{rowData.service}</p>;
  const calendar_timeonlyTemplate4 = (rowData, { rowIndex }) => (
    <p>{new Date(rowData.start).toLocaleDateString()}</p>
  );
  const calendar_timeonlyTemplate5 = (rowData, { rowIndex }) => (
    <p>{new Date(rowData.end).toLocaleDateString()}</p>
  );

  const pCreatedAt = (rowData, { rowIndex }) => (
    <p>{moment(rowData.createdAt).fromNow()}</p>
  );

  return (
    <>
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
        rowClassName="cursor-pointer"
        alwaysShowPaginator={!urlParams.singleUsersId}
      >
        <Column
          field="name"
          header="Name"
          body={pTemplate0}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="type"
          header="Type"
          body={pTemplate1}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="data"
          header="Data"
          body={pTemplate2}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="service"
          header="Service"
          body={pTemplate3}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="start"
          header="Start"
          body={calendar_timeonlyTemplate4}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="end"
          header="End"
          body={calendar_timeonlyTemplate5}
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
    </>
  );
};

export default JobQuesDataTable;
