import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- Invoice Generator ---
export const downloadInvoice = (order) => {
    // 1. Initialize jsPDF
    const doc = new jsPDF();

    // 2. Header
    doc.setFontSize(20);
    doc.text("INVOICE", 105, 20, null, null, "center");
    
    doc.setFontSize(10);
    doc.text("boAt Lifestyle Clone", 105, 26, null, null, "center");
    doc.text("support@boatclone.com", 105, 31, null, null, "center");

    // 3. Order Info (Left) & Customer Info (Right)
    const startY = 45;
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    
    // Left Side
    doc.text(`Order ID: #${order._id.toUpperCase()}`, 14, startY);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, startY + 6);
    doc.text(`Status: ${order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}`, 14, startY + 12);
    doc.text(`Payment: ${order.paymentMethod}`, 14, startY + 18);

    // Right Side
    const rightX = 140;
    doc.text("Bill To:", rightX, startY);
    doc.setTextColor(0); // Black for name
    doc.text(order.user?.name || (order.user?.email ? order.user.email.split('@')[0] : "Guest"), rightX, startY + 6);
    doc.setTextColor(100);
    doc.text(order.shippingAddress?.address || "", rightX, startY + 12);
    doc.text(`${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}`, rightX, startY + 18);
    doc.text(order.shippingAddress?.country || "India", rightX, startY + 24);

    // 4. Table
    const tableColumn = ["Item", "Quantity", "Price", "Total"];
    const tableRows = [];

    order.orderItems.forEach(item => {
        const itemData = [
            item.name,
            item.qty || item.quantity,
            `Rs. ${item.price}`,
            `Rs. ${(item.price * (item.qty || item.quantity)).toFixed(2)}`
        ];
        tableRows.push(itemData);
    });

    // Use autoTable as a function passing the doc instance
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: startY + 35,
        theme: 'grid',
        headStyles: { fillColor: [235, 59, 59] }, // boAt Red-ish
        styles: { fontSize: 9 },
    });

    // 5. Summary
    // Access finalY from lastAutoTable property on doc (set by the autoTable function)
    const finalY = doc.lastAutoTable.finalY + 10;
    const summaryX = 140;

    doc.text(`Subtotal:`, summaryX, finalY);
    doc.text(`Rs. ${order.itemsPrice || order.totalPrice}`, 195, finalY, null, null, "right");

    doc.text(`Tax:`, summaryX, finalY + 6);
    doc.text(`Rs. ${order.taxPrice || 0}`, 195, finalY + 6, null, null, "right");

    doc.text(`Shipping:`, summaryX, finalY + 12);
    doc.text(`Rs. ${order.shippingPrice || 0}`, 195, finalY + 12, null, null, "right");

    // Divider line
    doc.setDrawColor(200);
    doc.line(summaryX, finalY + 16, 195, finalY + 16);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(`Total:`, summaryX, finalY + 22);
    doc.text(`Rs. ${order.totalPrice}`, 195, finalY + 22, null, null, "right");

    // 6. Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for shopping with us!", 105, 280, null, null, "center");

    // Save
    doc.save(`Invoice_${order._id}.pdf`);
};

// --- CSV Export (General) ---
export const exportToCSV = (data, filename = 'export.csv') => {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    // 1. Extract Headers
    const headers = Object.keys(data[0]);
    
    // 2. Format CSV Content based on headers
    const csvRows = [
        headers.join(','), // Header row
        ...data.map(row => headers.map(fieldName => {
            const val = row[fieldName];
            // Handle commas or quotes in data
            const escaped = ('' + (val || '')).replace(/"/g, '""'); 
            return `"${escaped}"`;
        }).join(','))
    ];

    const csvString = csvRows.join('\n');

    // 3. Create Blob & Download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
