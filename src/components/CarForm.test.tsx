import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { handlers } from "../mocks/handlers";
import { CarForm } from "./CarForm";
import { CarList } from "./CarList";
import { CarsProvider } from "../hooks/useCars";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithApollo(children: ReactNode) {
  const client = new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
  });

  return render(
    <ApolloProvider client={client}>
      <CarsProvider>{children}</CarsProvider>
    </ApolloProvider>
  );
}

describe("CarForm", () => {
  it("adds a new car to the list when submitted with valid data", async () => {
    renderWithApollo(
      <>
        <CarForm />
        <CarList />
      </>
    );

    await waitFor(() => {
      expect(screen.getByText(/Audi Q5/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/make/i), "Test");
    const modelInputs = screen.getAllByLabelText(/model/i);
    await userEvent.type(modelInputs[0], "Car");
    const yearInputs = screen.getAllByLabelText(/year/i);
    await userEvent.type(yearInputs[0], "2025");
    await userEvent.type(screen.getByLabelText(/color/i), "Black");

    await userEvent.click(screen.getByRole("button", { name: /add car/i }));

    expect(screen.getByText(/Test Car/i)).toBeInTheDocument();
  });
});

