import type React from "react";
import { useState } from "react";

const NotepadApp: React.FC = () => {
  const [content, setContent] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-card/80 p-4 shadow-black/10 shadow-inner sm:p-6">
      <textarea
        className="min-h-[50vh] flex-1 resize-none rounded-2xl border border-border/40 bg-background/80 p-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:text-lg"
        onChange={handleChange}
        placeholder="Buraya notlarınızı yazın..."
        value={content}
      />
    </div>
  );
};

export default NotepadApp;
