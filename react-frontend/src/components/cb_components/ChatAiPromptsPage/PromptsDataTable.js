import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useRef } from "react";
import _ from "lodash";
import { Badge } from "primereact/badge";

const PromptsDataTable = ({ items, onRowClick }) => {
  const dt = useRef(null);
  const pTemplate3 = (rowData, { rowIndex }) => <p>{rowData.prompt}</p>;
  const badgeTemplate12 = (rowData, { rowIndex }) => (
    <Badge value={rowData.inputTokens}></Badge>
  );
  const badgeTemplate13 = (rowData, { rowIndex }) => (
    <Badge value={rowData.outputTokens}></Badge>
  );
  const pTemplate14 = (rowData, { rowIndex }) => (
    <p className=" flex justify-content-end mr-5">
      RM{isNaN(rowData?.cost) ? "0.00" : rowData?.cost?.toFixed(2)}
    </p>
  );
  const tickTemplate15 = (rowData, { rowIndex }) => (
    <i
      className={`flex justify-content-center pi ${rowData.status ? "pi-check" : "pi-times"}`}
    ></i>
  );
  const pTemplate16 = (rowData, { rowIndex }) => (
    <p>{rowData.error ? rowData.error : "none"}</p>
  );

  return (
    <DataTable
      ref={dt}
      value={items}
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
    >
      <Column
        field="prompt"
        header="Engineered Prompts"
        body={pTemplate3}
        style={{ minWidth: "8rem" }}
      />

      <Column
        field="inputTokens"
        header="inputTokens"
        body={badgeTemplate12}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="outputTokens"
        header="outputTokens"
        body={badgeTemplate13}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="cost"
        header="cost"
        body={pTemplate14}
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="status"
        header="status"
        body={tickTemplate15}
        sortable
        style={{ minWidth: "8rem" }}
      />
      <Column
        field="error"
        header="error"
        body={pTemplate16}
        style={{ minWidth: "8rem" }}
      />
    </DataTable>
  );
};

export default PromptsDataTable;
