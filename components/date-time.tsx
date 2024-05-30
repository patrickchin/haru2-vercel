export default function DateTime({ date }: { date?: Date }) {
  if (!date) return null;
  return (
    <time dateTime={date.toISOString()} suppressHydrationWarning>
      {date.toLocaleString()}
    </time>
  );
}
