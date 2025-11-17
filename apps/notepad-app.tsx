import type React from "react";
import { useState } from "react";

const NotepadApp: React.FC = () => {
  const [content, setContent] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
  };

  return (
    <div className="flex h-full flex-col bg-card p-4">
      <textarea
        className="flex-1 resize-none rounded-md border border-border bg-background p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        onChange={handleChange}
        placeholder="Buraya notlarınızı yazın..."
        value={content}
      />
    </div>
  );
};

export default NotepadApp;
