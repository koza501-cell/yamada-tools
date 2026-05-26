import type { CSSProperties, HTMLAttributes } from 'react';

export type EmojiSize = 'sm' | 'md' | 'lg' | 'xl';

const sizePx: Record<EmojiSize, string> = {
  sm: '16px',
  md: '20px',
  lg: '24px',
  xl: '32px',
};

const EMOJI_FONT =
  '"Noto Color Emoji", "Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';

interface EmojiProps extends HTMLAttributes<HTMLSpanElement> {
  symbol: string;
  size?: EmojiSize;
  label?: string;
}

export default function Emoji({
  symbol,
  size = 'md',
  label,
  className,
  style,
  ...props
}: EmojiProps) {
  const emojiStyle: CSSProperties = {
    fontSize: sizePx[size],
    fontFamily: EMOJI_FONT,
    lineHeight: 1,
    display: 'inline-block',
    verticalAlign: 'middle',
    ...style,
  };

  return (
    <span
      role={label ? 'img' : 'presentation'}
      aria-label={label ?? undefined}
      aria-hidden={label ? undefined : true}
      className={className}
      style={emojiStyle}
      {...props}
    >
      {symbol}
    </span>
  );
}
