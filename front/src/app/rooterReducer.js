import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  tronObj: {},
  currentAccount: '',
  questionCount: 0,
  firstQuestionId: 0,
  lastQuestionId: 0
}

export const rooterSlice = createSlice({
  name: "rooter",
  initialState,
  reducers: {
    setTronObj: (state, action) => {
      state.tronObj = action.payload;
    },
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
    setQuestionCount: (state, action) => {
      state.questionCount = action.payload;
    },
    setFirstQuestionId: (state, action) => {
      state.firstQuestionId = action.payload;
    },
    setLastQuestionId: (state, action) => {
      state.lastQuestionId = action.payload;
    }
  }
});

export const {
  setTronObj,
  setCurrentAccount,
  setQuestionCount,
  setFirstQuestionId,
  setLastQuestionId
} = rooterSlice.actions;


export default rooterSlice.reducer;