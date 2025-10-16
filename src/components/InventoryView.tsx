import type { Product } from '../lib/types';

// Fixed: Updated to use sellingPrice instead of price - Force rebuild
export default function InventoryView({ products }: { products: Product[] }) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Inventory</h2>
      <table className="table">
        <thead>
          <tr>
            <th className="text-left">Product</th>
            <th>Stock</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td className={p.stock <= 0 ? 'text-red-600' : ''}>{p.stock}</td>
              <td>{typeof p.sellingPrice === 'number' ? p.sellingPrice.toFixed(2) : '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
