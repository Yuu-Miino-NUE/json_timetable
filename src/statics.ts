type Semester = '前' | '後';
type Quarter = 'Q1' | 'Q2' | 'Q3' | 'Q4';
type Day = '月' | '火' | '水' | '木' | '金';
type Periods = 1 | 2 | 3 | 4 | 5
type Grade = '学部' | '大学院'
interface TTEntryTimes {
    semester: Semester,
    quarter?: Quarter,
    day: Day,
    periods: Periods[]
}
export interface TTEntry {
    grade: Grade,
    year: number,
    times: TTEntryTimes[],
    subject: number,
    room: string,
    lecturers: string[],
    credits: number
}

export const grades: Grade[] = ['学部', '大学院'];
export const semesters: Semester[] = ['前', '後'];
export const quarters: Quarter[] = ['Q1', 'Q2', 'Q3', 'Q4'];
export const days: Day[] = ['月', '火', '水', '木', '金'];
export const periods: Periods[] = [1, 2, 3, 4, 5];
export type AndOr = 'and' | 'or';
export type Sort = 'time' | 'subject';

/* ファイルアップロード＋ダミーダウンロード HTML */
export function writeFileInput (
    divID: string,
    onUpload: (event: Event)=>void,
    onDownload: (event: MouseEvent)=>void
) {
    const inputID = 'uploadFile';
    const btnID = 'btnUploadFile';
    const downBtnID = 'btnDownloadDummy';
    const fileInput =
        '<input class="form-control" type="file" id="'+inputID+'" accept=".json" hidden multiple>'+
        '<button class="btn btn-primary me-3" style="width: 120pt" id="'+btnID+'">'+
        '<i class="bi bi-file-earmark-arrow-up me-1"></i>アップロード</button>'+
        '<button class="btn btn-outline-primary" style="width: 120pt" id="'+downBtnID+'">'+
        '<i class="bi bi-file-earmark-arrow-down-fill me-1"></i>テンプレート</button>'+
        '<div class="invalid-feedback pt-2">ファイル読み込みに失敗しました．フォーマットを確認してください．</div>';

    const divDom = document.getElementById(divID);
    if (divDom) divDom.innerHTML = fileInput;

    const inputDom = document.getElementById(inputID);
    const btnDom = document.getElementById(btnID);
    const downBtnDom = document.getElementById(downBtnID);

    if (btnDom && inputDom){
        inputDom.addEventListener('change', onUpload);
        btnDom.addEventListener('click', ()=>inputDom.click());
    }
    if (downBtnDom) downBtnDom.addEventListener('click', onDownload);
}

/* ファイル操作パネル HTML */
export function writeFileOperate (
    divID: string,
    onAdd: (event: Event)=>void,
    onDownload: (event: MouseEvent)=>void,
    onReset: (event: MouseEvent)=>void
) {
    const inputAddID = 'addFile';
    const btnAddID = 'btnAddFile';
    const btnDownloadID = 'btnDownloadFile';
    const btnResetID = 'btnResetJSON';
    const fileOperate =
        '<input class="form-control" type="file" id="'+inputAddID+'" accept=".json" hidden multiple>'+
        '<button class="btn btn-outline-primary me-3" id="'+btnAddID+'">'+
        '<i class="bi bi-file-earmark-plus-fill me-1"></i>ファイル追加</button>'+
        '<button class="btn btn-outline-secondary me-3" id="'+btnDownloadID+'">'+
        '<i class="bi bi-file-earmark-arrow-down-fill me-1"></i>ファイル保存</button>'+
        '<button class="btn btn-outline-danger me-3" id="'+btnResetID+'">'+
        '<i class="bi bi-trash-fill me-1"></i>リセット</button>'+
        '<span class="small text-muted" role="button" data-bs-toggle="modal" data-bs-target="#fileOpModal">'+
        '<i class="bi bi-exclamation-circle me-1"></i>ファイル操作の注意点</span>'+
        '<div class="invalid-feedback my-2">ファイル読み込みに失敗しました．フォーマットを確認してください．</div>'+
        '<div class="modal fade" id="fileOpModal" tabindex="-1" aria-hidden="true">'+
        '<div class="modal-dialog modal-dialog-centered">'+
        '<div class="modal-content">'+
        '<div class="modal-header"><h5 class="modal-title">'+
        '<i class="bi bi-exclamation-circle me-1"></i>ファイル操作の注意点</h5></div>'+
        '<div class="modal-body small">'+
        '閲覧・編集中のデータはブラウザに保存されています．<br>'+
        'キャッシュを削除するなどすると，ブラウザのデータは失われます．<br>'+
        'ブラウザのデータを編集しても PC 上のファイルは編集されません．<br>'+
        '必要に応じて「ファイル保存」してください．'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>';
    const divDom = document.getElementById(divID);
    if (divDom) divDom.innerHTML = fileOperate;

    const btnAddDom = document.getElementById(btnAddID);
    const inputAddDom = document.getElementById(inputAddID);
    const btnDownloadDom = document.getElementById(btnDownloadID);
    const btnResetDom = document.getElementById(btnResetID);

    if (btnAddDom && inputAddDom ){
        btnAddDom.addEventListener('click', ()=>inputAddDom.click());
        inputAddDom.addEventListener("change", onAdd);
    }
    if (btnDownloadDom) btnDownloadDom.addEventListener('click', onDownload);
    if (btnResetDom) btnResetDom.addEventListener('click', onReset);
}

/* 検索文字列入力フィールド HTML */
export function writeFilter (
    divID: string,
    capitalState: boolean,
    bachelorState: boolean,
    masterState: boolean,
    onAORadioChange: (event: Event)=>void,
    onKeyup: (event: KeyboardEvent)=>void,
    onCapital: (event: Event)=>void,
    onBachelor: (event: Event)=>void,
    onMaster: (event: Event)=>void
) {
    const radioName = 'andOrRadios';
    const filter = '<div class="input-group">'+
    '<input type="text" class="form-control" id="filterInput" placeholder="検索キーワード"></input>'+
    [{id: 'radioAnd', label: 'AND 検索'}, {id: 'radioOr', label: 'OR 検索'}].map((v, i)=>(
        '<input class="btn-check" type="radio" name="'+radioName+'" '+
        'id="'+v.id+'" value='+i+' '+(i==0?'checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="'+v.id+'">'+v.label+'</label>'
    )).join('')+
    '<input class="btn-check" type="checkbox" name="capital" id="capital" '+(capitalState?'checked':'')+'>'+
    '<label class="btn btn-outline-secondary" for="capital">大文字区別</label>'+
    '<input class="btn-check" type="checkbox" name="bachelor" id="bachelor" '+(bachelorState?'checked':'')+'>'+
    '<label class="btn btn-outline-success" for="bachelor">学部</label>'+
    '<input class="btn-check" type="checkbox" name="master" id="master" '+(masterState?'checked':'')+'>'+
    '<label class="btn btn-outline-primary" for="master">大学院</label>'+
    '</div>';

    const divDom = document.getElementById(divID);
    if (divDom) divDom.innerHTML = filter;

    const filterInputDom = document.getElementById("filterInput");
    const capitalDom = document.getElementById("capital");
    const bachelorDom = document.getElementById("bachelor");
    const masterDom = document.getElementById("master");

    document.querySelectorAll("input[name='"+radioName+"']").forEach((dom)=>(
        dom.addEventListener('change', onAORadioChange)
    ));
    if (filterInputDom) filterInputDom.addEventListener("keyup", onKeyup);
    if (capitalDom) capitalDom.addEventListener("change", onCapital);
    if (bachelorDom) bachelorDom.addEventListener("change", onBachelor);
    if (masterDom) masterDom.addEventListener("change", onMaster);
}

/* 表示切替ラジオボタン HTML  */
export function writeLCRadios (
    divID: string,
    onChange: (evnet: Event)=>void
) {
    const radioName = 'btnLCRadio';
    const radiosLabels = ['<i class="bi bi-list-ul me-1"></i>リスト表示', '<i class="bi bi-calendar3 me-1"></i>カレンダー表示'];
    const radios = radiosLabels.map((value, index,)=>(
        '<input type="radio" class="btn-check" name="'+radioName+'" id="'+radioName+index+'" value="'+index+'" autocomplete="off"'+(index==0?' checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="'+radioName+index+'" style="width: 120pt">'+value+'</label>'
    )).join('');
    const radiosGroup = '<div class="btn-group" role="group">'+radios+'</div><hr class="mt-4">';

    const divDom = document.getElementById(divID);
    if (divDom) divDom.innerHTML = radiosGroup;

    document.querySelectorAll("input[name='"+radioName+"']").forEach((dom)=>(
        dom.addEventListener('change', onChange)
    ));
}

/* カレンダー表示 HTML */
export function writeCalendar(
    divID: string,
    json: TTEntry[],
    keyFilter: number[]
) {
    type YS = {year: number, semesIdx: number}
    var ysPair: YS[] = [];
    keyFilter.forEach(k=>{
        json[k].times.forEach(jt=>{
            const idx = semesters.indexOf(jt.semester);
            if (!ysPair.some(ysp=>ysp.year == json[k].year && ysp.semesIdx == idx)) {
                ysPair.push({year: json[k].year, semesIdx: idx});
            }
        });
    });
    ysPair = ysPair.sort((a, b)=>{
        if (a.year > b.year) {return 1;}
        else if (a.year < b.year){ return -1;}
        else { return a.semesIdx-b.semesIdx;}
    }).filter((value, index, self)=>(
        index === self.findIndex((t) => (
            t.year == value.year && t.semesIdx == value.semesIdx
        ))
    ));

    /* カレンダーの各科目のフォーマット */
    const subjectInCal = (data: TTEntry, index: number) => (
        '<div class="card '+(data.grade=='学部'? 'text-white bg-success':'text-white bg-primary')+' border-1 m-0 mb-0" role="button" '+
        'data-bs-toggle="modal" data-bs-target="#modal'+index+'"><div class="card-body p-1">'+
        '<h6 class="card-title mb-0">'+data.subject+'</h6>'+
        '<p class="card-text small">'+data.lecturers.join(', ')+'<br>@'+
        data.room+
        // ' <i class="bi bi-pencil-square text-primary stretched-link no-print" role="button" '+
        // 'data-bs-toggle="modal" data-bs-target="#modal'+index+'"></i>'+
        '</p>'+
        '</div></div>'
    );

    const calBody = ysPair.map((ys, ysi)=>(
        '<div class="mb-5 d-block">'+ // E
        '<div '+(ysi==ysPair.length-1 ? '':'class="break-after"')+'>'+ // D
        '<h4 class="mb-3">'+ys.year+' 年度 '+semesters[ys.semesIdx]+'期</h4>'+
        '<div class="mb-3 row d-flex justify-content-center px-0">'+ // C
        '<div class="row"><div class="col-1 col-1half border d-flex align-items-center justify-content-center text-light bg-dark">時限</div>'+
        '<div class="col row">'+days.map(d=>('<div class="col border d-flex align-items-center justify-content-center text-light bg-dark">'+d+'</div>')).join('')+'</div></div>'+
        periods.map(p=>(
            '<div class="row">'+ // B
            '<div class="col-1 col-1half border d-flex align-items-center justify-content-center text-light bg-secondary">'+p+'</div>'+
            '<div class="col row">'+ // A
            days.map(d=>(
                '<div class="col border p-0">'+
                [...json.keys()].filter(k=>
                    (keyFilter.includes(k) && json[k].year==ys.year && json[k].times.some(jt=>jt.semester==semesters[ys.semesIdx] && jt.day==d && jt.periods.includes(p)))
                ).map(k=>subjectInCal(json[k], k)).join('')+'</div>'
            )).join('')+
            '</div>'+ // A
            '</div>' // B
        )).join('')+
        '</div>'+ // C
        '</div>'+ // D
        '</div>' // E
    )).join('');
    const divDom = document.getElementById(divID);
    if (divDom) divDom.innerHTML = (keyFilter.length == 0 ? '<div class="text-muted text-center">該当データはありません．</div>' : calBody);
}

/* リスト表示 HTML */
export function writeList(
    divID: string,
    json: TTEntry[],
    keyFilter: number[],
    sortState: Sort,
    onSort: (event: Event)=>void
) {
    const listHeaderLabels: Array<{key: keyof(TTEntry), label: string}> = [
        {key: 'grade',      label: '対象'},
        {key: 'year',       label: '年度'},
        {key: 'times',      label: '学期・曜日・時限'},
        {key: 'subject',    label: '科目番号'},
        {key: 'lecturers',  label: '担当教員'},
        {key: 'room',       label: '教室'}
    ];
    const listHeader =
        '<thead class="text-center">' + listHeaderLabels.map((value)=>(
            '<th id="lh_'+value.key+'" scope="col">'+value.label+'</th>'
        )).join('') +
        '</thead>';

    const listBody = '<tbody>'+json.map((js, i)=>(
        keyFilter.includes(i) ? ('<tr role="button" data-bs-toggle="modal" data-bs-target="#modal'+i+'">'+
        listHeaderLabels.map((value)=>{
            var ret: string = '';
            if (value.key == 'times') {
                ret = "（"+js.times.map(t=>Object.values(t).join('・')).join('，')+"）";
            } else if (value.key == 'lecturers') {
                ret = js[value.key].join(', ');
            } else if (value.key == 'grade') {
                ret = '<span class="badge '+(js[value.key]=='学部'?'bg-success':'bg-primary')+'">'+js[value.key]+'</span>';
            }
            else {
                ret = String(js[value.key]);
            }
            return '<td class="text-center">'+ret+'</td>';
        }).join('')+
        '</tr>'):''
    )).join('')+'</tbody>';

    const radioName = 'sortRadio';
    const sorts: Array<{value: Sort, label: string}> = [
        {value: 'time',     label: '<i class="bi bi-clock me-1"></i>時系列順'},
        {value: 'subject',  label: '<i class="bi bi-123 me-1"></i>科目番号順'}
    ];
    const sortBtns = '<div class="btn-group" role="group">'+sorts.map((v, i)=>(
        '<input type="radio" class="btn-check" name="'+radioName+'" id="'+radioName+i+'" value="'+i+'" '+(sortState==v.value?'checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="'+radioName+i+'" style="width: 120pt">'+v.label+'</label>'
    )).join(' ')+'</div>';

    const divDom = document.getElementById(divID);
    if (divDom) divDom.innerHTML = '<div class="mb-3 no-print">'+sortBtns+'</div>'+
    '<table class="table table-hover print">' + listHeader + listBody + '</table>';
    document.querySelectorAll("input[name='"+radioName+"']").forEach((dom)=>(
        dom.addEventListener('change', onSort)
    ));
}

/* JSON 編集画面の設置 */
export function writeModals(
    divID: string,
    json: TTEntry[],
    keyFilter: number[],
    onDelete: (index: number)=>void,
    onReplace: (index: number, dataID: string)=>void
){
    const modals = keyFilter.map(i=> (
        '<div class="modal fade" id="modal'+i+'" tabindex="-1" aria-labelledby="modalH5_'+i+'" aria-hidden="true">'+
        '<div class="modal-dialog modal-dialog-centered">'+
        '<div class="modal-content">'+
        '<div class="modal-header">'+
        '<h5 class="modal-title" id="modalH5_'+i+'"><i class="bi bi-pencil-square"></i> 時間割データ編集</h5>'+
        '<button type="button" class="btn-close" data-bs-dismiss="modal"></button>'+
        '</div>'+
        '<div class="modal-body">'+
        '<textarea class="form-control" rows="20" id="newJson'+i+'">'+JSON.stringify(json[i], null, '\t')+'</textarea>'+
        '</div>'+
        '<div class="modal-footer justify-content-between">'+
        '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal" id="deleteItemBtn'+i+'"><i class="bi bi-trash-fill me-1"></i>削除</button>'+
        '<div><button type="button" class="btn btn-secondary me-2" data-bs-dismiss="modal"><i class="bi bi-x me-1"></i>閉じる</button>'+
        '<button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="replaceItemBtn'+i+'"><i class="bi bi-file-earmark-check me-1"></i>一時保存</button></div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'
    )).join('');

    const divDom = document.getElementById(divID);
    if (divDom) divDom.innerHTML = modals;

    keyFilter.forEach(i=>{
        const delDom = document.getElementById('deleteItemBtn'+i);
        const repDom = document.getElementById('replaceItemBtn'+i);

        if (delDom) delDom.addEventListener('click', ()=>onDelete(i));
        if (repDom) repDom.addEventListener('click', ()=>onReplace(i, 'newJson'+i));
    });
}

/* JSON が様式に合うかざっくりチェック */
export function writeWarning(
    divID: string,
    json: TTEntry[]
){
    var warnMsg = '';
    json.forEach(j=>{
        j.times.forEach(jt=>{
            if (!semesters.includes(jt.semester)) {
                warnMsg += '<i class="bi bi-exclamation-triangle"></i> '+j.subject+': '+jt.semester+' は学期の様式に合いません．<br>';
            }
            if ( jt.periods.some(p=>!periods.includes(p)) ) {
                warnMsg += '<i class="bi bi-exclamation-triangle"></i> '+j.subject+': '+jt.periods+' は時限の様式に合いません．<br>';
            }
            if (!days.includes(jt.day)) {
                warnMsg += '<i class="bi bi-exclamation-triangle"></i> '+j.subject+': '+jt.day+' は曜日の様式に合いません．<br>';
            }
        })
    });
    const divDom = document.getElementById(divID);
    if (divDom) divDom.innerHTML = '<span class="text-warning">'+warnMsg+'</span>';
    if (warnMsg.length > 0) {
        showHTML(divID);
    } else {
        hideHTML(divID);
    }
}

/* HTML の表示・非表示切替 */
export function showHTML(id: string) {
    const dom = document.getElementById(id);
    if (dom) dom.classList.remove('d-none');
}
export function hideHTML(id: string) {
    const dom = document.getElementById(id);
    if (dom) dom.classList.add('d-none');
}
