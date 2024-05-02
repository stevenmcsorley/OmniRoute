import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Resource, ResourcesState } from "../../types/resourceTypes";
import { fetchResources as fetchResourcesAPI } from "../../services/resourceAPI";

export const initialState: ResourcesState = {
  resources: [],
  loading: false,
  error: null,
};

export const fetchResources = createAsyncThunk(
  "resources/fetchResources",
  async () => {
    return await fetchResourcesAPI();
  }
);

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchResources.fulfilled,
        (state, action: PayloadAction<Resource[]>) => {
          state.resources = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch resources";
      });
  },
});

export default resourcesSlice.reducer;
