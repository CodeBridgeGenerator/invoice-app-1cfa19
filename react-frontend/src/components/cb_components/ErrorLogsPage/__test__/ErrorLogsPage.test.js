import React from "react";
import { render, screen } from "@testing-library/react";

import ErrorLogsPage from "../ErrorLogsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders errorLogs page", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ErrorLogsPage />
      </MemoryRouter>
    </Provider>,
  );
  expect(screen.getByRole("errorLogs-datatable")).toBeInTheDocument();
  expect(screen.getByRole("errorLogs-add-button")).toBeInTheDocument();
});
