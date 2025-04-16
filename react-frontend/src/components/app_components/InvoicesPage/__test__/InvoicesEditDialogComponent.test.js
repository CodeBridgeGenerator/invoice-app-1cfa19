import React from "react";
import { render, screen } from "@testing-library/react";

import InvoicesEditDialogComponent from "../InvoicesEditDialogComponent";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders invoices edit dialog", async () => {
  const store = init({ models });
  render(
    <Provider store={store}>
      <MemoryRouter>
        <InvoicesEditDialogComponent show={true} />
      </MemoryRouter>
    </Provider>,
  );
  expect(
    screen.getByRole("invoices-edit-dialog-component"),
  ).toBeInTheDocument();
});
