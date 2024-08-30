import React, { useState } from "react";
import axios from "axios";
import { Button, Input } from "antd";
import { useGlobalContext } from "../../../provider/GlobalContext";
import ButtonGroup from "antd/es/button/button-group";

const TokenRequestForm: React.FC = () => {
  const { token, setIsConnected, setToken } = useGlobalContext();

  const [grantType, setGrantType] = useState<string>("password");
  const [keys, setkeys] = useState<number>(0);
  const [username, setUsername] = useState<string>("hereis.topdev@gmail.com");
  const [password, setPassword] = useState<string>("Dr@gon0314");
  const [clientId, setClientId] = useState<string>("wtp8pzhmf63n6av27448wxn7");
  const [clientSecret, setClientSecret] = useState<string>(
    "bZPSVrN3euj4ygQzhZ7k35yEsxG9JmbbAVk5cNhqNjmsDuVnud"
  );

  const handleSubmit = async () => {
    try {
      const data = {
        grant_type: grantType,
        username: username,
        password: password,
        client_id: clientId,
        client_secret: clientSecret,
      };
      const response = await axios.post(
        "http://localhost:8001/api/token",
        data
      );
      const accessToken = response.data.access_token;
      console.log("Access Token:", accessToken);
      if (setToken) {
        setToken(accessToken); // Pass the token string directly
        localStorage.setItem("access_token", accessToken);

        setIsConnected(true);
      } else {
        console.error("setToken is undefined.");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Response Error:", error.response.data);
      } else if (error.request) {
        console.error("Request Error:", error.request);
      } else {
        console.error("Error", error.message);
      }
      console.error("Error Details:", error.config);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <form>
        <div style={{ margin: "10px" }}>
          <div style={{ margin: "5px" }}>Grant Type</div>
          <Input
            type="text"
            value={grantType}
            onChange={(e) => setGrantType(e.target.value)}
            disabled
          />
        </div>
        <div style={{ margin: "10px" }}>
          <div style={{ margin: "5px" }}>Username</div>
          <Input.Password
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ margin: "10px" }}>
          <div style={{ margin: "5px" }}>Password</div>
          <Input.Password
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div style={{ margin: "10px" }}>
          <div style={{ margin: "5px" }}>Client ID</div>
          <Input.Password
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          />
        </div>
        <div style={{ margin: "10px" }}>
          <div style={{ margin: "5px" }}>Client Secret</div>
          <Input.Password
            type="text"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            required
          />
        </div>
        <ButtonGroup>
          <Button
            onClick={() => {
              setkeys(0);
              setClientId("wtp8pzhmf63n6av27448wxn7");
              setClientSecret(
                "bZPSVrN3euj4ygQzhZ7k35yEsxG9JmbbAVk5cNhqNjmsDuVnud"
              );
            }}
            type={keys == 0 ? "primary" : "default"}
          >
            key 1
          </Button>
          <Button
            onClick={() => {
              setkeys(1);
              setClientId("p9tpj7gvdzu6ea9szw4k3kvh");
              setClientSecret(
                "Eu28w2gyBtnBajtSmbt9QAbxBzmppbgyNhN9n8eyNxFMAuy2zx"
              );
            }}
            type={keys == 1 ? "primary" : "default"}
          >
            key 2
          </Button>
          {/* <Button
            onClick={() => {
              setkeys(2);
              setClientId("g8nq4wjnq3j866w5bmb2q684");
              setClientSecret(
                "NV5StXQ3594FsFAjbSnkGnrmDtTccFY3qd2c3tww8dc6S24C"
              );
            }}
            type={keys == 2 ? "primary" : "default"}
          >
            key 3
          </Button>
          <Button
            onClick={() => {
              setkeys(3);
              setClientId("y99zyh56ga8r5j224a6edkg5");
              setClientSecret(
                "xcBrgJguauav8kmWgxd2xDB4vVyV6mPnHmsuQjhck8Ne9BAQ"
              );
            }}
            type={keys == 3 ? "primary" : "default"}
          >
            key 4
          </Button> */}
        </ButtonGroup>
        <br />
        <br />
        <Button onClick={handleSubmit}>Connect Egnyte</Button>
      </form>
      <div style={{ padding: "20px" }}>
        {token ? <p>Conected</p> : <p>Disconnected</p>}
      </div>
    </div>
  );
};

export default TokenRequestForm;
