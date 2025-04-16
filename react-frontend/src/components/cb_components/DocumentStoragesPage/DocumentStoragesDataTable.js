import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useRef } from "react";
import _ from "lodash";
import { Button } from "primereact/button";
import { useParams } from "react-router-dom";

const DocumentStoragesDataTable = ({
  items,
  onRowDelete,
  onRowClick,
  loading,
}) => {
  const dt = useRef(null);
  const urlParams = useParams();

  const pTemplate0 = (rowData, { rowIndex }) => <p>{rowData.name}</p>;
  const p_numberTemplate1 = (rowData, { rowIndex }) => <p>{rowData.size}</p>;
  const pTemplate2 = (rowData, { rowIndex }) => <p>{rowData.path}</p>;
  const p_dateTemplate3 = (rowData, { rowIndex }) => (
    <p>{new Date(rowData.lastModifiedDate).toLocaleDateString()}</p>
  );
  const p_numberTemplate4 = (rowData, { rowIndex }) => (
    <p>{rowData.lastModified}</p>
  );
  const pTemplate5 = (rowData, { rowIndex }) => <p>{rowData.eTag}</p>;
  const pTemplate6 = (rowData, { rowIndex }) => <p>{rowData.versionId}</p>;
  const pTemplate7 = (rowData, { rowIndex }) => <p>{rowData.url}</p>;

  const deleteTemplate = (rowData, { rowIndex }) => (
    <Button
      onClick={() => onRowDelete(rowData._id)}
      icon="pi pi-times"
      className="p-button-rounded p-button-danger p-button-text"
    />
  );

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
        loading={loading}
      >
        <Column
          field="name"
          header="Document Name"
          body={pTemplate0}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="size"
          header="Size"
          body={p_numberTemplate1}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="path"
          header="Path"
          body={pTemplate2}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="lastModifiedDate"
          header="Last Modified Date"
          body={p_dateTemplate3}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="lastModified"
          header="Last Modified"
          body={p_numberTemplate4}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="eTag"
          header="AWS ETag"
          body={pTemplate5}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="versionId"
          header="AWS Version Id"
          body={pTemplate6}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column
          field="url"
          header="Url"
          body={pTemplate7}
          sortable
          style={{ minWidth: "8rem" }}
        />
        <Column header="Delete" body={deleteTemplate} />
      </DataTable>
    </>
  );
};

export default DocumentStoragesDataTable;
