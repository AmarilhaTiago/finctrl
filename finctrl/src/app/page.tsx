export default function Home() {
  return (
    <div className="min-h-screen bg-base p-6">
      <h1 className="text-2xl font-semibold text-text-primary mb-4">FinCtrl Design Tokens</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-surface p-5 rounded-lg border border-stroke">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Surface</span>
        </div>
        <div className="bg-card p-5 rounded-lg border border-stroke">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Card</span>
        </div>
        <div className="bg-card-elevated p-5 rounded-lg border border-stroke">
          <span className="text-text-secondary text-xs uppercase tracking-wide">Elevated</span>
        </div>
        <div className="bg-accent/12 p-5 rounded-lg">
          <span className="text-accent text-xs uppercase tracking-wide">Accent</span>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <span className="text-positive font-semibold">+R$ 1.200,00</span>
        <span className="text-negative font-semibold">-R$ 850,00</span>
        <span className="text-warning font-semibold">⚠ 82%</span>
      </div>
    </div>
  );
}
