import React from "react";
import { render, screen } from "@testing-library/react";

import DocumentStoragesCreateDialogComponent from "../DocumentStoragesCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders documentStorages create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DocumentStoragesCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("documentStorages-create-dialog-component"),
  ).toBeInTheDocument();
});
