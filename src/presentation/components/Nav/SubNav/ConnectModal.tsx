import React, { useState } from "react";
import { Button, Modal } from "antd";
import TokenRequestForm from "../../CustomComponents/TokenRequestForm";
import { useGlobalContext } from "../../../../provider/GlobalContext";

const ConnectModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token, setIsConnected, setToken } = useGlobalContext();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* {token ? (
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: "green",
            borderRadius: "10px",
          }}
        ></div>
      ) : (
        <div
          style={{
            width: "10px",
            height: "10px",
            backgroundColor: "grey",
            borderRadius: "10px",
          }}
        ></div>
      )} */}
      <Button
        type="primary"
        onClick={showModal}
        // style={token ? { display: "none" } : { display: "block" }}
      >
        {token ? "Connected" : "Connect"}
      </Button>
      <Modal
        title="Connect to Egnyte"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TokenRequestForm />
      </Modal>
    </>
  );
};

export default ConnectModal;
