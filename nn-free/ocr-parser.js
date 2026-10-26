// Conservative table candidates, never a correctness or confidence judgment.
(function(root){
 function parseDocument(text){
  const rows=[],warnings=[],values={subtotal:[],tax:[],total:[]};
  const lines=text.normalize('NFKC').replace(/[−–]/g,'-').split(/\r?\n/);
  const number=/[-+]?\d[\d,.]*/g;
  for(const raw of lines){
   const line=raw.trim();if(!line)continue;
   const matches=[...line.matchAll(number)];if(!matches.length)continue;
   const last=matches.at(-1)[0];
   const summarySuffix=line.slice(matches.at(-1).index+matches.at(-1)[0].length).trim();
   if((/小\s*計|合\s*計|消\s*費\s*税|税\s*額|請求金額|請求額|総額/.test(line))&&!/^[円¥￥|｜\s]*$/.test(summarySuffix))continue;
   if(/小\s*計|税\s*抜\s*(?:金額|合計)|税抜き/.test(line)){values.subtotal.push(last);continue;}
   if(/消\s*費\s*税|税\s*額/.test(line)&&!/税込|内税/.test(line)){values.tax.push(last);continue;}
   if(/合\s*計|請求金額|請求額|税込金額|総額/.test(line)){values.total.push(last);continue;}
   if(/数量|単価|金額|見積|請求書|契約|発行|\d{2,4}年|\d+月\d+日|TEL|FAX|電話|登録番号|口座|振込|〒/i.test(line))continue;
   if(matches.length<3)continue;
   const cells=matches.slice(-3);const name=line.slice(0,cells[0].index).trim().replace(/[|｜:：]+$/,'').trim();
   if(!name||!/[\p{L}]/u.test(name))continue;
   const suffix=line.slice(cells[2].index+cells[2][0].length).trim();
   if(suffix&&!/^[円¥￥|｜\s]*$/.test(suffix)){warnings.push('列の並びを判断できない行があります。原本と照合してください。');continue;}
   const nums=cells.map((c,index)=>{
    const raw=c[0];
    // A decimal point may be a misread thousands separator: require confirmation.
    if((index>0&&/^\d{1,3}\.\d{3}$/.test(raw))||!/^\d+(?:,\d{3})*(?:\.\d{1,4})?$/.test(raw)){
     warnings.push(`${name}：「${raw}」の数字・区切りを判断できないため空欄にしました。原本から入力してください。`);return '';
    }
    const clean=raw.replaceAll(',','');
    if(!/^\d{1,10}(\.\d{1,4})?$/.test(clean)){warnings.push(name+'：桁数や符号を確認してください。');return '';}
    return clean;
   });
   rows.push({name,quantity:nums[0],unit_price:nums[1],amount:nums[2],uncertain:true});
  }
  const unique=k=>{
   const label=({subtotal:'小計',tax:'消費税',total:'合計'})[k];
   const raw=values[k];
   if(raw.some(x=>/^\d{1,3}\.\d{3}$/.test(x)||!/^\d+(?:,\d{3})*(?:\.\d{1,4})?$/.test(x))){warnings.push(label+'の数字・区切りが曖昧です。原本から入力してください。');return '';}
   const xs=[...new Set(raw.map(x=>x.replaceAll(',','')))];
   if(xs.length>1)warnings.push('複数の'+label+'候補があります。原本から入力してください。');
   return xs.length===1&&/^\d{1,10}(\.\d{1,4})?$/.test(xs[0])?xs[0]:'';
  };
  const result={items:rows.slice(0,100),subtotal:unique('subtotal'),tax:unique('tax'),total:unique('total'),warnings};
  if(rows.length>100)warnings.push('100行を超えた候補は入力していません。');
  if(!rows.length)warnings.push('数量・単価・金額が横に並ぶ明細を認識できませんでした。読み取り文を確認して手入力してください。');
  if(!result.tax)warnings.push('消費税を特定できません。税がない書類は0を入力してください。');
  if(!result.total)warnings.push('合計を特定できません。原本の合計を入力してください。');
  return result;
 }
 root.NNParseDocument=parseDocument;
})(globalThis);
