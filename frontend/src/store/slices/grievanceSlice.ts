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

// ─────────────────────────────────────────────
//  SUBMIT
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
//  FETCH BY TOKEN / MOBILE
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
//  FETCH ALL (minister / admin)
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
//  UPDATE STATUS
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
//  DELETE (admin only)
// ─────────────────────────────────────────────

export const deleteGrievance = createAsyncThunk(
  "grievance/delete",
  async (token: string, { rejectWithValue }) => {
    try {
      await grievanceService.deleteGrievance(token);
      return token; // return token so the reducer can remove it from state
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ─────────────────────────────────────────────
//  STATS — authenticated (minister / admin dashboard)
// ─────────────────────────────────────────────

export const fetchStats = createAsyncThunk(
  "grievance/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await grievanceService.getStats(); // hits /stats/summary with auth
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ─────────────────────────────────────────────
//  STATS — public (home page, no auth needed)
// ─────────────────────────────────────────────

export const fetchPublicStats = createAsyncThunk(
  "grievance/fetchPublicStats",
  async (_, { rejectWithValue }) => {
    try {
      return await grievanceService.getPublicStats(); // hits /stats/public
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ─────────────────────────────────────────────
//  QUERY THUNKS
// ─────────────────────────────────────────────

export const fetchQueries = createAsyncThunk(
  "grievance/fetchQueries",
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await grievanceService.getQueries(token);
      return res.map((q: any) => ({
        id: String(q.id),
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
          id: String(res.id),
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

// ─────────────────────────────────────────────
//  SLICE
// ─────────────────────────────────────────────

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

    // Submit
    builder
      .addCase(submitGrievance.pending, pending)
      .addCase(submitGrievance.fulfilled, (state, action) => {
        state.loading = false;
        state.lastSubmitted = action.payload;
        state.grievances.unshift(action.payload);
      })
      .addCase(submitGrievance.rejected, rejected);

    // Fetch by token
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

    // Fetch by mobile
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

    // Fetch all
    builder
      .addCase(fetchAllGrievances.pending, pending)
      .addCase(fetchAllGrievances.fulfilled, (state, action) => {
        state.loading = false;
        state.grievances = action.payload.grievances;
        state.total = action.payload.total;
      })
      .addCase(fetchAllGrievances.rejected, rejected);

    // Update status
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

    // Delete
    builder
      .addCase(deleteGrievance.pending, pending)
      .addCase(deleteGrievance.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted grievance from both lists
        state.grievances = state.grievances.filter(
          (g) => g.token !== action.payload,
        );
        state.total = Math.max(0, state.total - 1);
        if (state.currentGrievance?.token === action.payload) {
          state.currentGrievance = null;
        }
        // Also decrement stats.total if loaded
        if (state.stats?.total != null) {
          state.stats.total = Math.max(0, state.stats.total - 1);
        }
      })
      .addCase(deleteGrievance.rejected, rejected);

    // Stats — authenticated (dashboard)
    builder
      .addCase(fetchStats.pending, pending)
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        // Don't overwrite existing stats on auth failure
        state.loading = false;
        state.error = action.payload as string;
      });

    // Stats — public (home page); never sets loading so page stays snappy
    builder
      .addCase(fetchPublicStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchPublicStats.rejected, (_state) => {
        // Silently ignore — home page will show 0s via fmt fallback
      });

    // Load queries
    builder.addCase(fetchQueries.fulfilled, (state, action) => {
      if (state.currentGrievance) {
        state.currentGrievance.queries = action.payload;
      }
    });

    // Send query
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