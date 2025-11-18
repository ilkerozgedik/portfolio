import Desktop from "./components/desktop";
import GlobalContextMenu from "./components/global-context-menu";
import Taskbar from "./components/taskbar";
import { ContextMenuProvider } from "./contexts/context-menu-context";
import { WindowProvider } from "./hooks/use-window-management";

const App = () => (
  <WindowProvider>
    <ContextMenuProvider>
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
      </div>
    </ContextMenuProvider>
  </WindowProvider>
);

export default App;
