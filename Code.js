function doGet(e) {
  const action = e.parameter.action || 'getProducts';
  if (action === 'getOrders') {
    return ContentService.createTextOutput(JSON.stringify(getOrders()))
      .setMimeType(ContentService.MimeType.JSON);
  } else if (action === 'getCustomers') {
    return ContentService.createTextOutput(JSON.stringify(getCustomers()))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    return ContentService.createTextOutput(JSON.stringify(getProducts()))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products');
  const data = JSON.parse(e.postData.contents);
  
  if (data.action === 'addProduct' || data.action === 'updateProduct') {
    const productData = [
      data.id,
      data.name,
      data.category,
      data.price,
      data.stock,
      data.description,
      data.image, // Now stores local path like /public/images/product-1.jpg
      data.status
    ];
    
    if (data.action === 'addProduct') {
      sheet.appendRow(productData);
    } else {
      const sheetData = sheet.getDataRange().getValues();
      for (let i = 1; i < sheetData.length; i++) {
        if (sheetData[i][0] === data.id) {
          sheet.getRange(i + 1, 1, 1, 8).setValues([productData]);
          break;
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: data.action === 'addProduct' ? 'Product added' : 'Product updated' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getProducts() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Products');
  const data = sheet.getDataRange().getValues();
  const products = [];
  
  for (let i = 1; i < data.length; i++) {
    products.push({
      id: data[i][0],
      name: data[i][1],
      category: data[i][2],
      price: data[i][3],
      stock: data[i][4],
      description: data[i][5],
      image: data[i][6],
      status: data[i][7]
    });
  }
  
  return products;
}

function getOrders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders');
  const data = sheet.getDataRange().getValues();
  const orders = [];
  
  for (let i = 1; i < data.length; i++) {
    orders.push({
      id: data[i][0],
      customer: data[i][1],
      products: JSON.parse(data[i][2] || '[]'),
      total: data[i][3],
      date: data[i][4],
      status: data[i][5]
    });
  }
  
  return orders;
}

function getCustomers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Customers');
  const data = sheet.getDataRange().getValues();
  const customers = [];
  
  for (let i = 1; i < data.length; i++) {
    customers.push({
      id: data[i][0],
      name: data[i][1],
      email: data[i][2],
      phone: data[i][3],
      orders: data[i][4],
      totalSpent: data[i][5]
    });
  }
  
  return customers;
}