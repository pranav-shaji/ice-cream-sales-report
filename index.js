const fs = require("fs");
const path = require("path");

//readfile and extract
const filePath = path.join(__dirname, "sales-data.txt");
const salesData = fs.readFileSync(filePath, "utf-8").trim().split("\n");

const headers = salesData[0].split(",");
const records = salesData.slice(1).map((line) => {
  const [date, sku, unitPrice, quantity, totalPrice] = line.split(",");
  return {
    date: new Date(date),
    sku,
    unitPrice: parseInt(unitPrice, 10),
    quantity: parseInt(quantity, 10),
    totalPrice: parseInt(totalPrice, 10),
  };
});

// Total sales of the store
const totalSales = records.reduce((sum, record) => sum + record.totalPrice, 0);
//console.log(`accumulator: ${totalSales} and currentval ${records.totalPrice}`);
console.log("Total Sales of the Store:", totalSales);


//extra feature,to find the total quantity of the store
const totalQuantity = records.reduce((sum, record) => sum + record.quantity, 0);
console.log("Total Quantity of the Store", totalQuantity);



//  Month-wise sales totals
const monthWiseSales = {};
for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const month = record.date.toISOString().slice(0, 7);
    if (!monthWiseSales[month]) {
        monthWiseSales[month] = 0; } monthWiseSales[month] += record.totalPrice;
}
console.log("Month-wise Sales Totals", monthWiseSales);



// Most popular item in each month.
const mostPopularItems = {};
records.forEach(record => {
    const month = record.date.toISOString().slice(0, 7);
    if (!mostPopularItems[month]) mostPopularItems[month] = {};
    mostPopularItems[month][record.sku] = (mostPopularItems[month][record.sku] || 0) + record.quantity;
});
const mostPopularPerMonth = Object.fromEntries(
    Object.entries(mostPopularItems).map(([month, items]) => {
        const mostPopular = Object.entries(items).reduce((a, b) => (b[1] > a[1] ? b : a));
        return [month, { item: mostPopular[0], quantity: mostPopular[1] }];
    })
);

console.log("Most Popular Item in Each Month", mostPopularPerMonth);



// generating the most revenue in each month
const monthlyRevenue = {};
records.forEach(record => {
    const month = record.date.toISOString().slice(0, 7);
    if (!monthlyRevenue[month]) monthlyRevenue[month] = {};
    monthlyRevenue[month][record.sku] = (monthlyRevenue[month][record.sku] || 0) + record.totalPrice;
});
const topRevPerMonth = Object.fromEntries(
    Object.entries(monthlyRevenue).map(([month, items]) => {
        const topRevenue = Object.entries(items).reduce((a, b) => (b[1] > a[1] ? b : a));
        return [month, { item: topRevenue[0], revenue: topRevenue[1] }];
    })
);
console.log("Top Revenue Items in Each Month", topRevPerMonth);

//Min, max, and average orders for the most popular item each month
const popularItemsEachMonth = {};
Object.entries(mostPopularPerMonth).forEach(([month, { item }]) => {
    const quantities = records.filter(record => record.date.toISOString().slice(0, 7) === month && record.sku === item)
.map(record => record.quantity);
        popularItemsEachMonth[month] = {
        min: Math.min(...quantities),
        max: Math.max(...quantities),
        average: quantities.reduce((sum, q) => sum + q, 0) / quantities.length,
    };
});
console.log("min,max,average of months is", popularItemsEachMonth);


