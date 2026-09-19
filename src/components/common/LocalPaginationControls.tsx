import { ChevronLeft, ChevronRight } from "lucide-react";

interface LocalPaginationControlsProps {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function LocalPaginationControls({ page, pageSize, totalItems, totalPages, onPageChange }: LocalPaginationControlsProps) {
  if (totalItems <= pageSize) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return <nav className="local-pagination" aria-label="本地分页">
    <span>显示 {start}–{end} · 共 {totalItems} 条</span>
    <div>
      <button disabled={page === 1} onClick={() => onPageChange(1)}>首页</button>
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="上一页"><ChevronLeft size={14} /> 上一页</button>
      <form onSubmit={(event) => {
        event.preventDefault();
        onPageChange(Number(new FormData(event.currentTarget).get("page")));
      }}>
        <label>第 <input key={`${page}-${totalPages}`} name="page" type="number" required min={1} max={totalPages} step={1} defaultValue={page} aria-label="跳转页码" /> / {totalPages} 页</label>
        <button type="submit">跳转</button>
      </form>
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>下一页 <ChevronRight size={14} /></button>
      <button disabled={page === totalPages} onClick={() => onPageChange(totalPages)}>末页</button>
    </div>
  </nav>;
}
