const domains = [
 {id:'rest',name:'休息・心身の調子',description:'ひとりで回復する時間や、身体の心地よさを大切にする。',checks:['昼と夜の周辺音・隣室音を確認する','寝室の日当たり・遮光・換気を確かめる','浴室・寝具を置く場所に無理がないか測る']},
 {id:'work',name:'仕事・学び・成長',description:'集中して取り組み、知識や技能を育てる時間を大切にする。',checks:['机と椅子を置く寸法・コンセント位置を測る','ネット回線の方式・契約条件を確認する','通勤経路と、集中できる作業場所を確認する']},
 {id:'connection',name:'人とのつながり',description:'友人や家族との交流、地域との接点を大切にする。',checks:['会いたい人への移動時間と終電を調べる','来客・宿泊に関する契約条件を確認する','近所に無理なく立ち寄れる交流の場があるか歩く']},
 {id:'expression',name:'趣味・創作・自分らしさ',description:'好きなものに触れ、自分の世界を深めることを大切にする。',checks:['趣味の道具・作品・本の置き場所を測る','楽器・音・DIYなどの規約を確認する','好きな雰囲気や光を、実際の室内で確かめる']},
 {id:'freedom',name:'自由・体験・移動',description:'新しい場所や体験へ、身軽に出かけられることを大切にする。',checks:['駅・交通手段まで実際に歩く','自転車置き場や荷物の受取方法を確認する','外出先へのアクセスと、帰宅経路を比較する']},
 {id:'stability',name:'家計・暮らしの整えやすさ',description:'お金や家事に見通しを持ち、無理なく日々を回すことを大切にする。',checks:['家賃以外の固定費・更新料・初期費用も比較する','スーパー・病院などへの距離を確認する','洗濯・調理・掃除の動線と収納量を確かめる']}
];
const questions = [
 ['今の空間｜身近な場所に何がありますか？','部屋や机の上を思い浮かべてください。よく使うもの・すぐ手に取れるものは何ですか。持ち物の値段や部屋の広さではなく、普段の使い方で選びます。'],
 ['時間｜自由な時間を何に使っていますか？','最近の平日の夜や休日を思い出してください。仕事や義務以外で、自分から時間を使っていたことに近いものを選びます。'],
 ['エネルギー｜自然と力が入ることは何ですか？','最近、自分から動いたり、夢中になったりした場面を思い出してください。得意かどうかではなく、手間をかけても取り組んでいたことから選びます。'],
 ['お金｜自分で選んで何に使っていますか？','最近の買い物や支出を思い出してください。家賃や税金など避けられない支出より、使い道を自分で選べたお金に注目します。金額の大小は問いません。'],
 ['継続｜言われなくても続けていることは？','毎日・毎週など、自然に繰り返していることを思い出してください。周りから期待されることより、自分で整えたり、予定に入れてきたことから選びます。'],
 ['関心｜気づくと何を考えていますか？','移動中やひと息ついたとき、自然に浮かぶことは何でしょう。よく検索すること、つい人に話したくなることも手がかりにします。']
];
const examples = [
 ['寝具・ケア用品・運動道具をよく使う','机・本・学習ノート・パソコンをよく使う','写真や贈り物を飾る・人を迎える場所がある','趣味の道具・作品・好きなものが身近にある','旅行用品・自転車・外出道具をよく使う','調理器具・収納用品・家計簿をよく使う'],
 ['眠る・休む・身体を動かす時間を取る','仕事の準備・勉強・読書に取り組む','友人や家族に会う・連絡を取り合う','音楽・ゲーム・料理など好きなことに没頭する','散歩・旅行・初めての店へ出かける','掃除・作り置き・家計の管理をする'],
 ['調子を整えるために運動や休み方を工夫する','難しい仕事や勉強にも集中して取り組む','人の相談に乗る・会うために段取りする','趣味や創作なら手間をかけても夢中になれる','初めての場所や体験のために自分から動く','片づけやくらしの改善に力を入れる'],
 ['寝具・入浴・身体のケアにお金を使った','本・講座・仕事道具を買った','人と会う食事や贈り物に使った','趣味の道具・作品・好きなものを買った','旅行・お出かけ・新しい体験に使った','家事の時短や節約のための道具を買った'],
 ['睡眠・運動・休む時間を自分で確保する','勉強や仕事の目標を立てて続けている','人に連絡する・会う予定を立てる','趣味や創作の時間を繰り返しつくる','行ったことのない場所や体験を探す','片づけ・作り置き・支出の確認を続ける'],
 ['体調・睡眠・心地よく過ごす方法を考える','仕事の目標・学びたいことを考える','友人や家族のこと・次に会う予定を考える','好きな作品・趣味・作りたいものを考える','行きたい場所・新しく体験したいことを考える','くらしにかかるお金・家事・暮らしを整える方法を考える']
];
let step=0;const answers=questions.map(()=>({ranks:['','',''],evidence:''}));
const $=id=>document.getElementById(id);
function showQuestion(focus=false){
 $('assessment').hidden=false;$('results').hidden=true;
 $('step-label').textContent=`質問 ${step+1} / ${questions.length}`;$('progress').value=step+1;
 $('question-title').textContent=questions[step][0];$('question-help').textContent=questions[step][1];
 renderChoices();
 $('evidence').value=answers[step].evidence;$('previous').disabled=step===0;$('next').textContent=step===questions.length-1?'結果を見る →':'次へ →';$('form-error').textContent='';if(focus)$('question-title').focus();
}
function renderChoices(){
 const selected=answers[step].ranks.filter(Boolean);
 $('rank-fields').replaceChildren(...domains.map((d,i)=>{
  const button=document.createElement('button');button.type='button';button.className='value-choice';button.dataset.value=d.id;
  const position=selected.indexOf(d.id);button.setAttribute('aria-pressed',String(position>=0));
  const badge=document.createElement('span');badge.className='choice-badge';badge.textContent=position>=0?`${position+1}番目`:'＋';
  const text=document.createElement('span');const example=document.createElement('strong');example.textContent=examples[step][i];const name=document.createElement('small');name.textContent=d.name;text.append(example,name);button.append(badge,text);
  button.addEventListener('click',()=>{
   const current=answers[step].ranks.filter(Boolean);const index=current.indexOf(d.id);
   if(index>=0)current.splice(index,1);else if(current.length<3)current.push(d.id);else{$('form-error').textContent='3つ選択済みです。入れ替えるときは、選んだカードを押して取り消してください。';return;}
   answers[step].ranks=current;renderChoices();$('form-error').textContent='';
   document.querySelector(`[data-value="${d.id}"]`).focus();
  });return button;
 }));
 $('choice-status').textContent=selected.length===3?`3つ選べました。「${step===questions.length-1?'結果を見る':'次へ'}」へ進めます。`:`${selected.length} / 3 選択済み → ${selected.length+1}番目に近いものを選んでください。`;
}
function remember(){answers[step].evidence=$('evidence').value;}
$('values-form').addEventListener('submit',e=>{e.preventDefault();remember();if(answers[step].ranks.filter(Boolean).length!==3){$('form-error').textContent=`あと${3-answers[step].ranks.filter(Boolean).length}つ、最近の自分に近いカードを選んでください。`;return;}if(step<questions.length-1){step++;showQuestion(true);}else showResults();});
$('previous').addEventListener('click',()=>{remember();if(step>0){step--;showQuestion(true);}});
function showResults(){
 const scores=Object.fromEntries(domains.map(d=>[d.id,0]));answers.forEach(a=>a.ranks.forEach((id,i)=>scores[id]+=3-i));
 const sorted=[...domains].sort((a,b)=>scores[b.id]-scores[a.id]);$('ranking').replaceChildren();$('home-criteria').replaceChildren();
 sorted.forEach((d,i)=>{const rank=1+sorted.filter(other=>scores[other.id]>scores[d.id]).length;const row=document.createElement('div');row.className='ranking-row';const line=document.createElement('div');line.className='ranking-label';const title=document.createElement('strong');title.textContent=`${rank}位　${d.name}`;const score=document.createElement('span');score.textContent=`${scores[d.id]}点 / ${Math.round(scores[d.id]/36*100)}%`;line.append(title,score);const track=document.createElement('div');track.className='score-track';const bar=document.createElement('div');bar.className='score-fill';bar.style.width=`${scores[d.id]/18*100}%`;track.append(bar);const desc=document.createElement('p');desc.textContent=d.description;row.append(line,track,desc);$('ranking').append(row);
 if(scores[d.id]>0 && scores[d.id]>=scores[sorted[2].id]){const group=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=d.name;group.append(legend);d.checks.forEach(text=>{const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';label.append(input,document.createTextNode(text));group.append(label);});$('home-criteria').append(group);}
 });
 $('evidence-review').replaceChildren(...answers.map((a,i)=>{const p=document.createElement('p');p.textContent=`${i+1}. ${questions[i][0]}
${a.ranks.map((id,j)=>`${j+1}位：${domains.find(d=>d.id===id).name}`).join(' ／ ')}
${a.evidence.trim()||'行動メモなし'}`;return p;}));
 $('assessment').hidden=true;$('results').hidden=false;$('result-title').focus();
}
$('edit').addEventListener('click',()=>{step=0;showQuestion(true);});$('print').addEventListener('click',()=>window.print());$('restart').addEventListener('click',()=>{if(!window.confirm('回答を消して、最初からやり直しますか？'))return;answers.forEach(a=>{a.ranks=['','',''];a.evidence='';});step=0;showQuestion(true);});showQuestion();
