import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Grievance,
  GrievanceStatus,
  SubmitGrievancePayload,
} from "../../types/grievance";
import { grievanceService } from "../../services/grievanceService";

interface GrievanceState {
  grievances: Grievance[];
  total: number;
  currentGrievance: Grievance | null;
  mobileGrievances: Grievance[];
  loading: boolean;
  error: string | null;
  lastSubmitted: Grievance | null;
  stats: any | null;
}

const initialState: GrievanceState = {
  grievances: [],
  total: 0,
  currentGrievance: null,
  mobileGrievances: [],
  loading: false,
  error: null,
  lastSubmitted: null,
  stats: null,
};

const extractError = (err: any): string => {
  if (err?.response?.data?.detail) {
    const d = err.response.data.detail;
    if (Array.isArray(d)) return d.map((e: any) => e.msg).join(", ");
    return String(d);
  }
  return err?.message || "An error occurred. Please try again.";
};

export const submitGrievance = createAsyncThunk(
  "grievance/submit",
  async (payload: SubmitGrievancePayload, { rejectWithValue }) => {
    try {
      return await grievanceService.submitGrievance(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchGrievanceByToken = createAsyncThunk(
  "grievance/fetchByToken",
  async (token: string, { rejectWithValue }) => {
    try {
      const result = await grievanceService.getGrievanceByToken(token);
      if (!result)
        return rejectWithValue("No grievance found with this token.");
      return result;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchGrievancesByMobile = createAsyncThunk(
  "grievance/fetchByMobile",
  async (mobile: string, { rejectWithValue }) => {
    try {
      const result = await grievanceService.getGrievancesByMobile(mobile);
      if (!result.length)
        return rejectWithValue("No grievances found for this mobile number.");
      return result;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchAllGrievances = createAsyncThunk(
  "grievance/fetchAll",
  async (
    params:
      | {
          skip?: number;
          limit?: number;
          status?: string;
          department?: string;
          search?: string;
        }
      | undefined,
    { rejectWithValue },
  ) => {
    try {
      return await grievanceService.getAllGrievances(params);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateStatus = createAsyncThunk(
  "grievance/updateStatus",
  async (
    {
      token,
      status,
      assignedTo,
      remarks,
    }: {
      token: string;
      status: GrievanceStatus;
      assignedTo?: string;
      remarks?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      return await grievanceService.updateGrievanceStatus(
        token,
        status,
        assignedTo,
        remarks,
      );
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchStats = createAsyncThunk(
  "grievance/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await grievanceService.getStats();
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

/* ---------------- QUERY THUNKS ---------------- */

export const fetchQueries = createAsyncThunk(
  "grievance/fetchQueries",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await grievanceService.getQueries(token);

      return res.map((q: any) => ({
        id: String(q.id), // normalize to string
        message: q.message,
        sender: q.sender,
        createdAt: q.created_at,
      }));
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const sendQuery = createAsyncThunk(
  "grievance/sendQuery",
  async (
    {
      token,
      message,
      sender,
    }: { token: string; message: string; sender: "user" | "admin" },
    { rejectWithValue },
  ) => {
    try {
      const res = await grievanceService.createQuery(token, message, sender);

      return {
        token,
        query: {
          id: String(res.id), // normalize to string
          message: res.message,
          sender: res.sender,
          createdAt: res.created_at,
        },
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

const grievanceSlice = createSlice({
  name: "grievance",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentGrievance(state) {
      state.currentGrievance = null;
    },
    clearLastSubmitted(state) {
      state.lastSubmitted = null;
    },
    clearMobileGrievances(state) {
      state.mobileGrievances = [];
    },

    addGrievance(state, action: PayloadAction<Grievance>) {
      state.grievances.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    const pending = (state: GrievanceState) => {
      state.loading = true;
      state.error = null;
    };

    const rejected = (state: GrievanceState, action: any) => {
      state.loading = false;
      state.error = action.payload as string;
    };

    builder
      .addCase(submitGrievance.pending, pending)
      .addCase(submitGrievance.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSubmitted = action.payload;
        state.grievances.unshift(action.payload);
      })
      .addCase(submitGrievance.rejected, rejected);

    builder
      .addCase(fetchGrievanceByToken.pending, (state) => {
        pending(state);
        state.currentGrievance = null;
      })
      .addCase(fetchGrievanceByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGrievance = action.payload;
      })
      .addCase(fetchGrievanceByToken.rejected, rejected);

    builder
      .addCase(fetchGrievancesByMobile.pending, (state) => {
        pending(state);
        state.mobileGrievances = [];
      })
      .addCase(fetchGrievancesByMobile.fulfilled, (state, action) => {
        state.loading = false;
        state.mobileGrievances = action.payload;
      })
      .addCase(fetchGrievancesByMobile.rejected, rejected);

    builder
      .addCase(fetchAllGrievances.pending, pending)
      .addCase(fetchAllGrievances.fulfilled, (state, action) => {
        state.loading = false;
        state.grievances = action.payload.grievances;
        state.total = action.payload.total;
      })
      .addCase(fetchAllGrievances.rejected, rejected);

    builder
      .addCase(updateStatus.pending, pending)
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;

        const idx = state.grievances.findIndex(
          (g) => g.token === action.payload.token,
        );
        if (idx !== -1) state.grievances[idx] = action.payload;

        if (state.currentGrievance?.token === action.payload.token) {
          state.currentGrievance = action.payload;
        }
      })
      .addCase(updateStatus.rejected, rejected);

    builder
      .addCase(fetchStats.pending, pending)
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, rejected);

    /* -------- LOAD QUERIES -------- */

    builder.addCase(fetchQueries.fulfilled, (state, action) => {
      if (state.currentGrievance) {
        state.currentGrievance.queries = action.payload;
      }
    });

    /* -------- SEND QUERY -------- */

    builder.addCase(sendQuery.fulfilled, (state, action) => {
      const grievance = state.grievances.find(
        (g) => g.token === action.payload.token,
      );

      if (grievance) {
        if (!grievance.queries) grievance.queries = [];
        grievance.queries.push(action.payload.query);
      }

      if (state.currentGrievance?.token === action.payload.token) {
        if (!state.currentGrievance.queries)
          state.currentGrievance.queries = [];
        state.currentGrievance.queries.push(action.payload.query);
      }
    });
  },
});

export const {
  clearError,
  clearCurrentGrievance,
  clearLastSubmitted,
  clearMobileGrievances,
  addGrievance,
} = grievanceSlice.actions;

export default grievanceSlice.reducer;