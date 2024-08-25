import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./infrastructure/state/app/store";
import App from "./presentation/App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "./presentation/index.scss";
import { PersistSelectedStates } from "./presentation/supports/Persistence";
import { ConfigProvider, theme } from "antd";
import { GlobalProvider } from "./provider/GlobalContext";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalProvider>
        <BrowserRouter>
          <PersistSelectedStates>
            <ConfigProvider
              theme={{
                algorithm: theme.compactAlgorithm,
              }}
            >
              <App />
            </ConfigProvider>
          </PersistSelectedStates>
        </BrowserRouter>
      </GlobalProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
