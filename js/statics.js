export const semesters = ['前', '後'];
export const days = ['月', '火', '水', '木', '金'];
export const periods = [1, 2, 3, 4, 5];

/* ファイルアップロード＋ダミーダウンロード HTML */
export function writeFileInput (domID, onUpload, onDownload) {
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
    document.getElementById(domID).innerHTML = fileInput;
    document.getElementById(btnID).addEventListener('click', ()=>document.getElementById(inputID).click());
    document.getElementById(downBtnID).addEventListener('click', onDownload);
    document.getElementById(inputID).addEventListener("change", onUpload);
}

/* ファイル操作パネル HTML */
export function writeFileOperate (domID, onAdd, onDownload, onReset) {
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
    document.getElementById(domID).innerHTML = fileOperate;
    document.getElementById(btnAddID).addEventListener('click', ()=>document.getElementById(inputAddID).click());
    document.getElementById(inputAddID).addEventListener("change", onAdd);
    document.getElementById(btnDownloadID).addEventListener('click', onDownload);
    document.getElementById(btnResetID).addEventListener('click', onReset);
}

/* 検索文字列入力フィールド HTML */
export function writeFilter (domID, capitalState, onAORadioChange, onKeyup, onCapital) {
    const radioName = 'andOrRadios';
    const filter = '<div class="input-group">'+
    '<input type="text" class="form-control" id="filterInput" placeholder="検索キーワード"></input>'+
    [{id: 'radioAnd', value: 'and', label: 'AND 検索'}, {id: 'radioOr', value: 'or', label: 'OR 検索'}].map((v, i)=>(
        '<input class="btn-check" type="radio" name="'+radioName+'" '+
        'id="'+v.id+'" value="'+v.value+'" '+(i==0?'checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="'+v.id+'">'+v.label+'</label>'
    )).join('')+
    '<input class="btn-check" type="checkbox" name="capital" id="capital" '+(capitalState?'checked':'')+'>'+
    '<label class="btn btn-outline-secondary" for="capital">大文字区別</label>'+
    '</div>';

    document.getElementById(domID).innerHTML = filter;
    document.querySelectorAll("input[name='"+radioName+"']").forEach((dom)=>(
        dom.addEventListener('change', onAORadioChange)
    ));
    document.getElementById("filterInput").addEventListener("keyup", onKeyup);
    document.getElementById("capital").addEventListener("change", onCapital);
}

/* 表示切替ラジオボタン HTML  */
export function writeLCRadios (domID, onChange) {
    const radioName = 'btnLCRadio';
    const radiosLabels = ['<i class="bi bi-list-ul me-1"></i>リスト表示', '<i class="bi bi-calendar3 me-1"></i>カレンダー表示'];
    const radios = radiosLabels.map((value, index,)=>(
        '<input type="radio" class="btn-check" name="'+radioName+'" id="'+radioName+index+'" value="'+index+'" autocomplete="off"'+(index==0?' checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="'+radioName+index+'" style="width: 120pt">'+value+'</label>'
    )).join('');
    const radiosGroup = '<div class="btn-group" role="group">'+radios+'</div><hr class="mt-4">';
    document.getElementById(domID).innerHTML = radiosGroup;

    document.querySelectorAll("input[name='"+radioName+"']").forEach((dom)=>(
        dom.addEventListener('change', onChange)
    ));
}

/* カレンダー表示 HTML */
export function writeCalendar(domID, json, keyFilter) {
    var ysPair = [];
    keyFilter.forEach(k=>{
        json[k].times.forEach(jt=>{
            if (!ysPair.some(ysp=>ysp.year == json[k].year && ysp.semester === jt.semester)) {
                ysPair.push({year: json[k].year, semester: semesters.indexOf(jt.semester)});
            }
        });
    });
    ysPair = ysPair.sort((a, b)=>{
        if (a.year > b.year) return 1;
        if (a.year == b.year) return a.semester-b.semester;
        if (a.year < b.year) return -1;
    }).filter((value, index, self)=>(
        index === self.findIndex((t) => (
            t.year == value.year && t.semester == value.semester
        ))
    ));

    /* カレンダーの各科目のフォーマット */
    function subjectInCal (data, index) {
        return '<div class="card border-0 m-0 mb-0"><div class="card-body p-1">'+
        '<h6 class="card-title mb-0">'+data.subject+'</h6>'+
        '<p class="card-text small">'+data.lecturers.join(', ')+'<br>'+
        data.room+' <i class="bi bi-pencil-square text-primary stretched-link no-print" role="button" '+
        'data-bs-toggle="modal" data-bs-target="#modal'+index+'"></i>'+
        '</p>'+
        '</div></div>';
    }

    const calBody = ysPair.map((ys, ysi)=>(
        '<div class="mb-5 d-block">'+ // E
        '<div '+(ysi==ysPair.length-1 ? '':'class="break-after"')+'>'+ // D
        '<h4 class="mb-3">'+ys.year+' 年度 '+semesters[ys.semester]+'期</h4>'+
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
                    (keyFilter.includes(k) && json[k].year==ys.year && json[k].times.some(jt=>jt.semester==semesters[ys.semester] && jt.day==d && jt.periods.includes(p)))
                ).map(k=>subjectInCal(json[k], k)).join('')+'</div>'
            )).join('')+
            '</div>'+ // A
            '</div>' // B
        )).join('')+
        '</div>'+ // C
        '</div>'+ // D
        '</div>' // E
    )).join('');
    document.getElementById(domID).innerHTML = calBody;
}

/* リスト表示 HTML */
export function writeList(domID, json, keyFilter, sortState, onSort) {
    const listHeaderLabels = [
        {key: 'year',       label: '年度'},
        {key: 'times',       label: '学期・曜日・時限'},
        {key: 'subject',    label: '科目番号'},
        {key: 'lecturers',  label: '担当教員'},
        {key: 'room',       label: '教室'}
    ];
    const listHeader =
        '<thead>' + listHeaderLabels.map((value)=>(
            '<th id="lh_'+value.key+'" scope="col">'+value.label+'</th>'
        )).join('') +
        '</thead>';

    const listBody = '<tbody>'+json.map((js, i)=>(
        keyFilter.includes(i) ? ('<tr role="button" data-bs-toggle="modal" data-bs-target="#modal'+i+'">'+
        listHeaderLabels.map((value)=>{
            var ret = '';
            if (value.key == 'times') {
                ret = "（"+js.times.map(t=>Object.values(t).join('・')).join('，')+"）";
            } else if (Array.isArray(js[value.key])) {
                ret = js[value.key].join(', ');
            } else {
                ret = js[value.key];
            }
            return '<td>'+ret+'</td>';
        }).join('')+
        '</tr>'):''
    )).join('')+'</tbody>';

    const radioName = 'sortRadio';
    const sortBtns = '<div class="btn-group" role="group">'+
    ['<i class="bi bi-clock me-1"></i>時系列順', '<i class="bi bi-123 me-1"></i>科目番号順'].map((v, i)=>(
        '<input type="radio" class="btn-check" name="'+radioName+'" id="'+radioName+i+'" value="'+i+'" '+(i==sortState?'checked':'')+'>'+
        '<label class="btn btn-outline-secondary" for="'+radioName+i+'" style="width: 120pt">'+v+'</label>'
    )).join(' ')+'</div>';

    document.getElementById(domID).innerHTML = '<div class="mb-3 no-print">'+sortBtns+'</div>'+
    '<table class="table table-hover print">' + listHeader + listBody + '</table>';
    document.querySelectorAll("input[name='"+radioName+"']").forEach((dom)=>(
        dom.addEventListener('change', onSort)
    ));
}

/* JSON 編集画面の設置 */
export function writeModals(domID, json, keyFilter, onDelete, onReplace){
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
    document.getElementById(domID).innerHTML = modals;

    keyFilter.forEach(i=>{
        document.getElementById('deleteItemBtn'+i).addEventListener('click', ()=>onDelete(i));
        document.getElementById('replaceItemBtn'+i).addEventListener('click', ()=>onReplace(i));
    });
}

/* JSON が様式に合うかざっくりチェック */
export function writeWarning(domID, json){
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
    document.getElementById(domID).innerHTML = '<span class="text-warning">'+warnMsg+'</span>';
    if (warnMsg.length > 0) {
        showHTML(domID);
    } else {
        hideHTML(domID);
    }
}

/* HTML の表示・非表示切替 */
export function showHTML(id) {
    document.getElementById(id).classList.remove('d-none');
}
export function hideHTML(id) {
    document.getElementById(id).classList.add('d-none');
}
