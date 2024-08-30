import { useEffect } from "react";
import { SideNav, BottomNav } from "./components/Nav";
import style from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
// import { NavigatePersist } from './supports/Persistence'
import { EditorPage } from "./pages/editor";
import { ExplorerPage } from "./pages/explorer";
import "antd/dist/reset.css";
import { useWindowSize } from "react-use";
import axios from "axios";
import qs from "qs";

// import {
//   AppOutline,
//   MessageOutline,
//   UnorderedListOutline,
//   UserOutline,
// } from 'antd-mobile-icons'

function App() {
  const { width } = useWindowSize();
  const isWideScreen = width > 600;
  useEffect(() => {
    getAccessToken();
  }, []);

  const getAccessToken = async () => {
    const token = localStorage.getItem("access_token");
    if (!token || token.length == 0) {
      try {
        const response = await axios.post("http://localhost:8001/api/token", {
          grant_type: "password",
          username: "hereis.topdev@gmail.com",
          password: "Dr@gon0314",
          client_id: "wtp8pzhmf63n6av27448wxn7", //'p9tpj7gvdzu6ea9szw4k3kvh',
          client_secret: "bZPSVrN3euj4ygQzhZ7k35yEsxG9JmbbAVk5cNhqNjmsDuVnud", //'Eu28w2gyBtnBajtSmbt9QAbxBzmppbgyNhN9n8eyNxFMAuy2zx'
        });
        const accessToken = response.data.access_token;
        console.log("Access Token:", accessToken);

        // Store the token in localStorage
        localStorage.setItem("access_token", accessToken);
      } catch (error: any) {
        if (error.response) {
          // Server responded with a status code outside the range of 2xx
          console.error("Response Error:", error.response.data);
        } else if (error.request) {
          // Request was made but no response received
          console.error("Request Error:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Error", error.message);
        }
        console.error("Error Details:", error.config);
      }
    }
  };
  return (
    <div className={style.container}>
      {/* {isWideScreen && <SideNav className={style.sideNav} />} */}
      <main className={style.main}>
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/:folderId" element={<EditorPage />} />
        </Routes>
      </main>
      {!isWideScreen && <BottomNav className={style.bottomNav} />}
    </div>
  );
}

export default App;
