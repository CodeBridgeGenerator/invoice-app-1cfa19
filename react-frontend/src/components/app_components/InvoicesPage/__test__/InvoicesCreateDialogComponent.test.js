import React from "react";
import { render, screen } from "@testing-library/react";

import InvoicesCreateDialogComponent from "../InvoicesCreateDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders invoices create dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <InvoicesCreateDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("invoices-create-dialog-component"),
  ).toBeInTheDocument();
});
