import { ShoppingListItem } from '../types';

export function consolidateIngredients(items: ShoppingListItem[]): ShoppingListItem[] {
  const consolidated = new Map<string, ShoppingListItem>();

  items.forEach((item) => {
    const key = `${item.name.toLowerCase()}-${item.unit.toLowerCase()}`;
    if (consolidated.has(key)) {
      const existing = consolidated.get(key)!;
      existing.quantity += item.quantity;
    } else {
      consolidated.set(key, { ...item });
    }
  });

  return Array.from(consolidated.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function generateShoppingListEmail(items: ShoppingListItem[]): string {
  const consolidated = consolidateIngredients(items);
  const body = consolidated
    .map(item => `- ${item.quantity} ${item.unit} ${item.name}`)
    .join('\n');

  return `mailto:?subject=Liste de courses&body=${encodeURIComponent(body)}`;
}

export function printShoppingList(items: ShoppingListItem[]): void {
  const consolidated = consolidateIngredients(items);
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const content = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Liste de courses</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #2563eb;
            margin-bottom: 20px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
          }
          ul {
            list-style-type: none;
            padding: 0;
          }
          li {
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
          }
          .quantity {
            color: #6b7280;
          }
          @media print {
            body {
              padding: 0;
            }
            h1 {
              color: black;
            }
          }
        </style>
      </head>
      <body>
        <h1>Liste de courses</h1>
        <ul>
          ${consolidated.map(item => `
            <li>
              <span>${item.name}</span>
              <span class="quantity">${item.quantity} ${item.unit}</span>
            </li>
          `).join('')}
        </ul>
      </body>
    </html>
  `;

  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.print();
}
