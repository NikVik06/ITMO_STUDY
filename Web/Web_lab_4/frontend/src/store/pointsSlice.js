import { createSlice } from '@reduxjs/toolkit';

const pointsSlice = createSlice({
  name: 'points',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addPoint: (state, action) => {
      state.items.unshift(action.payload);
    },
    setPoints: (state, action) => {
      state.items = action.payload;
    },
    clearPoints: (state) => {
      state.items = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addPoint, setPoints, clearPoints, setLoading, setError } = pointsSlice.actions;
export default pointsSlice.reducer;