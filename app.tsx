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
        <div
          className="relative flex min-h-dvh w-full flex-col bg-background font-sans text-foreground"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingRight: "env(safe-area-inset-right)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
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
