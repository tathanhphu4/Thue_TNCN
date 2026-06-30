export const aggregateDeclarationsByYear = (declarations, fields) => {
  const dataMap = {};

  declarations.forEach(d => {
    if (!dataMap[d.year]) {
      const entry = { year: String(d.year) };
      for (const key of Object.keys(fields)) {
        entry[key] = 0;
      }
      dataMap[d.year] = entry;
    }

    for (const [key, { source, paidOnly }] of Object.entries(fields)) {
      if (paidOnly && d.status !== 'paid') continue;
      dataMap[d.year][key] += d[source] || 0;
    }
  });

  return Object.values(dataMap).sort((a, b) => parseInt(a.year) - parseInt(b.year));
};

export const countDeclarationsByYear = (declarations) => {
  const dataMap = {};

  declarations.forEach(d => {
    if (!dataMap[d.year]) {
      dataMap[d.year] = { year: String(d.year), count: 0, paidRevenue: 0 };
    }
    dataMap[d.year].count += 1;
    if (d.status === 'paid') {
      dataMap[d.year].paidRevenue += d.taxAmount || 0;
    }
  });

  return Object.values(dataMap).sort((a, b) => parseInt(a.year) - parseInt(b.year));
};
