const test=require('node:test');const assert=require('node:assert/strict');
require('../ocr-parser.js');const parse=globalThis.NNParseDocument;
test('Japanese rows, quantities and thousands separators',()=>{const d=parse('品目 数量 単価 金額\n日常清掃 3 回 10,000 32,000円\n資材費 1 式 2,000 2,000\n小計 34,000\n消費税(10%) 3,400\n合計 37,400');assert.equal(d.items.length,2);assert.deepEqual(d.items[0],{name:'日常清掃',quantity:'3',unit_price:'10000',amount:'32000',uncertain:true});assert.equal(d.subtotal,'34000');assert.equal(d.tax,'3400');assert.equal(d.total,'37400');});
test('malformed and ambiguous numbers remain blank without shifted columns',()=>{const d=parse('清掃 3 10,.000 32,.000\n資材 1 2.000 2.000\n小計34.000\n消費税3.400\n合計37,400');assert.equal(d.items[0].quantity,'3');assert.equal(d.items[0].unit_price,'');assert.equal(d.items[0].amount,'');assert.equal(d.items[1].amount,'');assert.equal(d.tax,'');assert.equal(d.subtotal,'');assert.equal(d.total,'37400');assert.ok(d.warnings.length);});
test('missing totals and tax are not zero',()=>{const d=parse('清掃 2 100 200');assert.equal(d.tax,'');assert.equal(d.total,'');});
test('conflicting totals remain blank',()=>{assert.equal(parse('合計 1000\n合計 2000').total,'');assert.equal(parse('合計 1,000\n合計 1000').total,'1000');});
test('full width numbers and decimal quantities',()=>{const d=parse('清掃 １．５ １００ １５０\n消費税 １５\n合計 １６５');assert.equal(d.items[0].quantity,'1.5');assert.equal(d.total,'165');});
test('dates and incomplete two-column lines do not become items',()=>{const d=parse('2026年10月26日\n発行番号 123 456 789\n清掃 100 200\n合計 300');assert.equal(d.items.length,0);});
test('negative values are not silently converted to positive',()=>{const d=parse('値引き 1 -100 -100');assert.equal(d.items[0].unit_price,'');assert.equal(d.items[0].amount,'');});

test('tax-rate-only headings do not become tax amounts',()=>{assert.equal(parse('消費税(10%)\n合計(税込10%)').tax,'');assert.equal(parse('消費税(10%)\n合計(税込10%)').total,'');});
