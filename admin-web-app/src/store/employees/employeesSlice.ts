import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Employee, EmployeesState } from "../../types/employeeTypes";
import * as employeeAPI from "../../services/employeeAPI";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async () => {
    return await employeeAPI.fetchEmployees();
  }
);

const initialState: EmployeesState = {
  employees: [],
  loading: false,
  error: null,
};

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.employees = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch employees";
        state.loading = false;
      });
  },
});

export default employeesSlice.reducer;
