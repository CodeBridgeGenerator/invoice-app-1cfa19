import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useRef } from "react";
import _ from "lodash";
import { useParams } from "react-router-dom";
import moment from "moment";
import { Chip } from "primereact/chip";

const MailQuesDataTable = ({ items, onRowClick, loading }) => {
  const dt = useRef(null);
  const urlParams = useParams();

  const pTemplate0 = (rowData, { rowIndex }) => <p>{rowData.name}</p>;
  const pTemplate1 = (rowData, { rowIndex }) => <p>{rowData.from}</p>;
  const chipTemplate2 = (rowData, { rowIndex }) => (
    <Chip label={rowData.recipients} />
  );
  const tickTemplate3 = (rowData, { rowIndex }) => (
    <i className={`pi ${rowData.status ? "pi-check" : "pi-times"}`}></i>
  );
  const pTemplate4 = (rowData, { rowIndex }) => (
    <p>{rowData.templateId?.name}</p>
  );
  const inputTextareaTemplate5 = (rowData, { rowIndex }) => (
    <p>{rowData.subject}</p>
  );

  const p_numberTemplate7 = (rowData, { rowIndex }) => <p>{rowData.jobId}</p>;
  const inputTextareaTemplate8 = (rowData, { rowIndex }) => (
    <p>{rowData.errors}</p>
  );
  const p_calendarTemplate9 = (rowData, { rowIndex }) => <p>{rowData.end}</p>;

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
        field="name"
        header="Name"
        body={pTemplate0}
        sortable
        frozen
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="from"
        header="From"
        body={pTemplate1}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="recipients"
        header="Recipients"
        body={chipTemplate2}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="status"
        header="Status"
        body={tickTemplate3}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="templateId"
        header="Template"
        body={pTemplate4}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="subject"
        header="Subject"
        body={inputTextareaTemplate5}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="jobId"
        header="Job Id"
        body={p_numberTemplate7}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="errors"
        header="Errors"
        body={inputTextareaTemplate8}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="end"
        header="End"
        body={p_calendarTemplate9}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="createdAt"
        header="created"
        body={pCreatedAt}
        sortable
        style={{ minWidth: "8rem" }}
      />
    </DataTable>
  );
};

export default MailQuesDataTable;
