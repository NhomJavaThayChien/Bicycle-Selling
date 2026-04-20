export default function Pagination({ page, setPage }) {
  return (
    <div>
      <button onClick={() => setPage(page - 1)}>Prev</button>
      <span>{page}</span>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
