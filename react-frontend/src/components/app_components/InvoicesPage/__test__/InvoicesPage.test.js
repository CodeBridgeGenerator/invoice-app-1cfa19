import React from "react";
import { render, screen } from "@testing-library/react";

import InvoicesPage from "../InvoicesPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders invoices page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <InvoicesPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("invoices-datatable")).toBeInTheDocument();
    expect(screen.getByRole("invoices-add-button")).toBeInTheDocument();
});
