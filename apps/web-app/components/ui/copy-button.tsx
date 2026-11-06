import { useState } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  value: string;
  className?: string;
  size?: number;
}

export function CopyButton({ value, className = '', size = 13 }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className={`h-5 w-5 p-0 text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100 ${className}`}
      title="Copiar texto"
    >
      {copied ? <IconCheck size={size} className="text-green-500" /> : <IconCopy size={size} />}
    </Button>
  );
}
