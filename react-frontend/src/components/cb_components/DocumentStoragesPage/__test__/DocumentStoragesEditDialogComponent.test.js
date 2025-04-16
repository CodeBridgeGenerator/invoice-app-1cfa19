import React from "react";
import { render, screen } from "@testing-library/react";

import DocumentStoragesEditDialogComponent from "../DocumentStoragesEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders documentStorages edit dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DocumentStoragesEditDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("documentStorages-edit-dialog-component"),
  ).toBeInTheDocument();
});
