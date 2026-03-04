import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  loading: false,
  error: null,
  selectedJob: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    jobsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    jobsSuccess: (state, action) => {
      state.loading = false;
      state.jobs = action.payload;
    },
    jobsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
  },
});

export const { jobsStart, jobsSuccess, jobsFail, setSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;