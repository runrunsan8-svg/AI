(function(){
 const el=id=>document.getElementById(id);
 let worker=null,busy=false,cancelled=false,pdf=null;
 function progress(s){el('ocr-status').textContent=s;}
 async function recognize(image){
  if(!worker){
   progress('無料OCRを準備しています。初回は読み込みに時間がかかります。');
   const base=new URL('vendor/',location.href);
   worker=await Tesseract.createWorker('jpn',1,{workerPath:new URL('worker.min.js',base).href,workerBlobURL:false,corePath:new URL('tesseract-core-lstm.wasm.js',base).href,langPath:base.href,gzip:false,cacheMethod:'none',logger:m=>{if(!cancelled&&m.status==='recognizing text')progress('文字を読み取り中… '+Math.round(m.progress*100)+'%');}});
  }
  if(cancelled)throw Error('読み取りを中止しました。');
  const result=await worker.recognize(image);return result.data.text;
 }
 async function pdfText(file){
  const lib=await import('./vendor/pdf.mjs');lib.GlobalWorkerOptions.workerSrc=new URL('vendor/pdf.worker.mjs',location.href).href;
  pdf=await lib.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,cMapUrl:new URL('vendor/cmaps/',location.href).href,cMapPacked:true,standardFontDataUrl:new URL('vendor/standard_fonts/',location.href).href}).promise;
  if(pdf.numPages>5)throw Error('この試作品はPDF5ページまでです。必要なページを分けて添付してください。');
  let out='';
  for(let n=1;n<=pdf.numPages;n++){
   if(cancelled)throw Error('読み取りを中止しました。');
   progress(`PDF ${n} / ${pdf.numPages}ページを確認中…`);
   const page=await pdf.getPage(n);const content=await page.getTextContent();
   const groups=[];
   for(const token of content.items){if(!token.str?.trim())continue;const y=token.transform[5],x=token.transform[4];let group=groups.find(g=>Math.abs(g.y-y)<3);if(!group){group={y,cells:[]};groups.push(group);}group.cells.push({x,text:token.str});}
   const text=groups.sort((a,b)=>b.y-a.y).map(g=>g.cells.sort((a,b)=>a.x-b.x).map(c=>c.text).join(' ')).join('\n');
   if((text.match(/\d/g)||[]).length>=12){out+=text+'\n';}
   else{
    const initial=page.getViewport({scale:1});const scale=Math.min(2,2500/Math.max(initial.width,initial.height));const view=page.getViewport({scale});const canvas=document.createElement('canvas');canvas.width=Math.ceil(view.width);canvas.height=Math.ceil(view.height);const context=canvas.getContext('2d');context.fillStyle='white';context.fillRect(0,0,canvas.width,canvas.height);
    await page.render({canvasContext:context,viewport:view}).promise;out+=await recognize(canvas)+'\n';canvas.width=canvas.height=0;
   }
   page.cleanup();
  }
  return out;
 }
 function apply(text){
  const parsed=NNParseDocument(text);
  const names=Array.from(document.querySelectorAll('[data-key="name"]')).some(i=>i.value.trim());
  if(names&&!confirm('現在の入力内容を読み取り候補に置き換えますか？（保存済みの書類は残ります）')){progress('読み取り文を表示しました。入力欄は変更していません。');return;}
  const previous={title:el('title').value,vendor:el('vendor').value,kind:el('kind').value};
  fill({...previous,rate:10,tax:parsed.tax,total:parsed.total,subtotal:parsed.subtotal,tax_uncertain:true,items:parsed.items.length?parsed.items:[{name:'',quantity:'',unit_price:'',amount:'',uncertain:true}]});
  el('ocr-notes').textContent=`明細候補 ${parsed.items.length}行。すべて要確認です。列は「数量→単価→小計」の順と仮定しています。税率は10%の仮設定です。\n`+[...new Set(parsed.warnings)].join('\n');
  progress('読み取り候補を入力しました。抜け・数字・列の順番を原本と照合してください。');
  el('editor').scrollIntoView({block:'start'});
 }
 el('ocr-start').onclick=async()=>{
  if(busy)return;
  const file=attachment;
  if(!file){progress('先に画像・PDFを添付してください。');return;}
  busy=true;cancelled=false;el('ocr-start').disabled=true;el('ocr-cancel').disabled=false;
  const controls=Array.from(document.querySelectorAll('main button:not(#ocr-start):not(#ocr-cancel), main input, main select, main textarea')).map(node=>[node,node.disabled]);for(const [node] of controls)node.disabled=true;
  el('ocr-notes').textContent='';el('ocr-text').value='';
  try{
   let text;
   if(file.type==='application/pdf')text=await pdfText(file);
   else{
    const image=await createImageBitmap(file);try{
     if(image.width*image.height>24000000)throw Error('画像が大きすぎます。2400万画素以下に縮小して添付してください。');
     const scale=Math.min(1,2500/Math.max(image.width,image.height));const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);const context=canvas.getContext('2d');context.fillStyle='white';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);text=await recognize(canvas);canvas.width=canvas.height=0;
    }finally{image.close();}
   }
   if(cancelled)throw Error('読み取りを中止しました。');
   el('ocr-text').value=text;
   if(!text.trim())throw Error('文字を読み取れませんでした。文字が正面から鮮明に写った画像で再試行してください。');
   apply(text);
  }catch(e){progress(cancelled?'読み取りを中止しました。':'読み取りできませんでした。'+(e.message||'別の書類で試すか、手入力してください。'));}
  finally{
   if(worker){await worker.terminate();worker=null;}if(pdf){await pdf.destroy();pdf=null;}
   busy=false;el('ocr-start').disabled=false;el('ocr-cancel').disabled=true;for(const [node,disabled] of controls)node.disabled=disabled;
  }
 };
 el('ocr-cancel').onclick=()=>{cancelled=true;progress('現在のページの処理が終わり次第、中止します。');el('ocr-cancel').disabled=true;};
 el('ocr-apply').onclick=()=>{if(busy)return;const text=el('ocr-text').value;if(!text.trim()){progress('読み取り文がありません。先にOCRを実行してください。');return;}apply(text);};
 window.NNOCRBusy=()=>busy;
})();
