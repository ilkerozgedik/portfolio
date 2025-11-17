import { useEffect } from "react";

type BSODProps = {
  isVisible: boolean;
  onHide: () => void;
};

const BSOD = ({ isVisible, onHide }: BSODProps) => {
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = setTimeout(() => {
      onHide();
    }, 6000);

    return () => clearTimeout(timer);
  }, [isVisible, onHide]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-900 font-mono text-white">
      <div className="max-w-2xl p-8">
        <div className="mb-4">
          <h1 className="font-bold text-2xl">
            A problem has been detected and your portfolio has been shut down to
            prevent damage to your computer.
          </h1>
        </div>

        <div className="mb-4">
          <p className="text-lg">KOD_EASTER_EGG_NON_CRITICAL_SYSTEM_FAILURE</p>
        </div>

        <div className="mb-4">
          <p>
            If this is the first time you've seen this stop error screen,
            restart your computer. If this screen appears again, follow these
            steps:
          </p>
        </div>

        <div className="mb-4 space-y-2">
          <p>
            Check to be sure any new hardware or software is properly installed.
            If this is a new installation, ask your hardware or software
            manufacturer for any portfolio updates you might need.
          </p>
        </div>

        <div className="mb-4">
          <p>
            If problems continue, disable or remove any newly installed
            software. Disable BIOS memory options such as caching or shadowing.
            If you need to use Safe Mode to remove or disable components,
            restart your computer, press F8 to select Advanced Startup Options,
            and then select Safe Mode.
          </p>
        </div>

        <div className="mb-4">
          <p>Technical information:</p>
        </div>

        <div className="mb-4">
          <p>
            *** STOP: 0x0000007B (0xC0000034, 0x00000000, 0x00000000,
            0x00000000)
          </p>
        </div>

        <div className="mb-4">
          <p>
            *** kapat.sys - Address FFFFF880009A99C0 base at FFFFF880009A3000,
            DateStamp 4a5bbf38
          </p>
        </div>

        <div className="mt-4">
          <p className="animate-pulse text-sm">
            Collecting error data... {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BSOD;
