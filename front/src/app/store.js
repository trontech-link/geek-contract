import { configureStore } from "@reduxjs/toolkit";
import rooterReducer from "./rooterReducer";

export const store = configureStore({
  reducer: {
    rooter: rooterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["setTronObj"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["payload.tronWeb"],
        // Ignore these paths in the state
        ignoredPaths: ["rooter.tronObj.tronWeb"],
      },
    }),
});
