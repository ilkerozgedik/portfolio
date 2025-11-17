import Desktop from "./components/desktop";
import GlobalContextMenu from "./components/global-context-menu";
import Taskbar from "./components/taskbar";
import { ContextMenuProvider } from "./contexts/context-menu-context";
import { WindowProvider } from "./hooks/use-window-management";

const App = () => (
  <WindowProvider>
    <ContextMenuProvider>
      <div className="flex h-screen w-screen flex-col font-sans">
        <Desktop />
        <Taskbar />
        <GlobalContextMenu />
      </div>
    </ContextMenuProvider>
  </WindowProvider>
);

export default App;
