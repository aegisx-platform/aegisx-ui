---
title: Reports & Exports
description: Guides for generating reports, PDF exports, and data visualization
category: guides
tags: [reports, pdf, charts, export]
---

# Reports & Exports

Comprehensive guides for generating reports, exporting data, and creating visualizations.

## Available Guides

### ⚡ [PDF Charts Quick Start](./pdf-charts-quick-start.md)

Get started with PDF charts in 5 minutes! Perfect for developers who want to quickly add charts to their reports.

- 3-step quick start guide
- All chart types with examples
- Basic configuration
- Common use cases
- Quick troubleshooting

**Recommended for**: First-time users, quick reference

---

### 📊 [PDF Charts Guide](./pdf-charts-guide.md)

Complete guide for adding visual analytics to PDF reports using charts. Learn how to:

- Use different chart types (bar, line, pie, doughnut)
- Choose the right color schemes
- Position charts effectively
- Create inventory-specific reports
- Apply best practices for data visualization

**Key Topics**:

- Chart types and when to use them
- Color schemes and visual design
- Inventory-specific examples
- Performance optimization
- Troubleshooting common issues

**Recommended for**: In-depth understanding, best practices

---

### 🔧 [PDF Template Charts Integration](./pdf-template-charts-integration.md)

Comprehensive integration guide for using charts within the PDF template system.

- Architecture and data flow
- Direct PDFMakeService approach
- Template System approach
- Multiple chart examples
- Best practices and patterns

**Recommended for**: Template customization, advanced integration

## Common Use Cases

### Inventory Reports

Generate professional inventory reports with charts:

```typescript
import { PDFMakeService } from '@api/services/pdfmake.service';

const pdfService = new PDFMakeService();

const report = await pdfService.generatePdf({
  title: 'รายงานมูลค่าคงคลัง',
  data: inventoryData,
  fields: stockFields,
  charts: [
    {
      type: 'bar',
      position: 'before',
      data: stockByLocation,
      options: {
        title: 'มูลค่าคงคลังแยกตามหน่วยงาน',
        colorScheme: 'primary',
      },
    },
  ],
});
```

### Budget Reports

Create budget performance dashboards:

```typescript
const budgetReport = await pdfService.generatePdf({
  title: 'Dashboard งบประมาณ',
  charts: [
    { type: 'line', position: 'before', data: trendData },
    { type: 'pie', position: 'before', data: allocationData },
  ],
  data: transactions,
});
```

### Alert Reports

Generate critical alert reports with visualizations:

```typescript
const alertReport = await pdfService.generatePdf({
  title: 'รายงานยาใกล้หมดอายุ',
  charts: [
    {
      type: 'bar',
      position: 'before',
      data: urgencyData,
      options: { colorScheme: 'danger' },
    },
  ],
  data: expiringDrugs,
});
```

## Quick Links

### Guides

- **[PDF Charts Quick Start](./pdf-charts-quick-start.md)** - 5-minute quick start
- **[PDF Charts Guide](./pdf-charts-guide.md)** - Comprehensive chart usage guide
- **[PDF Template Charts Integration](./pdf-template-charts-integration.md)** - Template integration guide

### API Reference

- **[Chart Generation API](../../reference/api/chart-generation-api.md)** - Chart service API
- **[PDF Export API](../../reference/api/pdf-export-api.md)** - PDF export API

### Migration & Setup

- **[PDF Templates Migration](../../migrations/pdf-templates-migration-improvement.md)** - Template migration guide

## Related Documentation

- **[Inventory Features](../../features/inventory/README.md)** - Inventory system
- **[Budget Features](../../features/budget/README.md)** - Budget management
- **[API Reference](../../reference/api/README.md)** - API documentation

---

Choose a guide above to get started with reports and exports!
