import { ReactNode } from "react";
import style from "./index.module.scss";
import { Button } from "antd-mobile";
import ConnectModal from "./ConnectModal";

export interface SubNavProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export function SubNav({ children, title, className }: SubNavProps) {
  return (
    <div className={`${className} ${style.container}`}>
      <div
        className={style.header}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {title}
        <ConnectModal />
      </div>
      <div className={style.body}>{children}</div>
    </div>
  );
}
