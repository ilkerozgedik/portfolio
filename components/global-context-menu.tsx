import type { FC } from "react";
import { useContextMenu } from "../contexts/context-menu-context";
import ContextMenu from "./context-menu";

const GlobalContextMenu: FC = () => {
  const { contextMenu } = useContextMenu();

  return <ContextMenu contextMenu={contextMenu} />;
};

export default GlobalContextMenu;
