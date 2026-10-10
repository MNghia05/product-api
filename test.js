const assert = require('assert');
const Product = require('./models/Product');

async function main() {
  // Test 1: thiếu pid thì phải bị lỗi validate
  const thieuPid = new Product({ pname: 'Test', price: 1000, quantity: 5 });
  await assert.rejects(() => thieuPid.validate(), /pid/);
  console.log('PASS: thieu pid bi tu choi');

  // Test 2: đủ dữ liệu thì hợp lệ
  const hopLe = new Product({ pid: 'P999', pname: 'Test', price: 1000, quantity: 5 });
  await hopLe.validate();
  console.log('PASS: san pham hop le');

  console.log('Tat ca test deu PASS');
}

main().catch((e) => {
  console.error('FAIL:', e.message);
  process.exit(1);
});