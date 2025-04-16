import React from "react";
import { render, screen } from "@testing-library/react";

import ItemsPage from "../ItemsPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders items page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <ItemsPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("items-datatable")).toBeInTheDocument();
    expect(screen.getByRole("items-add-button")).toBeInTheDocument();
});
