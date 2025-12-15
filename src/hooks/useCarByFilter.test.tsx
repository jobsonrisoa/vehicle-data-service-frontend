import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { renderHook, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { ReactNode } from "react";
import { handlers } from "../mocks/handlers";
import { useCarByFilter } from "./useCarByFilter";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function wrapper({ children }: { children: ReactNode }) {
  const client = new ApolloClient({
    uri: "/graphql",
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

describe("useCarByFilter", () => {
  it("returns a car matching the provided filters", async () => {
    const { result } = renderHook(
      () =>
        useCarByFilter({
          make: "Audi",
          model: "Q5",
          year: 2023,
        }),
      { wrapper }
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeUndefined();
    expect(result.current.car).not.toBeNull();
    expect(result.current.car?.model).toBe("Q5");
  });

  it("returns null when no car matches the filters", async () => {
    const { result } = renderHook(
      () =>
        useCarByFilter({
          make: "Unknown",
        }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.car).toBeNull();
  });
});

