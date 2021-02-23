import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMovies as getMoviesFromApis } from '../apis/movie';

const name = 'movie';

export const fetchMovies = createAsyncThunk(`${name}/fetchMovies`, async () => {
	return await getMoviesFromApis();
});

export const movieSlice = createSlice({
	name: name,
	initialState: {
		data: [],
		status: 'idle',
	},
	reducers: {
		reset: (state) => {
			state.data = [];
			state.status = 'idle';
		},
	},
	extraReducers: {
		[fetchMovies.pending]: (state, action) => {
			state.status = 'pending';
		},
		[fetchMovies.fulfilled]: (state, action) => {
			state.data = [...action.payload];
			state.status = Array.isArray(action.payload) && action.payload.length > 0 ? 'success' : 'failed';
		},
	},
});

export default movieSlice.reducer;
