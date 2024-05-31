export default function DateTime({ dateString }: { dateString: Date }) {
  return (
    <time
      dateTime={(dateString as unknown as Date).toISOString()}
      suppressHydrationWarning
    >
      {(dateString as unknown as Date).toLocaleString()}
    </time>
  );
}
