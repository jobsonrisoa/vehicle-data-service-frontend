import { createContext, useContext, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CARS } from "../graphql/queries";

export type Car = {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mobile: string;
  tablet: string;
  desktop: string;
};

type CarsContextValue = {
  cars: Car[];
  loading: boolean;
  error: Error | undefined;
  addLocalCar: (car: Car) => void;
};

const CarsContext = createContext<CarsContextValue | undefined>(undefined);

export function CarsProvider({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useQuery(GET_CARS);
  const [localCars, setLocalCars] = useState<Car[]>([]);

  const cars = useMemo(() => {
    const apiCars: Car[] =
      data?.cars?.map((car: any) => ({
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        color: car.color,
        mobile: car.mobile,
        tablet: car.tablet,
        desktop: car.desktop,
      })) || [];

    return [...apiCars, ...localCars];
  }, [data, localCars]);

  function addLocalCar(car: Car) {
    setLocalCars((current) => [...current, car]);
  }

  const value: CarsContextValue = {
    cars,
    loading,
    error: error as Error | undefined,
    addLocalCar,
  };

  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
}

export function useCars() {
  const context = useContext(CarsContext);

  if (!context) {
    throw new Error("useCars must be used within a CarsProvider");
  }

  return context;
}


