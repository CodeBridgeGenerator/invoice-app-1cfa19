import React from "react";
import { render, screen } from "@testing-library/react";

import DocumentStoragesPage from "../DocumentStoragesPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders documentStorages page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <DocumentStoragesPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("documentStorages-datatable")).toBeInTheDocument();
  expect(screen.getByRole("documentStorages-add-button")).toBeInTheDocument();
});
