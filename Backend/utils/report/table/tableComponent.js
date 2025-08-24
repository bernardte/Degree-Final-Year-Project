export const addTableRow = (doc, y, columns, widths, alignments = []) => {
    let x = 50;
  columns.forEach((text, i) => {
    const width = widths[i];
    const alignment = alignments[i] || "left";
    doc.text(text, x, y, { width, align: alignment });
    x += width;
  });

  return y + 30;
};

export const addTableHeader = (doc, y, headers, widths, alignments = {} ) => {
    doc.fontSize(10).font("Helvetica-Bold")
    y = addTableRow(doc, y, headers, widths, alignments);
    doc.fontSize(10).font("Helvetica");
    doc.moveTo(50, y - 5).lineTo(50 + widths.reduce((a, b) => a + b, 0), y - 5).stroke();

    return y;
}   
