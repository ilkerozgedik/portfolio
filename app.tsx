import BSOD from "./components/bsod";
import Desktop from "./components/desktop";
import GlobalContextMenu from "./components/global-context-menu";
import Taskbar from "./components/taskbar";
import { BSODProvider, useBSOD } from "./contexts/bsod-context";
import { ContextMenuProvider } from "./contexts/context-menu-context";
import { WindowProvider } from "./hooks/use-window-management";

const BSODWrapper = () => {
  const { isBSODVisible, hideBSOD } = useBSOD();
  return <BSOD isVisible={isBSODVisible} onHide={hideBSOD} />;
};

const App = () => (
  <WindowProvider>
    <ContextMenuProvider>
      <BSODProvider>
        <div className="flex h-screen w-screen flex-col font-sans">
          <Desktop />
          <Taskbar />
          <GlobalContextMenu />
          <BSODWrapper />
        </div>
      </BSODProvider>
    </ContextMenuProvider>
  </WindowProvider>
);

export default App;
